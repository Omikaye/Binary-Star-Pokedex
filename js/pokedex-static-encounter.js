window.PokedexStaticEncounterPanel = PokedexResultPanel.extend({
  initialize: function (id) {
    // Extract numeric ID from static encounter ID (e.g., "S238" -> "238")
    const raw = ('' + id).replace(/[^0-9]/g, '');
    const staticID = 'S' + raw;
    this.id = staticID;

    const staticEncounters = window.StaticEncounters || {};
    const encounter = staticEncounters[staticID];

    if (!encounter) {
      this.shortTitle = 'Encounter ' + staticID;
      this.html('<div class="pfx-body dexentry"><a href="' + Config.baseurl + 'dex" class="pfx-backbutton" data-target="back"><i class="fa fa-chevron-left"></i> Pok&eacute;dex</a><h1>Encounter ' + staticID + '</h1><p>Encounter not found.</p></div>');
      return;
    }

    this.encounter = encounter;
    
    // Translate display name (e.g., "Rattata 1" -> "Rattata-Alola")
    const translatedName = window.translateDisplayName ? window.translateDisplayName(encounter.name) : encounter.name;
    this.shortTitle = translatedName + ' (Lv. ' + encounter.level + ')';

    var buf = '<div class="pfx-body dexentry" style="position:relative">';
    buf += '<style>' +
      '.dexentry .abilitydesccol { white-space: normal !important; overflow: visible !important; width: auto !important; height: auto !important; max-width: none !important; float: none !important; display: inline !important; }' +
      '.dexentry .movedesccol { white-space: normal !important; overflow: visible !important; width: auto !important; height: auto !important; max-width: none !important; float: none !important; display: inline !important; }' +
      '.dexentry .namecol { float: none !important; display: inline !important; padding-top: 0 !important; height: auto !important; }' +
      '.dexentry h1 { margin-top: 0; margin-bottom: 6px; white-space: nowrap; position: relative; z-index: 10; }' +
      '.dexentry h1 a { display:inline-block; white-space:nowrap; vertical-align: middle; }' +
      '.dexentry > * { position: relative; z-index: 1; }' +
      '.encounter-sprite { position: absolute; top: 0; right: 0; z-index: 20; pointer-events: none; width: 150px; height: auto; }' +
      '</style>';

    buf += '<a href="' + Config.baseurl + 'trainers/" class="pfx-backbutton" data-target="back"><i class="fa fa-chevron-left"></i> Encounters</a>';
    
    // Get pokemon data for the full art sprite using translated name
    const monID = toID(translatedName);
    const monData = BattlePokedex[monID];
    
    // Add full art Pokédex sprite to top right
    if (monData && monData.id) {
      buf += '<img src="' + ResourcePrefix + 'sprites/gen5/' + monID + '.png" alt="" width="96" height="96" class="encounter-sprite" />';
    }
    
    // Encounter title - show translated name
    buf += '<h1><a href="' + Config.baseurl + 'encounters/' + staticID + '" data-target="push" class="subtle">[' + encounter.id + '] ' + escapeHTML(translatedName) + ' (Lv. ' + encounter.level + ')</a></h1>';

    // Find location and battle notes
    var encounterLocation = null;
    var battleNotes = '';
    if (window.Locations) {
      for (var i = 0; i < window.Locations.length; i++) {
        var loc = window.Locations[i];
        if (loc.battles) {
          for (var bi = 0; bi < loc.battles.length; bi++) {
            var battle = loc.battles[bi];
            // Convert both to strings for comparison
            if (String(battle.id) === String(staticID)) {
              encounterLocation = loc;
              battleNotes = battle.notes || '';
              break;
            }
          }
        }
        if (encounterLocation) break;
      }
    }

    // Main info card
    var bgColor = '#70c27a';
    buf += '<div style="border-radius:10px;overflow:hidden;margin-bottom:12px;border:1px solid rgba(0,0,0,0.08);box-shadow:0 2px 6px rgba(0,0,0,0.08)">';
    buf += '<div style="background:' + bgColor + ';color:#fff;padding:8px 12px;font-weight:bold">Encounter Info</div>';
    buf += '<div style="background:linear-gradient(180deg, ' + bgColor + '22, #fff);padding:12px">';
    
    buf += '<dl>';
    
    // Pokemon Name (clickable)
    buf += '<dt>Name:</dt> <dd>';
    if (monData) {
      buf += '<a href="' + Config.baseurl + 'pokemon/' + monID + '" data-target="push" class="subtle">' + escapeHTML(monData.name) + '</a>';
    } else {
      buf += escapeHTML(encounter.name);
    }
    buf += '</dd>';
    
    // Types
    var types = (monData ? monData.types : null) || [];
    if (types.length) {
      buf += '<dt>Type:</dt> <dd style="display:flex;gap:4px;flex-wrap:wrap;padding-top:2px">' + types.map(function(t){return getTypeIcon(t);}).join(' ') + '</dd>';
    }
    
    // Location
    if (encounterLocation) {
      buf += '<dt>Location:</dt> <dd><a href="' + Config.baseurl + 'locations/' + encounterLocation.id + '" data-target="push">' + escapeHTML(encounterLocation.name) + '</a></dd>';
    }
    
    // Description from battle notes (skip if "None")
    if (battleNotes && battleNotes.trim() && battleNotes.trim().toLowerCase() !== 'none') {
      buf += '<dt>Description:</dt> <dd>' + escapeHTML(battleNotes) + '</dd>';
    }
    
    // Item
    if (encounter.item) {
      var itemID = toID(encounter.item);
      var itemName = BattleItems[itemID]?.name || encounter.item;
      buf += '<dt>Item:</dt> <dd>' + escapeHTML(itemName) + '</dd>';
    } else {
      buf += '<dt>Item:</dt> <dd>None</dd>';
    }
    
    // Nature with stat effects
    var NATURE_EFFECTS = {
      Adamant: ['Atk', 'SpA'], Modest: ['SpA', 'Atk'], Jolly: ['Spe', 'SpA'], Timid: ['Spe', 'Atk'],
      Impish: ['Def', 'SpA'], Bold: ['Def', 'Atk'], Careful: ['SpD', 'SpA'], Calm: ['SpD', 'Atk'],
      Naughty: ['Atk', 'SpD'], Lonely: ['Atk', 'Def'], Hasty: ['Spe', 'Def'], Naive: ['Spe', 'SpD'],
      Gentle: ['SpD', 'Def'], Lax: ['Def', 'SpD'], Rash: ['SpA', 'SpD'], Mild: ['SpA', 'Def'],
      Quiet: ['SpA', 'Spe'], Brave: ['Atk', 'Spe'], Relaxed: ['Def', 'Spe'], Sassy: ['SpD', 'Spe'],
      Bashful: null, Docile: null, Serious: null, Hardy: null, Quirky: null
    };
    
    if (encounter.nature) {
      var eff = NATURE_EFFECTS[encounter.nature] || null;
      var natText = '<strong>Nature:</strong> ' + escapeHTML(encounter.nature);
      if (eff) {
        natText += ' (<span style="color:#1f9d3a">' + eff[0] + '&#8593;</span> / <span style="color:#c22e28">' + eff[1] + '&#8595;</span>)';
      } else {
        natText += ' (Neutral)';
      }
      buf += '<dt></dt> <dd>' + natText + '</dd>';
    }
    
    // Aura
    if (encounter.aura && encounter.aura.effect) {
      var auraText = encounter.aura.effect;
      if (encounter.aura.boost) {
        auraText += ' (' + encounter.aura.boost + ')';
      }
      buf += '<dt>Aura:</dt> <dd>' + escapeHTML(auraText) + '</dd>';
    }
    
    buf += '</dl>';
    buf += '</div></div>';

    // Ability card
    if (encounter.ability) {
      buf += '<div style="border-radius:10px;overflow:hidden;margin-bottom:12px;border:1px solid rgba(0,0,0,0.08);box-shadow:0 2px 6px rgba(0,0,0,0.08)">';
      buf += '<div style="background:' + bgColor + ';color:#fff;padding:8px 12px;font-weight:bold">Ability</div>';
      buf += '<div style="background:linear-gradient(180deg, ' + bgColor + '22, #fff);padding:12px">';
      
      // Strip (H) or (S) suffix for ability lookup
      var abilityName = encounter.ability.replace(/\s+\([HS]\)$/, '');
      var abilID = toID(abilityName);
      var abilityObj = BattleAbilities[abilID];
      if (abilityObj) {
        buf += '<div style="background:#fff;border:1px solid #ddd;border-radius:6px;padding:8px">';
        buf += '<div style="font-weight:bold"><a href="' + Config.baseurl + 'abilities/' + abilID + '" data-target="push" class="subtle" style="text-decoration:none;color:inherit">' + escapeHTML(abilityObj.name) + '</a>';
        if (encounter.ability.includes('(H)')) buf += ' <em>(H)</em>';
        if (encounter.ability.includes('(S)')) buf += ' <em>(S)</em>';
        buf += '</div>';
        buf += '<div style="max-height:80px;overflow-y:auto;margin-top:6px"><small>' + escapeHTML(abilityObj.shortDesc || abilityObj.desc || '') + '</small></div>';
        buf += '</div>';
      } else {
        buf += '<div><strong>' + escapeHTML(encounter.ability) + '</strong></div>';
      }
      
      buf += '</div></div>';
    }

    // Shared type color map used by both the moves card and SOS encounter move rendering
    var typeColors = {
      normal: '#A8A878', fighting: '#C03028', flying: '#A890F0', poison: '#A040A0', ground: '#E0C068',
      rock: '#B8A038', bug: '#A8B820', ghost: '#705898', steel: '#B8B8D0', fire: '#F08030',
      water: '#6890F0', grass: '#78C850', electric: '#F8D030', psychic: '#F85888', ice: '#98D8D8',
      dragon: '#7038F8', dark: '#705848', fairy: '#EE99AC'
    };

    // Moves card
    if (encounter.moves && encounter.moves.length > 0) {
      buf += '<div style="border-radius:10px;overflow:hidden;margin-bottom:12px;border:1px solid rgba(0,0,0,0.08);box-shadow:0 2px 6px rgba(0,0,0,0.08)">';
      buf += '<div style="background:' + bgColor + ';color:#fff;padding:8px 12px;font-weight:bold">Moves</div>';
      buf += '<div style="background:linear-gradient(180deg, ' + bgColor + '22, #fff);padding:12px;display:flex;flex-direction:column;gap:6px">';
      
      for (var j = 0; j < encounter.moves.length; j++) {
        var moveID = toID(encounter.moves[j]);
        var move = BattleMovedex[moveID];
        if (!move) {
          buf += '<div style="background:#fff;border:1px solid #ddd;border-radius:6px;padding:8px">' + escapeHTML(encounter.moves[j]) + '</div>';
          continue;
        }
        
        var moveType = toID(move.type);
        var bgMoveColor = typeColors[moveType] || '#ccc';
        var typeIcon = '<span style="margin-left:6px;display:inline-block">' + getTypeIcon(move.type) + '</span>';
        
        // Build stats string
        var statsText = '';
        if (move.category !== 'Status') {
          statsText += '<b>Pow:</b> ' + (move.basePower || '&mdash;') + ' ';
        }
        statsText += '<b>Acc:</b> ' + (move.accuracy && move.accuracy !== true ? move.accuracy + '%' : '&mdash;') + ' ';
        var pp = move.noPPBoosts ? move.pp : Math.floor(move.pp * 8 / 5);
        statsText += '<b>PP:</b> ' + pp;
        
        buf += '<a href="' + Config.baseurl + 'moves/' + moveID + '" data-target="push" class="subtle" style="text-decoration:none"><div style="background:' + bgMoveColor + '33;border:1px solid ' + bgMoveColor + ';border-radius:6px;padding:8px;color:#333;display:flex;justify-content:space-between;align-items:center">';
        buf += '<div><strong>' + escapeHTML(move.name) + '</strong><br /><small>' + statsText + '</small><br /><small>' + escapeHTML(move.shortDesc || move.desc || '') + '</small></div>';
        buf += typeIcon;
        buf += '</div></a>';
      }
      
      buf += '</div></div>';
    }

    // SOS Encounters - render as pokemon cards like trainers
    if (encounter.sos && (encounter.sos.primary || encounter.sos.secondary)) {
      var sosEncounters = [];
      if (encounter.sos.primary) sosEncounters.push({ id: encounter.sos.primary, type: 'Primary' });
      if (encounter.sos.secondary) sosEncounters.push({ id: encounter.sos.secondary, type: 'Secondary' });

      buf += '<div style="margin-top:12px">';

      var sosColors = ['#f15b5b', '#f28f44'];

      var getSosTypeColor = function(type) {
        return typeColors[toID(type)] || '#ccc';
      };

      var renderSosItemBox = function(itemName) {
        if (!itemName) return '';
        var itemID = toID(itemName);
        var data = BattleItems[itemID];
        var title = data ? data.name : itemName;
        var desc = data ? (data.shortDesc || data.desc || '') : '';
        var icon = '<span class="itemicon" style="' + getItemIcon(itemID) + ';width:32px;height:32px;display:inline-block;vertical-align:top;flex-shrink:0"></span>';
        return '<a href="' + Config.baseurl + 'items/' + itemID + '" data-target="push" class="subtle" style="text-decoration:none"><div class="infobox" style="background:#fff;border:1px solid #ddd;border-radius:6px;padding:8px;display:flex;gap:8px;align-items:flex-start">' + icon + '<div style="flex:1"><strong>' + escapeHTML(title) + '</strong><br /><small>' + escapeHTML(desc) + '</small></div></div></a>';
      };

      var renderSosAbilityBox = function(abilityName) {
        if (!abilityName) return '';
        var rawName = abilityName.replace(/\s+\([HS]\)$/, '');
        var abilityID = toID(rawName);
        var data = BattleAbilities[abilityID];
        var content = '<div class="infobox" style="background:#fff;border:1px solid #ddd;border-radius:6px;padding:8px"><strong>' + escapeHTML((data ? data.name : rawName)) + '</strong>';
        if (abilityName.includes('(H)')) content += ' <em>(H)</em>';
        if (abilityName.includes('(S)')) content += ' <em>(S)</em>';
        content += '<br /><small>' + escapeHTML((data ? (data.shortDesc || data.desc || '') : '')) + '</small></div>';
        return '<a href="' + Config.baseurl + 'abilities/' + abilityID + '" data-target="push" class="subtle" style="text-decoration:none">' + content + '</a>';
      };

      var renderSosMoveBox = function(moveName) {
        if (!moveName) return '';
        var sosMoveID = toID(moveName);
        var data = BattleMovedex[sosMoveID];
        var moveType = data ? toID(data.type) : 'normal';
        var bgMoveColor = getSosTypeColor(moveType);
        var typeIcon = '<span style="margin-left:6px;display:inline-block">' + getTypeIcon(moveType) + '</span>';
        if (!data) return '<div class="infobox" style="background:' + bgMoveColor + '33;border:1px solid ' + bgMoveColor + ';border-radius:6px;padding:8px;color:#333">' + escapeHTML(moveName) + typeIcon + '</div>';
        var statsText = '';
        if (data.category !== 'Status') {
          statsText += '<b>Pow:</b> ' + (data.basePower || '&mdash;') + ' ';
        }
        statsText += '<b>Acc:</b> ' + (data.accuracy && data.accuracy !== true ? data.accuracy + '%' : '&mdash;') + ' ';
        var pp = data.noPPBoosts ? data.pp : Math.floor(data.pp * 8 / 5);
        statsText += '<b>PP:</b> ' + pp;
        return '<a href="' + Config.baseurl + 'moves/' + sosMoveID + '" data-target="push" class="subtle" style="text-decoration:none"><div class="infobox" style="background:' + bgMoveColor + '33;border:1px solid ' + bgMoveColor + ';border-radius:6px;padding:8px;color:#333;display:flex;justify-content:space-between;align-items:center"><div><strong>' + escapeHTML(data.name) + '</strong><br /><small>' + statsText + '</small><br /><small>' + escapeHTML(data.shortDesc || data.desc || '') + '</small></div>' + typeIcon + '</div></a>';
      };

      for (var si = 0; si < sosEncounters.length; si++) {
        var sosEnc = sosEncounters[si];
        var sosData = staticEncounters[sosEnc.id];
        if (!sosData) continue;

        // Translate display name for SOS encounters
        var sosTranslatedName = window.translateDisplayName ? window.translateDisplayName(sosData.name) : sosData.name;
        var sosPokemonID = toID(sosTranslatedName);
        var sosPokemonData = BattlePokedex[sosPokemonID];
        var bg = sosColors[si % sosColors.length];

        buf += '<div style="border-radius:10px;overflow:hidden;margin-bottom:12px;border:1px solid rgba(0,0,0,0.08);box-shadow:0 2px 6px rgba(0,0,0,0.08)">';
        buf += '<div style="background:' + bg + ';color:#fff;padding:8px 12px;font-weight:bold">' + sosEnc.type + ' S.O.S. Encounter</div>';
        buf += '<div style="background:linear-gradient(180deg, ' + bg + '22, #fff);padding:12px">';

        // Pokemon sprite + name + level
        buf += '<div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap">';
        buf += '<span class="picon" style="' + getPokemonIcon(sosPokemonID) + ';display:inline-block;vertical-align:middle"></span>';
        var sosMonName = sosPokemonData ? sosPokemonData.name : sosTranslatedName;
        var sosMonLinkId = sosPokemonData ? toID(sosPokemonData.name) : sosPokemonID;
        buf += '<a href="' + Config.baseurl + 'pokemon/' + sosMonLinkId + '" data-target="push" class="subtle" style="text-decoration:none"><div style="font-size:16px;font-weight:600">' + escapeHTML(sosMonName) + ' <small>(Lv. ' + sosData.level + ')</small></div></a>';
        buf += '</div>';

        // Types
        var sosTypes = (sosPokemonData ? sosPokemonData.types : null) || [];
        if (sosTypes.length) {
          buf += '<div style="margin-top:6px;display:flex;gap:6px;flex-wrap:wrap">' + sosTypes.map(function(t){return getTypeIcon(t);}).join(' ') + '</div>';
        }

        // Item
        if (sosData.item) {
          buf += '<div style="margin-top:10px">' + renderSosItemBox(sosData.item) + '</div>';
        }

        // Ability
        if (sosData.ability) {
          buf += '<div style="margin-top:10px">' + renderSosAbilityBox(sosData.ability) + '</div>';
        }

        // Nature
        if (sosData.nature) {
          var sosEff = NATURE_EFFECTS[sosData.nature] || null;
          var sosNatText = '<strong>Nature:</strong> ' + escapeHTML(sosData.nature);
          if (sosEff) {
            sosNatText += ' (<span style="color:#1f9d3a">' + sosEff[0] + '&#8593;</span> / <span style="color:#c22e28">' + sosEff[1] + '&#8595;</span>)';
          } else {
            sosNatText += ' (Neutral)';
          }
          buf += '<div style="margin-top:8px">' + sosNatText + '</div>';
        }

        // Moves
        if (sosData.moves && sosData.moves.length > 0) {
          buf += '<div style="margin-top:10px;display:flex;flex-direction:column;gap:6px">';
          for (var sk = 0; sk < sosData.moves.length; sk++) {
            buf += renderSosMoveBox(sosData.moves[sk]);
          }
          buf += '</div>';
        }

        buf += '</div></div>';
      }

      buf += '</div>';
    }

    buf += '</div>';

    this.html(buf);
  }
});
