// Locations panels: list and detail
function normalizeTrainerMetaText(value) {
  var out = (value || '').trim();
  if (!out || /^\(?none\)?$/i.test(out)) return '';
  return out;
}
function trainerMatchesLocation(trainer, loc) {
  if (!trainer || !loc) return false;
  var trainerLocation = normalizeTrainerMetaText(trainer.location);
  if (!trainerLocation) return false;
  var trainerLocID = toID(trainerLocation);
  return trainerLocID === toID(loc.id) || trainerLocID === toID(loc.name);
}
function getTrainersForLocation(loc) {
  return (window.Trainers || []).filter(function(trainer) {
    return trainerMatchesLocation(trainer, loc);
  });
}
function staticEncounterMatchesLocation(staticEncounter, loc) {
  if (!staticEncounter || !loc) return false;
  var staticLocation = normalizeTrainerMetaText(staticEncounter.location);
  if (!staticLocation) return false;
  var staticLocID = toID(staticLocation);
  return staticLocID === toID(loc.id) || staticLocID === toID(loc.name);
}
function getStaticEncountersForLocation(loc) {
  var staticEncounters = window.StaticEncounters || {};
  return Object.keys(staticEncounters).map(function(id) {
    return staticEncounters[id];
  }).filter(function(staticEncounter) {
    return staticEncounterMatchesLocation(staticEncounter, loc);
  });
}

