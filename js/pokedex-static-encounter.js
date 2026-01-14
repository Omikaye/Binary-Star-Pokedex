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
    this.shortTitle = encounter.name + ' (Lv. ' + encounter.level + ')';

    var buf = '<div class="pfx-body dexentry">';
    buf += '<style>' +
      '.dexentry .abilitydesccol { white-space: normal !important; overflow: visible !important; width: auto !important; height: auto !important; max-width: none !important; float: none !important; display: inline !important; }' +
      '.dexentry .movedesccol { white-space: normal !important; overflow: visible !important; width: auto !important; height: auto !important; max-width: none !important; float: none !important; display: inline !important; }' +
      '.dexentry .namecol { float: none !important; display: inline !important; padding-top: 0 !important; height: auto !important; }' +
      '.dexentry h1 { margin-top: 0; margin-bottom: 6px; white-space: nowrap; position: relative; z-index: 1; }' +
      '.dexentry h1 a { display:inline-block; white-space:nowrap; vertical-align: middle; }' +
      '.dexentry > * { position: relative; z-index: 1; }' +
      '</style>';
    buf += '<a href="' + Config.baseurl + 'trainers/" class="pfx-backbutton" data-target="back"><i class="fa fa-chevron-left"></i> Encounters</a>';
    
    // Encounter title
    buf += '<h1><a href="' + Config.baseurl + 'encounters/' + staticID + '" data-target="push" class="subtle">[' + encounter.id + '] ' + escapeHTML(encounter.name) + ' (Lv. ' + encounter.level + ')</a></h1>';

    // Basic Info
    buf += '<dl>';
    
    // Item
    if (encounter.item) {
      var itemID = toID(encounter.item);
      var itemName = BattleItems[itemID]?.name || encounter.item;
      buf += '<dt>Item:</dt> <dd>' + escapeHTML(itemName) + ' (@' + escapeHTML(encounter.item) + ')</dd>';
    } else {
      buf += '<dt>Item:</dt> <dd>None</dd>';
    }
    
    // Nature
    buf += '<dt>Nature:</dt> <dd>' + escapeHTML(encounter.nature) + '</dd>';
    
    // Aura
    if (encounter.aura && encounter.aura.effect) {
      var auraText = encounter.aura.effect;
      if (encounter.aura.boost) {
        auraText += ' (' + encounter.aura.boost + ')';
      }
      buf += '<dt>Aura:</dt> <dd>' + escapeHTML(auraText) + '</dd>';
    }
    
    buf += '</dl>';

    // Ability
    buf += '<h3>Ability</h3>';
    if (encounter.ability) {
      var abilID = toID(encounter.ability);
      var abilityObj = BattleAbilities[abilID];
      if (abilityObj) {
        var abilRow = (window.BattleSearch && typeof BattleSearch.renderAbilityRow === 'function')
          ? BattleSearch.renderAbilityRow(abilityObj)
          : ('<li class="result" style="background:transparent">' +
              '<a href="' + Config.baseurl + 'abilities/' + abilID + '" data-target="push">' +
                '<span class="col namecol">' + escapeHTML(abilityObj.name) + '</span> ' +
                '<span class="col abilitydesccol">' + escapeHTML(abilityObj.shortDesc || abilityObj.desc || '') + '</span> ' +
              '</a>' +
            '</li>');
        buf += '<ul class="utilichart nokbd">' + abilRow + '</ul>';
      } else {
        buf += '<div class="resultsub"><strong>' + escapeHTML(encounter.ability) + '</strong> (Ability Slot: ' + encounter.abilitySlot + ')</div>';
      }
    }

    // Moves
    if (encounter.moves && encounter.moves.length > 0) {
      buf += '<h3>Moves</h3>';
      var moveBuf = '';
      for (var j = 0; j < encounter.moves.length; j++) {
        var moveID = toID(encounter.moves[j]);
        var move = BattleMovedex[moveID];
        if (!move) {
          moveBuf += '<li class="result">' + escapeHTML(encounter.moves[j]) + '</li>';
          continue;
        }
        var rowHTML = (window.BattleSearch && typeof BattleSearch.renderMoveRow === 'function')
          ? BattleSearch.renderMoveRow(move)
          : ('<li class="result"><a href="' + Config.baseurl + 'moves/' + moveID + '" data-target="push"><span class="col movenamecol">' + escapeHTML(move.name) + '</span> <span class="col movedesccol">' + escapeHTML(move.shortDesc || move.desc || '') + '</span></a></li>');
        
        // Replace boosted PP with base PP
        if (rowHTML) {
          var markerStart = '<span class="col pplabelcol"><em>PP</em><br />';
          var markerEnd = '</span>';
          var sidx = rowHTML.indexOf(markerStart);
          if (sidx >= 0) {
            var after = sidx + markerStart.length;
            var eidx = rowHTML.indexOf(markerEnd, after);
            if (eidx >= 0) {
              rowHTML = rowHTML.slice(0, after) + move.pp + rowHTML.slice(eidx);
            }
          }
        }
        moveBuf += rowHTML;
      }
      buf += '<ul class="utilichart nokbd">' + moveBuf + '</ul>';
    }

    // SOS Encounters
    if (encounter.sos && (encounter.sos.primary || encounter.sos.secondary)) {
      buf += '<h3>SOS Encounters</h3>';
      buf += '<dl>';
      
      if (encounter.sos.primary) {
        var sosPrimaryData = staticEncounters[encounter.sos.primary];
        if (sosPrimaryData) {
          buf += '<dt>Primary:</dt> <dd>' +
            '<a href="' + Config.baseurl + 'encounters/' + encounter.sos.primary + '" data-target="push">' +
              '[' + encounter.sos.primary + '] ' + escapeHTML(sosPrimaryData.name) + ' (Lv. ' + sosPrimaryData.level + ')' +
            '</a>' +
          '</dd>';
        } else {
          buf += '<dt>Primary:</dt> <dd>[' + encounter.sos.primary + '] (Unknown)</dd>';
        }
      }
      
      if (encounter.sos.secondary) {
        var sosSecondaryData = staticEncounters[encounter.sos.secondary];
        if (sosSecondaryData) {
          buf += '<dt>Secondary:</dt> <dd>' +
            '<a href="' + Config.baseurl + 'encounters/' + encounter.sos.secondary + '" data-target="push">' +
              '[' + encounter.sos.secondary + '] ' + escapeHTML(sosSecondaryData.name) + ' (Lv. ' + sosSecondaryData.level + ')' +
            '</a>' +
          '</dd>';
        } else {
          buf += '<dt>Secondary:</dt> <dd>[' + encounter.sos.secondary + '] (Unknown)</dd>';
        }
      }
      
      buf += '</dl>';
    }

    buf += '</div>';

    this.html(buf);
  }
});
