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
        var typeColors = {
          normal: '#A8A878', fighting: '#C03028', flying: '#A890F0', poison: '#A040A0', ground: '#E0C068',
          rock: '#B8A038', bug: '#A8B820', ghost: '#705898', steel: '#B8B8D0', fire: '#F08030',
          water: '#6890F0', grass: '#78C850', electric: '#F8D030', psychic: '#F85888', ice: '#98D8D8',
          dragon: '#7038F8', dark: '#705848', fairy: '#EE99AC'
        };
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
      
      var colors = ['#f15b5b', '#f28f44', '#f2c547', '#70c27a', '#5ba4f1', '#9a6df2'];
      
      for (var si = 0; si < sosEncounters.length; si++) {
        var sosEnc = sosEncounters[si];
        var sosData = staticEncounters[sosEnc.id];
        if (!sosData) continue;
        
        // Translate display name for SOS encounters
        var sosTranslatedName = window.translateDisplayName ? window.translateDisplayName(sosData.name) : sosData.name;
        var sosPokemonID = toID(sosTranslatedName);
        var sosPokemonData = BattlePokedex[sosPokemonID];
        var bg = colors[si % colors.length];
        
        buf += '<div style="border-radius:10px;overflow:hidden;margin-bottom:12px;border:1px solid rgba(0,0,0,0.08);box-shadow:0 2px 6px rgba(0,0,0,0.08)">';
        buf += '<div style="background:' + bg + ';color:#fff;padding:8px 12px;font-weight:bold">' + sosEnc.type + ' SOS Encounter</div>';
        buf += '<div style="background:linear-gradient(180deg, ' + bg + '22, #fff);padding:12px">';
        
        // Pokemon name and level
        buf += '<div style="margin-bottom:10px">';
        if (sosPokemonData) {
          buf += '<a href="' + Config.baseurl + 'pokemon/' + sosPokemonID + '" data-target="push" class="subtle" style="text-decoration:none"><div style="font-size:16px;font-weight:600">' + escapeHTML(sosPokemonData.name) + ' <small>(Lv. ' + sosData.level + ')</small></div></a>';
        } else {
          buf += '<div style="font-size:16px;font-weight:600">' + escapeHTML(sosTranslatedName) + ' <small>(Lv. ' + sosData.level + ')</small></div>';
        }
        buf += '</div>';
        
        // Nature
        if (sosData.nature) {
          var eff = NATURE_EFFECTS[sosData.nature] || null;
          var natText = '<strong>Nature:</strong> ' + escapeHTML(sosData.nature);
          if (eff) {
            natText += ' (<span style="color:#1f9d3a">' + eff[0] + '&#8593;</span> / <span style="color:#c22e28">' + eff[1] + '&#8595;</span>)';
          } else {
            natText += ' (Neutral)';
          }
          buf += '<div style="margin-bottom:8px">' + natText + '</div>';
        }
        
        // Ability
        if (sosData.ability) {
          var sosAbilityName = sosData.ability.replace(/\s+\([HS]\)$/, '');
          var sosAbilID = toID(sosAbilityName);
          var sosAbilityObj = BattleAbilities[sosAbilID];
          if (sosAbilityObj) {
            buf += '<div style="margin-bottom:8px;background:#fff;border:1px solid #ddd;border-radius:4px;padding:6px"><small><strong><a href="' + Config.baseurl + 'abilities/' + sosAbilID + '" data-target="push" class="subtle" style="text-decoration:none;color:inherit">' + escapeHTML(sosAbilityObj.name) + '</a>';
            if (sosData.ability.includes('(H)')) buf += ' <em>(H)</em>';
            if (sosData.ability.includes('(S)')) buf += ' <em>(S)</em>';
            buf += '</strong></a></small></div>';
          }
        }
        
        // Item
        if (sosData.item) {
          var sosItemID = toID(sosData.item);
          var sosItemName = BattleItems[sosItemID]?.name || sosData.item;
          buf += '<div style="margin-bottom:8px"><small><strong>Item:</strong> ' + escapeHTML(sosItemName) + '</small></div>';
        }
        
        // Moves
        if (sosData.moves && sosData.moves.length > 0) {
          buf += '<div style="margin-top:10px"><small><strong>Moves:</strong></small>';
          buf += '<div style="display:flex;flex-direction:column;gap:4px;margin-top:4px">';
          for (var sk = 0; sk < sosData.moves.length; sk++) {
            var sosMoveID = toID(sosData.moves[sk]);
            var sosMove = BattleMovedex[sosMoveID];
            if (sosMove) {
              buf += '<small>• ' + escapeHTML(sosMove.name) + '</small>';
            } else {
              buf += '<small>• ' + escapeHTML(sosData.moves[sk]) + '</small>';
            }
          }
          buf += '</div>';
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