window.PokedexLocationsPanel = PokedexResultPanel.extend({
  initialize: function () {
    this.shortTitle = 'Locations';
    this.allLocations = (window.Locations || []).slice();
    this.filteredLocations = this.allLocations;
    
    var buf = '<div class="pfx-body"><form class="pokedex">';
    buf += '<h1><a href="'+Config.baseurl+'" data-target="replace">Pok&eacute;dex</a></h1>';
    buf += '<ul class="tabbar centered" style="margin-bottom: 18px">';
    buf += '<li><a class="button nav-first" href="' + Config.baseurl + 'dex" data-target="push">Search</a></li>';
    buf += '<li><a class="button" href="' + Config.baseurl + 'pokemon/" data-target="push">Pok&eacute;mon</a></li>';
    buf += '<li><a class="button" href="' + Config.baseurl + 'moves/" data-target="push">Moves</a></li>';
    buf += '<li><a class="button" href="' + Config.baseurl + 'abilities/" data-target="push">Abilities</a></li>';
    buf += '<li><a class="button" href="' + Config.baseurl + 'items/" data-target="push">Items</a></li>';
    buf += '<li><a class="button" href="' + Config.baseurl + 'mechanics/" data-target="push">Mechanics</a></li>';
    buf += '<li><a class="button cur" href="' + Config.baseurl + 'locations/" data-target="push">Locations</a></li>';
    buf += '<li><a class="button" href="' + Config.baseurl + 'trainers/" data-target="push">Trainers</a></li>';
    buf += '<li><a class="button nav-last" href="' + Config.baseurl + 'usage/" data-target="push">Usage</a></li>';
    buf += '</ul>';
    buf += '<div class="searchboxwrapper"><input class="textbox searchbox" type="search" name="q" value="" autocomplete="off" placeholder="Search locations by name, Pokémon, item, or trainer..." /></div>';
    buf += '</form>';
    buf += '<div class="dexentry">';
    buf += '<a href="' + Config.baseurl + 'dex" class="pfx-backbutton" data-target="back"><i class="fa fa-chevron-left"></i> Pokédex</a>';
    buf += '<h1><a href="' + Config.baseurl + 'locations/" data-target="push" class="subtle">Locations</a></h1>';

    buf += '<ul class="utilichart nokbd location-results">';
    buf += '</ul>';

    buf += '</div></div>';
    this.html(buf);
    
    this.renderLocationList(this.filteredLocations);
  },
  events: {
    'input .searchbox': 'handleSearch',
    'keydown .searchbox': 'handleSearchKeydown'
  },
  handleSearchKeydown: function(e) {
    if (e.keyCode === 13) { // Enter key
      e.preventDefault();
      e.stopPropagation();
    }
  },
  handleSearch: function(e) {
    var query = this.$('.searchbox').val().toLowerCase().trim();
    var self = this;

    if (!query) {
      this.filteredLocations = this.allLocations;
      this.renderLocationList(this.filteredLocations);
      return;
    }

    // Detect if query matches any Pokémon name (partial)
    var matchingPokemonIds = new Set();
    for (var pokeId in BattlePokedex) {
      var poke = BattlePokedex[pokeId];
      if (poke && poke.name && poke.name.toLowerCase().indexOf(query) >= 0) {
        matchingPokemonIds.add(pokeId);
      }
    }

    if (matchingPokemonIds.size > 0) {
      // Pokémon search mode: categorise by "Owned by Trainer" and "Wild Encounter"
      var trainerLocations = [];
      var wildLocations = [];

      this.allLocations.forEach(function(loc) {
        if (!loc) return;

        // Check if any trainer mapped to this location owns the Pokémon
        var hasTrainer = false;
        var locTrainers = getTrainersForLocation(loc);
        for (var bi = 0; bi < locTrainers.length; bi++) {
          var trainer = locTrainers[bi];
          if (trainer && (trainer.team || []).some(function(m) {
              var disp = window.translateDisplayName ? window.translateDisplayName(m.name || '') : (m.name || '');
              return matchingPokemonIds.has(toID(disp));
          })) {
            hasTrainer = true;
            break;
          }
        }

        // Check wild encounters
        var hasWild = false;
        if (loc.encounters) {
          for (var ei = 0; ei < loc.encounters.length; ei++) {
            var encounter = loc.encounters[ei];
            if (encounter.pokemon) {
              for (var pi = 0; pi < encounter.pokemon.length; pi++) {
                var mon = encounter.pokemon[pi];
                if (mon.name) {
                  var translated = window.translateDisplayName ? window.translateDisplayName(mon.name) : mon.name;
                  if (matchingPokemonIds.has(toID(translated))) { hasWild = true; break; }
                }
                if (!hasWild && mon.sos && Array.isArray(mon.sos)) {
                  for (var si = 0; si < mon.sos.length; si++) {
                    var sosT = window.translateDisplayName ? window.translateDisplayName(mon.sos[si]) : mon.sos[si];
                    if (matchingPokemonIds.has(toID(sosT))) { hasWild = true; break; }
                  }
                }
              }
            }
            if (hasWild) break;
          }
        }

        if (hasTrainer) trainerLocations.push(loc);
        if (hasWild) wildLocations.push(loc);
      });

      this.renderLocationListByPokemon(trainerLocations, wildLocations);
    } else {
      // Normal search by name, items, etc.
      this.filteredLocations = this.allLocations.filter(function(loc) {
        if (!loc) return false;
        if ((loc.name || '').toLowerCase().indexOf(query) >= 0) return true;
        if ((loc.id || '').toLowerCase().indexOf(query) >= 0) return true;
        if (loc.encounters) {
          for (var i = 0; i < loc.encounters.length; i++) {
            var encounter = loc.encounters[i];
            if (encounter.pokemon) {
              for (var j = 0; j < encounter.pokemon.length; j++) {
                var mon = encounter.pokemon[j];
                if (mon.name) {
                  var translatedName = window.translateDisplayName ? window.translateDisplayName(mon.name) : mon.name;
                  if (translatedName.toLowerCase().indexOf(query) >= 0) return true;
                }
                if (mon.sos && Array.isArray(mon.sos)) {
                  for (var k = 0; k < mon.sos.length; k++) {
                    var sosTranslated = window.translateDisplayName ? window.translateDisplayName(mon.sos[k]) : mon.sos[k];
                    if (sosTranslated.toLowerCase().indexOf(query) >= 0) return true;
                  }
                }
              }
            }
          }
        }
        if (loc.giftsTrades && Array.isArray(loc.giftsTrades)) {
          for (var i = 0; i < loc.giftsTrades.length; i++) {
            var gtName = window.translateDisplayName ? window.translateDisplayName(loc.giftsTrades[i].name || '') : (loc.giftsTrades[i].name || '');
            if (gtName.toLowerCase().indexOf(query) >= 0) return true;
          }
        }
        if (loc.items) {
          for (var i = 0; i < loc.items.length; i++) {
            if ((loc.items[i].item || '').toLowerCase().indexOf(query) >= 0) return true;
          }
        }
        if (loc.shops) {
          for (var i = 0; i < loc.shops.length; i++) {
            if ((loc.shops[i].item || '').toLowerCase().indexOf(query) >= 0) return true;
          }
        }
        var locTrainers = getTrainersForLocation(loc);
        for (var i = 0; i < locTrainers.length; i++) {
          if ((locTrainers[i].name || '').toLowerCase().indexOf(query) >= 0) return true;
        }
        return false;
      });
      this.renderLocationList(this.filteredLocations);
    }
  },
  renderLocationItem: function(loc) {
    var notes = (loc.notes || '').trim();
    var buf = '<li class="result" style="display:block;padding:0;height:auto;min-height:initial;overflow:visible;position:relative">';
    buf += '<a href="' + Config.baseurl + 'locations/' + loc.id + '" data-target="push" style="display:block;padding:8px;text-decoration:none">';
    buf += '<span class="col numcol">' + (this.allLocations.indexOf(loc) + 1) + '</span>';
    buf += '<span class="col namecol">' + escapeHTML(loc.name || loc.id) + '</span>';
    buf += '</a>';
    if (notes) buf += '<div class="loc-search-note">' + escapeHTML(notes) + '</div>';
    buf += '</li>';
    return buf;
  },
  renderLocationList: function(list) {
    var buf = '';
    for (var i = 0; i < list.length; i++) {
      var loc = list[i];
      if (!loc || !loc.id) continue;
      buf += this.renderLocationItem(loc);
    }
    this.$('.location-results').html(buf);
  },
  renderLocationListByPokemon: function(trainerLocations, wildLocations) {
    var buf = '';
    if (trainerLocations.length > 0) {
      buf += '<li class="result"><h3>Owned by Trainer</h3></li>';
      for (var i = 0; i < trainerLocations.length; i++) {
        if (!trainerLocations[i] || !trainerLocations[i].id) continue;
        buf += this.renderLocationItem(trainerLocations[i]);
      }
    }
    if (wildLocations.length > 0) {
      buf += '<li class="result"><h3>Wild Encounter</h3></li>';
      for (var i = 0; i < wildLocations.length; i++) {
        if (!wildLocations[i] || !wildLocations[i].id) continue;
        buf += this.renderLocationItem(wildLocations[i]);
      }
    }
    if (trainerLocations.length === 0 && wildLocations.length === 0) {
      buf += '<li class="result"><p class="search-no-results">No locations found for that Pokémon.</p></li>';
    }
    this.$('.location-results').html(buf);
  }
});

window.PokedexLocationPanel = PokedexResultPanel.extend({
  initialize: function (locid) {
    var id = toID(locid);
    var loc = (window.Locations || []).find(function(l){return toID(l.id)===id;});
    if (!loc) {
      this.shortTitle = 'Location';
      this.html('<div class="pfx-body dexentry"><a href="' + Config.baseurl + 'locations/" class="pfx-backbutton" data-target="back"><i class="fa fa-chevron-left"></i> Locations</a><h1>Location not found</h1></div>');
      return;
    }
    this.shortTitle = loc.name || loc.id;

    // ── Helpers ──────────────────────────────────────────────────
    var noneText = '<p class="loc-none">None</p>';
    var secStyle = function(bg, border) {
      return 'background:' + bg + ';padding:12px;margin:8px 0;border-radius:6px;border-left:4px solid ' + border;
    };
    // Split a notes string on "|" and return an array of trimmed non-empty lines
    var splitNotes = function(s) {
      if (!s || s.trim().toLowerCase() === 'none') return [];
      return s.split('|').map(function(l){ return l.trim(); }).filter(Boolean);
    };
    var renderNoteLines = function(lines, indent) {
      if (!lines.length) return '';
      var style = 'padding:0 8px 4px ' + (indent || '8px');
      var out = '<div style="' + style + '">';
      for (var i = 0; i < lines.length; i++) {
        out += '<span class="battle-notes-line">' + escapeHTML(lines[i]) + '</span>';
      }
      out += '</div>';
      return out;
    };

    var buf = '<div class="pfx-body dexentry">';

    // ── CSS ───────────────────────────────────────────────────────
    buf += '<style>'
      + '.utilitable th,.utilitable td{border-bottom:1px solid #ddd;padding:6px 8px}'
      + '.utilitable thead th{border-bottom:2px solid #bbb}'
      + '.chancepill{display:inline-block;min-width:42px;text-align:center;background:#f2f2f2;border:1px solid #ddd;border-radius:10px;padding:2px 6px;margin-right:8px;color:#444}'
      + '.sos-row td{background:#ffecec}'
      + '.spot-Grass tbody tr:nth-child(odd){background:#c8e6c9}.spot-Grass tbody tr:nth-child(even){background:#b2dfdb}'
      + '.spot-Sky tbody tr:nth-child(odd){background:#bbdefb}.spot-Sky tbody tr:nth-child(even){background:#b3e5fc}'
      + '.spot-Surf tbody tr:nth-child(odd){background:#c5cae9}.spot-Surf tbody tr:nth-child(even){background:#b3c8ef}'
      + '.spot-Fish tbody tr:nth-child(odd){background:#d1c4e9}.spot-Fish tbody tr:nth-child(even){background:#c5b8e8}'
      + '.spot-Cave tbody tr:nth-child(odd){background:#d7ccc8}.spot-Cave tbody tr:nth-child(even){background:#cfc0bc}'
      + '.spot-BeachGrass tbody tr:nth-child(odd){background:#c8e6c9}.spot-BeachGrass tbody tr:nth-child(even){background:#b2dfdb}'
      + '.loc-search-note{padding:4px 12px 8px 12px;color:#666;font-size:0.9em;border-top:1px solid #eee;clear:both;width:100%;box-sizing:border-box;background:#f5f5f5}'
      + '.loc-section{color:#2f2f2f}'
      + '.loc-section a{color:#1d4f8f}'
      + '.loc-none{color:#666;margin:0;padding:4px 0;font-style:italic}'
      + '.battle-notes-line{display:block;color:#555;font-size:0.85em;font-style:italic;margin-bottom:1px}'
      + '.loc-description p{margin:0 0 4px}'
      + 'body.dark-mode .loc-search-note{color:#b8c6de;border-top-color:#3d516f;background:#1b2a42}'
      + 'body.dark-mode .loc-section,body.dark-mode .loc-section td,body.dark-mode .loc-section th,body.dark-mode .loc-section p,body.dark-mode .loc-section h4{color:#252a33}'
      + 'body.dark-mode .loc-section .loc-none,body.dark-mode .loc-section .battle-notes-line{color:#252a33}'
      + 'body.dark-mode .loc-section a,body.dark-mode .loc-section a:hover{color:#1d4f8f}'
      + '</style>';

    buf += '<a href="' + Config.baseurl + 'locations/" class="pfx-backbutton" data-target="back"><i class="fa fa-chevron-left"></i> Locations</a>';
    buf += '<h1><a href="' + Config.baseurl + 'locations/' + loc.id + '" data-target="push" class="subtle">' + escapeHTML(loc.name || loc.id) + '</a></h1>';

    // ── Description (split on "|") ────────────────────────────────
    var descLines = splitNotes(loc.notes || '');
    if (descLines.length) {
      buf += '<div class="resultsub loc-description" style="margin-bottom:12px">';
      for (var di = 0; di < descLines.length; di++) {
        buf += '<p>' + escapeHTML(descLines[di]) + '</p>';
      }
      buf += '</div>';
    }

    // ── Tab bar ───────────────────────────────────────────────────
    buf += '<ul class="tabbar loc-tabbar">';
    buf += '<li><button class="button nav-first cur" value="obtainable">Obtainable Pok&eacute;mon</button></li>';
    buf += '<li><button class="button" value="items">Items</button></li>';
    buf += '<li><button class="button nav-last" value="battles">Battles</button></li>';
    buf += '</ul>';

    // ── Partition battle/static data and derive location trainers ─
    var allBattles = loc.battles || [];
    var locationTrainers = getTrainersForLocation(loc).slice().sort(function(a, b) {
      var routeA = parseInt(a.routeNumber, 10);
      var routeB = parseInt(b.routeNumber, 10);
      if (isNaN(routeA)) routeA = 0;
      if (isNaN(routeB)) routeB = 0;
      if (routeA !== routeB) return routeA - routeB;
      var nameCmp = (a.name || '').localeCompare(b.name || '');
      if (nameCmp !== 0) return nameCmp;
      return String(a.id || '').localeCompare(String(b.id || ''));
    });
    var staticBattles   = allBattles.filter(function(b){ return  String(b.id).match(/^[A-Za-z]/); });
    var locationStaticEncounters = getStaticEncountersForLocation(loc).slice().sort(function(a, b) {
      return String(a.id || '').localeCompare(String(b.id || ''));
    });
    var staticBattlesById = {};
    for (var sbi = 0; sbi < staticBattles.length; sbi++) {
      staticBattlesById[String(staticBattles[sbi].id)] = staticBattles[sbi];
    }
    for (var lsi = 0; lsi < locationStaticEncounters.length; lsi++) {
      var locStaticEnc = locationStaticEncounters[lsi];
      var locStaticId = String(locStaticEnc.id || '');
      if (!locStaticId) continue;
      if (!staticBattlesById[locStaticId]) {
        staticBattlesById[locStaticId] = { id: locStaticId, tag: 'Static', notes: locStaticEnc.description || '' };
      } else if (!normalizeTrainerMetaText(staticBattlesById[locStaticId].notes)) {
        staticBattlesById[locStaticId].notes = locStaticEnc.description || '';
      }
    }
    staticBattles = Object.keys(staticBattlesById).sort().map(function(id) {
      return staticBattlesById[id];
    });
    var capturableStatics = staticBattles.filter(function(b){ return b.tag === 'Capturable'; });

    // ─────────────────────────────────────────────────────────────
    // TAB 1: Obtainable Pokémon
    // ─────────────────────────────────────────────────────────────
    buf += '<div class="loc-tab loc-tab-obtainable">';

    // ── Gifts & Trades ──
    var giftsTrades = loc.giftsTrades || [];
    buf += '<div class="loc-section" style="' + secStyle('#ce93d8', '#ab47bc') + '">';
    buf += '<h3 style="margin-top:0;color:#4a148c">Gifts &amp; Trades</h3>';
    if (!giftsTrades.length) {
      buf += noneText;
    } else {
      buf += '<ul class="utilichart nokbd">';
      for (var gi = 0; gi < giftsTrades.length; gi++) {
        var gt = giftsTrades[gi];
        var gtTranslated = window.translateDisplayName ? window.translateDisplayName(gt.name) : gt.name;
        var gtID = toID(gtTranslated);
        var gtData = BattlePokedex[gtID];
        var gtDisplayName = gtData ? gtData.name : gtTranslated;
        buf += '<li class="result" style="display:block;height:auto;min-height:32px;padding:6px 8px">';
        buf += '<a href="' + Config.baseurl + 'pokemon/' + gtID + '" data-target="push" style="text-decoration:none">';
        buf += '<span class="picon" style="' + getPokemonIcon(gtID) + ';display:inline-block;vertical-align:middle;margin-right:6px"></span>';
        buf += '<span style="vertical-align:middle;font-weight:600">' + escapeHTML(gtDisplayName) + '</span>';
        buf += '</a>';
        if (gt.description) {
          buf += '<div style="color:#777;font-size:0.85em;margin-top:2px;padding-left:46px">' + escapeHTML(gt.description) + '</div>';
        }
        buf += '</li>';
      }
      buf += '</ul>';
    }
    buf += '</div>';

    // ── Static Encounters (Capturable only) ──
    buf += '<div class="loc-section" style="' + secStyle('#f48fb1', '#c2185b') + '">';
    buf += '<h3 style="margin-top:0;color:#880e4f">Static Encounters</h3>';
    if (!capturableStatics.length) {
      buf += noneText;
    } else {
      buf += '<ul class="utilichart nokbd">';
      for (var ci = 0; ci < capturableStatics.length; ci++) {
        var cb = capturableStatics[ci];
        var cbEnc = (window.StaticEncounters || {})[cb.id];
        var cbName = cbEnc ? (window.translateDisplayName ? window.translateDisplayName(cbEnc.name) : cbEnc.name) : cb.id;
        var cbID = toID(cbName);
        var cbLevel = cbEnc ? cbEnc.level : '';
        var cbDesc = normalizeTrainerMetaText((cbEnc && cbEnc.description) || '');
        var cbCombinedNotes = cb.notes || cbDesc;
        if (cb.notes && cbDesc && toID(cb.notes) !== toID(cbDesc)) cbCombinedNotes = cb.notes + ' | ' + cbDesc;
        var cbNoteLines = splitNotes(cbCombinedNotes || '');
        buf += '<li class="result" style="display:block;height:auto;min-height:32px;padding:6px 8px">';
        buf += '<a href="' + Config.baseurl + 'encounters/' + cb.id + '" data-target="push" style="display:block;height:auto;min-height:32px;text-decoration:none">';
        buf += '<span class="picon" style="' + getPokemonIcon(cbID) + ';display:inline-block;vertical-align:middle;margin-right:6px"></span>';
        buf += '<span style="vertical-align:middle;font-weight:600">' + escapeHTML(cbName) + '</span>';
        if (cbLevel) buf += ' <span style="color:#666;font-size:0.85em">Lv.\u00a0' + cbLevel + '</span>';
        buf += '</a>';
        buf += renderNoteLines(cbNoteLines, '46px');
        buf += '</li>';
      }
      buf += '</ul>';
    }
    buf += '</div>';

    // ── Wild Pokémon ──
    var encounters = loc.encounters || [];
    buf += '<div class="loc-section" style="' + secStyle('#a5d6a7', '#388e3c') + '">';
    buf += '<h3 style="margin-top:0;color:#1b5e20">Wild Pok&eacute;mon</h3>';
    if (!encounters.length) {
      buf += noneText;
    } else {
      for (var s = 0; s < encounters.length; s++) {
        var spot = encounters[s];
        if (!spot || !spot.pokemon || !spot.pokemon.length) continue;
        var lvRange = (spot.levelRange && (spot.levelRange.min || spot.levelRange.max))
          ? ' (Lv.\u00a0' + (spot.levelRange.min === spot.levelRange.max ? spot.levelRange.min : (spot.levelRange.min + '\u2013' + spot.levelRange.max)) + ')'
          : '';
        var spotClass = 'spot-' + (spot.spot || '').replace(/\s+/g, '');
        buf += '<h4 style="margin:6px 0 4px">' + escapeHTML(spot.spot || 'Spot') + lvRange + '</h4>';
        buf += '<table class="utilitable ' + spotClass + '" style="width:100%;margin-bottom:8px">';
        buf += '<thead><tr><th style="width:80px;text-align:center">Chance</th><th style="text-align:left">Pok&eacute;mon</th></tr></thead><tbody>';
        for (var p = 0; p < spot.pokemon.length; p++) {
          var mon = spot.pokemon[p];
          var translatedName = window.translateDisplayName(mon.name);
          var monID = toID(translatedName);
          var pokeData = BattlePokedex[monID];
          var displayName = pokeData ? pokeData.name : translatedName;
          buf += '<tr>';
          buf += '<td style="text-align:center"><span class="chancepill">' + (mon.chance != null ? mon.chance + '%' : '&mdash;') + '</span></td>';
          buf += '<td><a href="' + Config.baseurl + 'pokemon/' + monID + '" data-target="push">'
            + '<span class="picon" style="' + getPokemonIcon(monID) + ';display:inline-block;vertical-align:middle;margin-right:6px"></span>'
            + escapeHTML(displayName) + '</a></td>';
          buf += '</tr>';
          var sos = mon.sos || [];
          for (var k = 0; k < sos.length; k++) {
            var childTranslated = window.translateDisplayName(sos[k]);
            var childID = toID(childTranslated);
            var childData = BattlePokedex[childID];
            var childDisplayName = childData ? childData.name : childTranslated;
            buf += '<tr class="sos-row"><td></td><td style="padding-left:24px;font-size:0.9em">'
              + '<span style="color:#c62828;font-weight:600;margin-right:6px">S.O.S.</span>'
              + '<a href="' + Config.baseurl + 'pokemon/' + childID + '" data-target="push">'
              + '<span class="picon" style="' + getPokemonIcon(childID) + ';display:inline-block;vertical-align:middle;margin-right:4px"></span>'
              + escapeHTML(childDisplayName) + '</a></td></tr>';
          }
        }
        buf += '</tbody></table>';
      }
    }
    buf += '</div>';

    buf += '</div>'; // end loc-tab-obtainable

    // ─────────────────────────────────────────────────────────────
    // TAB 2: Items
    // ─────────────────────────────────────────────────────────────
    buf += '<div class="loc-tab loc-tab-items" style="display:none">';

    // ── Items ──
    var locItems = loc.items || [];
    buf += '<div class="loc-section" style="' + secStyle('#ffcc80', '#f57c00') + '">';
    buf += '<h3 style="margin-top:0;color:#bf360c">Items</h3>';
    if (!locItems.length) {
      buf += noneText;
    } else {
      buf += '<table class="utilitable" style="width:100%;margin-bottom:8px">';
      buf += '<thead><tr><th style="width:28px"></th><th style="text-align:left">Item</th><th style="width:70px;text-align:center">Qty</th><th>Obtain</th></tr></thead><tbody>';
      for (var ii = 0; ii < locItems.length; ii++) {
        var it = locItems[ii];
        var tmMatchI = it.item.match(/^(TM\d+)\s*\((.+)\)$/);
        var baseItemI = it.item.replace(/\s*\(\d+\)$/, '');
        var iid = toID(baseItemI);
        var itemData = BattleItems[iid];
        var itemIcon = '';
        var itemLinkTarget = iid;
        var itemLinkType = 'items';
        if (it.item && it.item.trim().startsWith('$')) {
          itemIcon = '<img src="' + ResourcePrefix + 'sprites/pokedollar_icon.png" style="width:32px;height:32px;display:inline-block" alt="Money" />';
        } else if (tmMatchI) {
          var iMoveName = tmMatchI[2].trim();
          var iTmId = toID(tmMatchI[1]);
          itemLinkTarget = toID(iMoveName);
          itemLinkType = 'moves';
          itemData = BattleItems[iTmId];
          itemIcon = '<span class="itemicon" style="' + getItemIcon(itemData ? iTmId : 'tm-normal') + ';width:32px;height:32px;display:inline-block"></span>';
        } else if (baseItemI === 'Poké Ball') {
          iid = 'pokball';
          itemLinkTarget = 'pokball';
          itemData = BattleItems['pokball'];
          if (itemData) itemIcon = '<span class="itemicon" style="' + getItemIcon(itemData) + ';width:32px;height:32px;display:inline-block"></span>';
        } else if (itemData) {
          itemIcon = '<span class="itemicon" style="' + getItemIcon(itemData) + ';width:32px;height:32px;display:inline-block"></span>';
        }
        buf += '<tr><td>' + itemIcon + '</td><td>';
        if (tmMatchI || itemData) {
          buf += '<a href="' + Config.baseurl + itemLinkType + '/' + itemLinkTarget + '" data-target="push">' + escapeHTML(it.item) + '</a>';
        } else {
          buf += escapeHTML(it.item);
        }
        buf += '</td><td style="text-align:center">' + (it.quantity != null ? it.quantity : 1) + '</td>';
        buf += '<td>' + escapeHTML(it.obtain || '') + '</td></tr>';
      }
      buf += '</tbody></table>';
    }
    buf += '</div>';

    // ── Shops ──
    var hasShopTables = loc.shopTables && loc.shopTables.length;
    var hasLegacyShops = loc.shops && loc.shops.length;
    buf += '<div class="loc-section" style="' + secStyle('#ffe082', '#ffa000') + '">';
    buf += '<h3 style="margin-top:0;color:#e65100">Shops</h3>';
    if (!hasShopTables && !hasLegacyShops) {
      buf += noneText;
    } else {
      // Shop tables (new format)
      if (hasShopTables) {
        for (var sti = 0; sti < loc.shopTables.length; sti++) {
          var shopTableName = loc.shopTables[sti];
          var shopTable = (window.ShopTables && window.ShopTables[shopTableName]) || null;
          buf += '<h4 style="margin:8px 0 4px">' + escapeHTML(shopTableName) + '</h4>';
          if (shopTable && shopTable.items && shopTable.items.length) {
            buf += '<table class="utilitable" style="width:100%;margin-bottom:8px">';
            buf += '<thead><tr><th style="width:28px"></th><th style="text-align:left">Item</th><th style="width:110px;text-align:center">Price</th></tr></thead><tbody>';
            for (var stii = 0; stii < shopTable.items.length; stii++) {
              var shopItem = shopTable.items[stii];
              var tmMatchST = shopItem.item.match(/^(TM\d+)\s*\((.+)\)$/);
              var baseShopItemST = shopItem.item.replace(/\s*\(\d+\)$/, '');
              var shopIconST = '';
              var shopLinkTargetST = '';
              var shopLinkTypeST = 'items';
              var shopItemDataST = null;
              if (tmMatchST) {
                var stMoveName = tmMatchST[2].trim();
                var stTmId = toID(tmMatchST[1]);
                shopLinkTargetST = toID(stMoveName);
                shopLinkTypeST = 'moves';
                shopItemDataST = BattleItems[stTmId];
                shopIconST = '<span class="itemicon" style="' + getItemIcon(shopItemDataST ? stTmId : 'tm-normal') + ';width:32px;height:32px;display:inline-block"></span>';
              } else if (baseShopItemST === 'Poké Ball') {
                shopLinkTargetST = 'pokball';
                shopItemDataST = BattleItems['pokball'];
                if (shopItemDataST) shopIconST = '<span class="itemicon" style="' + getItemIcon(shopItemDataST) + ';width:32px;height:32px;display:inline-block"></span>';
              } else {
                var stItemId = toID(baseShopItemST);
                shopLinkTargetST = stItemId;
                shopItemDataST = BattleItems[stItemId];
                if (shopItemDataST) shopIconST = '<span class="itemicon" style="' + getItemIcon(shopItemDataST) + ';width:32px;height:32px;display:inline-block"></span>';
              }
              buf += '<tr><td>' + shopIconST + '</td><td>';
              if (tmMatchST || shopItemDataST) {
                buf += '<a href="' + Config.baseurl + shopLinkTypeST + '/' + shopLinkTargetST + '" data-target="push">' + escapeHTML(shopItem.item) + '</a>';
              } else {
                buf += escapeHTML(shopItem.item);
              }
              buf += '</td><td style="text-align:center">' + escapeHTML(shopItem.price || '') + '</td></tr>';
            }
            buf += '</tbody></table>';
          } else {
            buf += '<p class="resultsub" style="color:#999">Shop data not available.</p>';
          }
        }
      }
      // Legacy shops
      if (hasLegacyShops) {
        buf += '<table class="utilitable" style="width:100%;margin-bottom:8px">';
        buf += '<thead><tr><th style="width:28px"></th><th style="text-align:left">Item</th><th style="width:110px;text-align:center">Price</th></tr></thead><tbody>';
        for (var si = 0; si < loc.shops.length; si++) {
          var sh = loc.shops[si];
          var tmMatchLS = sh.item.match(/^(TM\d+)\s*\((.+)\)$/);
          var baseShopItemLS = sh.item.replace(/\s*\(\d+\)$/, '');
          var shopItemIdLS = toID(baseShopItemLS);
          var shopItemDataLS = BattleItems[shopItemIdLS];
          var shopIconLS = '';
          var shopLinkTargetLS = shopItemIdLS;
          var shopLinkTypeLS = 'items';
          if (tmMatchLS) {
            var lsMoveName = tmMatchLS[2].trim();
            var lsTmId = toID(tmMatchLS[1]);
            shopLinkTargetLS = toID(lsMoveName);
            shopLinkTypeLS = 'moves';
            shopItemDataLS = BattleItems[lsTmId];
            shopIconLS = '<span class="itemicon" style="' + getItemIcon(shopItemDataLS ? lsTmId : 'tm-normal') + ';width:32px;height:32px;display:inline-block"></span>';
          } else if (baseShopItemLS === 'Poké Ball') {
            shopItemIdLS = 'pokball';
            shopLinkTargetLS = 'pokball';
            shopItemDataLS = BattleItems['pokball'];
            if (shopItemDataLS) shopIconLS = '<span class="itemicon" style="' + getItemIcon(shopItemDataLS) + ';width:32px;height:32px;display:inline-block"></span>';
          } else if (shopItemDataLS) {
            shopIconLS = '<span class="itemicon" style="' + getItemIcon(shopItemDataLS) + ';width:32px;height:32px;display:inline-block"></span>';
          }
          buf += '<tr><td>' + shopIconLS + '</td><td>';
          if (tmMatchLS || shopItemDataLS) {
            buf += '<a href="' + Config.baseurl + shopLinkTypeLS + '/' + shopLinkTargetLS + '" data-target="push">' + escapeHTML(sh.item) + '</a>';
          } else {
            buf += escapeHTML(sh.item);
          }
          buf += '</td><td style="text-align:center">' + escapeHTML(sh.price || '') + '</td></tr>';
        }
        buf += '</tbody></table>';
      }
    }
    buf += '</div>';

    buf += '</div>'; // end loc-tab-items

    // ─────────────────────────────────────────────────────────────
    // TAB 3: Battles
    // ─────────────────────────────────────────────────────────────
    buf += '<div class="loc-tab loc-tab-battles" style="display:none">';

    // ── Trainers ──
    buf += '<div class="loc-section" style="' + secStyle('#90caf9', '#1565c0') + '">';
    buf += '<h3 style="margin-top:0;color:#0d47a1">Trainers</h3>';
    if (!locationTrainers.length) {
      buf += noneText;
    } else {
      buf += '<ul class="utilichart nokbd">';
      for (var ti = 0; ti < locationTrainers.length; ti++) {
        var tTrainer = locationTrainers[ti];
        var paddedTID = String(tTrainer.id).padStart(3, '0');
        var tName = tTrainer.name || ('Trainer\u00a0' + paddedTID);
        var tNoteLines = splitNotes(tTrainer.desc || '');
        buf += '<li class="result" style="display:block;height:auto;min-height:32px;padding:0">';
        buf += '<a href="' + Config.baseurl + 'trainers/' + paddedTID + '" data-target="push" style="display:block;height:auto;min-height:32px;padding:5px 8px;text-decoration:none">';
        buf += '<span style="font-size:0.95em">' + escapeHTML(tName) + '</span>';
        buf += '</a>';
        buf += renderNoteLines(tNoteLines, '8px');
        buf += '</li>';
      }
      buf += '</ul>';
    }
    buf += '</div>';

    // ── Static Encounters (all) ──
    buf += '<div class="loc-section" style="' + secStyle('#ef9a9a', '#c62828') + '">';
    buf += '<h3 style="margin-top:0;color:#b71c1c">Static Encounters</h3>';
    if (!staticBattles.length) {
      buf += noneText;
    } else {
      buf += '<ul class="utilichart nokbd">';
      for (var sbi = 0; sbi < staticBattles.length; sbi++) {
        var sb = staticBattles[sbi];
        var sbEnc = (window.StaticEncounters || {})[sb.id];
        var sbName = sbEnc ? (window.translateDisplayName ? window.translateDisplayName(sbEnc.name) : sbEnc.name) : ('Encounter\u00a0' + sb.id);
        var sbID = toID(sbName);
        var sbLevel = sbEnc ? sbEnc.level : '';
        var sbTagCfg = (window.BattleTags && window.BattleTags[sb.tag]) || { color: '#666', backgroundColor: '#f0f0f0', description: sb.tag };
        var sbDesc = normalizeTrainerMetaText((sbEnc && sbEnc.description) || '');
        var sbCombinedNotes = sb.notes || sbDesc;
        if (sb.notes && sbDesc && toID(sb.notes) !== toID(sbDesc)) sbCombinedNotes = sb.notes + ' | ' + sbDesc;
        var sbNoteLines = splitNotes(sbCombinedNotes || '');
        buf += '<li class="result" style="display:block;height:auto;min-height:32px;padding:0">';
        buf += '<a href="' + Config.baseurl + 'encounters/' + sb.id + '" data-target="push" style="display:block;height:auto;min-height:32px;padding:5px 8px;text-decoration:none">';
        buf += '<span class="battle-tag" style="display:inline-block;padding:2px 8px;margin-right:8px;border-radius:12px;font-size:0.75em;font-weight:600;color:' + sbTagCfg.color + ';background-color:' + sbTagCfg.backgroundColor + ';cursor:help" title="' + escapeHTML(sbTagCfg.description || '') + '">' + escapeHTML(sb.tag) + '</span>';
        buf += '<span class="picon" style="' + getPokemonIcon(sbID) + ';display:inline-block;vertical-align:middle;margin-right:4px"></span>';
        buf += '<span style="font-size:0.95em">' + escapeHTML(sbName) + '</span>';
        if (sbLevel) buf += ' <span style="color:#888;font-size:0.85em">Lv.\u00a0' + sbLevel + '</span>';
        buf += '</a>';
        buf += renderNoteLines(sbNoteLines, '8px');
        buf += '</li>';
      }
      buf += '</ul>';
    }
    buf += '</div>';

    buf += '</div>'; // end loc-tab-battles

    buf += '</div>';
    this.html(buf);
  },
  events: {
    'click .loc-tabbar button': 'selectTab'
  },
  selectTab: function(e) {
    this.$('.loc-tabbar button').removeClass('cur');
    $(e.currentTarget).addClass('cur');
    var tab = e.currentTarget.value;
    this.$('.loc-tab').hide();
    this.$('.loc-tab-' + tab).show();
  }
});
