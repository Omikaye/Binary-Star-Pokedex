window.PokedexTrainerPanel = PokedexResultPanel.extend({
  initialize: function (id) {
    // Normalize id to 3 digits (e.g., "2" -> "002")
    const raw = ('' + id).replace(/[^0-9]/g, '');
    const norm = raw.padStart(3, '0');
    this.id = norm;

    const trainers = window.Trainers || [];
    const trainer = trainers.find(t => t.id === norm);

    if (!trainer) {
      this.shortTitle = 'Trainer ' + norm;
      this.html('<div class="pfx-body dexentry"><a href="' + Config.baseurl + 'dex" class="pfx-backbutton" data-target="back"><i class="fa fa-chevron-left"></i> Pok&eacute;dex</a><h1>Trainer ' + norm + '</h1><p>Trainer not found.</p></div>');
      return;
    }

    this.trainer = trainer;
    this.shortTitle = trainer.name;

    // Get trainer sprite URL - match by:
    // 1. Last word of trainer name (personal name, e.g. "Hau" from "Punk Guy Hau")
    // 2. Everything except last word (trainer class, e.g. "Surf Dude" from "Surf Dude Harry")
    var spriteUrl = null;
    if (TrainerSpriteLinks) {
      // Try personal name first (last word of name)
      if (trainer.personalName && TrainerSpriteLinks[toID(trainer.personalName)]) {
        spriteUrl = TrainerSpriteLinks[toID(trainer.personalName)];
      }
      // Try trainer class (everything except last word)
      else if (trainer.trainerClass && TrainerSpriteLinks[toID(trainer.trainerClass)]) {
        spriteUrl = TrainerSpriteLinks[toID(trainer.trainerClass)];
      }
      // Fallback: extract from full name directly
      else if (trainer.name) {
        var nameParts = trainer.name.trim().split(/\s+/);
        if (nameParts.length >= 2) {
          var lastWordId = toID(nameParts[nameParts.length - 1]);
          var classNameId = toID(nameParts.slice(0, -1).join(' '));
          spriteUrl = TrainerSpriteLinks[lastWordId] || TrainerSpriteLinks[classNameId] || null;
        } else {
          spriteUrl = TrainerSpriteLinks[toID(trainer.name)] || null;
        }
      }
    }

    var buf = '<div class="pfx-body dexentry" style="position:relative;">';
    buf += '<style>' +
      '.dexentry .abilitydesccol { white-space: normal !important; overflow: visible !important; width: auto !important; height: auto !important; max-width: none !important; float: none !important; display: inline !important; }' +
      '.dexentry .movedesccol { white-space: normal !important; overflow: visible !important; width: auto !important; height: auto !important; max-width: none !important; float: none !important; display: inline !important; }' +
      '.dexentry .namecol { float: none !important; display: inline !important; padding-top: 0 !important; height: auto !important; }' +
      '.dexentry h1 { margin-top: 0; margin-bottom: 6px; white-space: nowrap; position: relative; z-index: 10; text-shadow: 0 0 6px #fff, 0 0 6px #fff, 0 0 10px rgba(255,255,255,0.8); }' +
      '.dexentry h1 a { display:inline-block; white-space:nowrap; vertical-align: middle; }' +
      '.dexentry dt, .dexentry dd { text-shadow: 0 0 5px #fff, 0 0 5px #fff, 0 0 8px rgba(255,255,255,0.7); }' +
      'body.dark-mode .dexentry h1, body.dark-mode .dexentry dt, body.dark-mode .dexentry dd { text-shadow: 0 0 6px rgba(0,0,0,0.65), 0 0 10px rgba(0,0,0,0.45); }' +
      '.dexentry > * { position: relative; z-index: 1; }' +
      '.trainer-sprite-img { position: absolute; top: 0; right: 0; max-height: 200px; opacity: 0.7; pointer-events: none; z-index: 0; }' +
      '</style>';
    buf += '<a href="' + Config.baseurl + 'trainers/" class="pfx-backbutton" data-target="back"><i class="fa fa-chevron-left"></i> Trainers</a>';

    // Trainer sprite image at top-right of the page
    if (spriteUrl) {
      buf += '<img class="trainer-sprite-img" src="' + escapeHTML(spriteUrl) + '" alt="' + escapeHTML(trainer.name) + ' sprite" />';
    }

    buf += '<h1><a href="' + Config.baseurl + 'trainers/' + norm + '" data-target="push" class="subtle">[' + trainer.id + '] ' + escapeHTML(trainer.name) + '</a></h1>';

    // Prize Money
    buf += '<dl>';
    buf += '<dt>Prize Money:</dt> <dd>$' + (trainer.prizeMoney || 0) + '</dd>';

    // Location - find trainer's location from Locations data
    var trainerLocation = null;
    var battleNotes = '';
    if (window.Locations) {
      for (var i = 0; i < window.Locations.length; i++) {
        var loc = window.Locations[i];
        
        // Check battles array for trainer ID and get notes
        if (loc.battles) {
          for (var bi = 0; bi < loc.battles.length; bi++) {
            var battle = loc.battles[bi];
            // Convert both to strings and pad battle ID to match trainer ID format
            var battleID = String(battle.id).padStart(3, '0');
            if (battleID === norm) {
              trainerLocation = loc;
              battleNotes = battle.notes || '';
              break;
            }
          }
        }
        
        if (!trainerLocation && loc.trainers && loc.trainers.indexOf(norm) !== -1) {
          trainerLocation = loc;
        }
        if (!trainerLocation && loc.bossTrainers && loc.bossTrainers.indexOf(norm) !== -1) {
          trainerLocation = loc;
        }
        
        if (trainerLocation) break;
      }
    }
    if (trainerLocation) {
      buf += '<dt>Location:</dt> <dd><a href="' + Config.baseurl + 'locations/' + trainerLocation.id + '" data-target="push">' + escapeHTML(trainerLocation.name) + '</a></dd>';
    }
    
    // Description from battle notes (skip if "None")
    if (battleNotes && battleNotes.trim() && battleNotes.trim().toLowerCase() !== 'none') {
      buf += '<dt>Description:</dt> <dd>' + escapeHTML(battleNotes) + '</dd>';
    }
    buf += '</dl>';

    // === Team synopsis ===
    var teamList = (trainer.team || []).slice(0, 6);
    if (teamList.length > 0) {
      buf += '<div style="margin-top:12px">';
      buf += '<strong>Team:</strong>';
      buf += '<div style="display:flex;flex-wrap:wrap;gap:4px;margin-top:6px;align-items:flex-end">';
      for (var synopsisIndex = 0; synopsisIndex < teamList.length; synopsisIndex++) {
        var teamMember = teamList[synopsisIndex];
        var sDispName = typeof window.translateDisplayName === 'function' ? window.translateDisplayName(teamMember.name || '') : (teamMember.name || '');
        var sMonID = toID(sDispName);
        var sMonData = BattlePokedex[sMonID];
        if (!sMonData && sMonID) {
          // Split the display name (before toID removes dashes) to get the base species
          var sDashIdx = sDispName.indexOf('-');
          var sBaseID = sDashIdx !== -1 ? toID(sDispName.substring(0, sDashIdx)) : sMonID;
          sMonData = BattlePokedex[sBaseID];
        }
        var sMonLinkId = sMonData ? toID(sMonData.name) : sMonID;
        buf += '<div style="position:relative;display:inline-block">';
        buf += '<a href="' + Config.baseurl + 'pokemon/' + sMonLinkId + '" data-target="push">';
        buf += '<img src="' + ResourcePrefix + 'sprites/gen5/' + sMonID + '.png" alt="' + escapeHTML(sDispName) + '" width="96" height="96" />';
        buf += '</a>';
        if (teamMember.item) {
          var sItemID = toID(teamMember.item);
          buf += '<a href="' + Config.baseurl + 'items/' + sItemID + '" data-target="push" style="position:absolute;bottom:0;right:0;display:block;width:32px;height:32px">';
          buf += '<span class="itemicon" style="' + getItemIcon(sItemID) + ';width:32px;height:32px;display:block"></span>';
          buf += '</a>';
        }
        buf += '</div>';
      }
      buf += '</div>';
      buf += '</div>';
    }

    // === Team layout ===
    var NATURE_EFFECTS = {
      Adamant: ['Atk', 'SpA'], Modest: ['SpA', 'Atk'], Jolly: ['Spe', 'SpA'], Timid: ['Spe', 'Atk'],
      Impish: ['Def', 'SpA'], Bold: ['Def', 'Atk'], Careful: ['SpD', 'SpA'], Calm: ['SpD', 'Atk'],
      Naughty: ['Atk', 'SpD'], Lonely: ['Atk', 'Def'], Hasty: ['Spe', 'Def'], Naive: ['Spe', 'SpD'],
      Gentle: ['SpD', 'Def'], Lax: ['Def', 'SpD'], Rash: ['SpA', 'SpD'], Mild: ['SpA', 'Def'],
      Quiet: ['SpA', 'Spe'], Brave: ['Atk', 'Spe'], Relaxed: ['Def', 'Spe'], Sassy: ['SpD', 'Spe'],
      Bashful: null, Docile: null, Serious: null, Hardy: null, Quirky: null
    };

    var isDarkMode = document.body && document.body.classList.contains('dark-mode');
    var colors = isDarkMode
      ? ['#9d2e2e', '#9a5a23', '#8a6b1a', '#2f6e39', '#2f5f97', '#58408f']
      : ['#f15b5b', '#f28f44', '#f2c547', '#70c27a', '#5ba4f1', '#9a6df2'];

    // Type color mapping (similar to type sprite colors)
    var typeColors = {
      normal: '#A8A878', fighting: '#C03028', flying: '#A890F0', poison: '#A040A0', ground: '#E0C068',
      rock: '#B8A038', bug: '#A8B820', ghost: '#705898', steel: '#B8B8D0', fire: '#F08030',
      water: '#6890F0', grass: '#78C850', electric: '#F8D030', psychic: '#F85888', ice: '#98D8D8',
      dragon: '#7038F8', dark: '#705848', fairy: '#EE99AC'
    };

    var getTypeColor = function(type) {
      return typeColors[toID(type)] || '#ccc';
    };

    var renderItemBox = function(itemName) {
      if (!itemName) return '';
      var itemID = toID(itemName);
      var data = BattleItems[itemID];
      var title = data ? data.name : itemName;
      var desc = data ? (data.shortDesc || data.desc || '') : '';
      var icon = '<span class="itemicon" style="' + getItemIcon(itemID) + ';width:32px;height:32px;display:inline-block;vertical-align:top;flex-shrink:0"></span>';
      var boxBg = isDarkMode ? '#1a2435' : '#fff';
      var boxBorder = isDarkMode ? '#3f536f' : '#ddd';
      var boxTextColor = isDarkMode ? '#d8e3f7' : '#333';
      return '<a href="' + Config.baseurl + 'items/' + itemID + '" data-target="push" class="subtle" style="text-decoration:none"><div class="infobox" style="background:' + boxBg + ';border:1px solid ' + boxBorder + ';border-radius:6px;padding:8px;display:flex;gap:8px;align-items:flex-start;color:' + boxTextColor + '">' + icon + '<div style="flex:1"><strong>' + escapeHTML(title) + '</strong><br /><small>' + escapeHTML(desc) + '</small></div></div></a>';
    };

    var isAbilityLegal = function(abilityName, monData) {
      if (!monData || !abilityName) return true;
      // Check if this Pokémon can learn Sketch (which learns all moves)
      var learnset = window.Learnsets[monData.id] || [];
      for (var i = 0; i < learnset.length; i++) {
        if (toID(learnset[i].move || learnset[i]) === 'sketch') return true;
      }
      // Check ability legality
      for (var slot in (monData.abilities || {})) {
        if (monData.abilities[slot] === abilityName) return true;
      }
      return false;
    };

    var isMoveLegal = function(moveName, monData) {
      if (!monData || !moveName) return true;
      var learnset = window.Learnsets[monData.id] || [];
      var moveID = toID(moveName);
      // Check if this Pokémon can learn Sketch (which learns all moves)
      for (var i = 0; i < learnset.length; i++) {
        if (toID(learnset[i].move || learnset[i]) === 'sketch') return true;
      }
      for (var i = 0; i < learnset.length; i++) {
        if (toID(learnset[i].move || learnset[i]) === moveID) return true;
      }
      return false;
    };

    var renderAbilityBox = function(abilityName, monData) {
      if (!abilityName) return '';
      var abilityID = toID(abilityName);
      var data = BattleAbilities[abilityID];
      var isLegal = isAbilityLegal(abilityName, monData);
      var nameColor = isLegal ? '' : 'color:red;';
      var boxBg = isDarkMode ? '#1a2435' : '#fff';
      var boxBorder = isDarkMode ? '#3f536f' : '#ddd';
      var boxTextColor = isDarkMode ? '#d8e3f7' : '#333';
      var content = '<div class="infobox" style="background:' + boxBg + ';border:1px solid ' + boxBorder + ';border-radius:6px;padding:8px;color:' + boxTextColor + '"><strong style="' + nameColor + '">' + escapeHTML((data ? data.name : abilityName)) + '</strong><br /><small>' + escapeHTML((data ? (data.shortDesc || data.desc || '') : '')) + '</small></div>';
      return '<a href="' + Config.baseurl + 'abilities/' + abilityID + '" data-target="push" class="subtle" style="text-decoration:none">' + content + '</a>';
    };

    var renderMoveBox = function(moveName, monData) {
      if (!moveName) return '';
      var moveID = toID(moveName);
      var data = BattleMovedex[moveID];
      var moveType = data ? toID(data.type) : 'normal';
      var bgColor = getTypeColor(moveType);
      var typeIcon = '<span style="margin-left:6px;display:inline-block">' + getTypeIcon(moveType) + '</span>';
      var categoryIcon = data ? '<span style="display:inline-block;vertical-align:middle;margin-right:6px">' + getCategoryIcon(data.category) + '</span>' : '';
      var isLegal = isMoveLegal(moveName, monData);
      var nameColor = isLegal ? '' : 'color:red;';
      var moveTextColor = isDarkMode ? '#d8e3f7' : '#333';
      var moveBg = isDarkMode ? (bgColor + '44') : (bgColor + '33');
      if (!data) return '<div class="infobox" style="background:' + moveBg + ';border:1px solid ' + bgColor + ';border-radius:6px;padding:8px;color:' + moveTextColor + '">' + escapeHTML(moveName) + typeIcon + '</div>';
      
      // Build stats string: "Pow: 40 Acc: 100 PP: 10"
      var statsText = '';
      if (data.category !== 'Status') {
        statsText += '<b>Pow:</b> ' + (data.basePower || '&mdash;') + ' ';
      }
      statsText += '<b>Acc:</b> ' + (data.accuracy && data.accuracy !== true ? data.accuracy + '%' : '&mdash;') + ' ';
      var pp = data.noPPBoosts ? data.pp : Math.floor(data.pp * 8 / 5);
      statsText += '<b>PP:</b> ' + pp;
      
      return '<a href="' + Config.baseurl + 'moves/' + moveID + '" data-target="push" class="subtle" style="text-decoration:none"><div class="infobox" style="background:' + moveBg + ';border:1px solid ' + bgColor + ';border-radius:6px;padding:8px;color:' + moveTextColor + ';display:flex;justify-content:space-between;align-items:center"><div>' + categoryIcon + '<strong style="' + nameColor + '">' + escapeHTML(data.name) + '</strong><br /><small>' + statsText + '</small><br /><small>' + escapeHTML(data.shortDesc || data.desc || '') + '</small></div>' + typeIcon + '</div></a>';
    };

    // Team cards
    buf += '<div style="margin-top:12px">';
    for (var pi = 0; pi < (trainer.team || []).length && pi < 6; pi++) {
      var m = trainer.team[pi] || {};
      var dispName = typeof window.translateDisplayName === 'function' ? window.translateDisplayName(m.name || '') : (m.name || '');
      var monID = toID(dispName);
      var monData = BattlePokedex[monID];
      var iconId = monID;
      if (!monData && monID) {
        // Split the display name (before toID removes dashes) to get the base species
        var dashIdx = dispName.indexOf('-');
        var baseID = dashIdx !== -1 ? toID(dispName.substring(0, dashIdx)) : monID;
        monData = BattlePokedex[baseID];
        // Don't change iconId - keep the form information for correct sprite
      }
      var bg = colors[pi % colors.length];

      var cardBorder = isDarkMode ? 'rgba(126,151,191,0.45)' : 'rgba(0,0,0,0.08)';
      var cardBodyBg = isDarkMode ? ('linear-gradient(180deg, ' + bg + '88, #1a2435)') : ('linear-gradient(180deg, ' + bg + '22, #fff)');
      buf += '<div style="border-radius:10px;overflow:hidden;margin-bottom:12px;border:1px solid ' + cardBorder + ';box-shadow:0 2px 6px rgba(0,0,0,0.08)">';
      buf += '<div style="background:' + bg + ';color:#fff;padding:8px 12px;font-weight:bold">Pokémon ' + (pi+1) + '</div>';
      buf += '<div style="background:' + cardBodyBg + ';padding:12px">';

      buf += '<div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap">';
      buf += '<span class="picon" style="' + getPokemonIcon(iconId) + ';display:inline-block;vertical-align:middle"></span>';
      var monName = dispName || (monData ? monData.name : '???');
      var monLinkId = monData ? toID(monData.name) : monID;
      buf += '<a href="' + Config.baseurl + 'pokemon/' + monLinkId + '" data-target="push" class="subtle" style="text-decoration:none"><div style="font-size:16px;font-weight:600">' + escapeHTML(monName) + ' <small>(Lv. ' + (m.level || '?') + ')</small></div></a>';
      buf += '</div>';

      var types = (monData?.types || []);
      if (types.length) {
        buf += '<div style="margin-top:6px;display:flex;gap:6px;flex-wrap:wrap">' + types.map(function(t){return getTypeIcon(t);}).join(' ') + '</div>';
      }

      if (m.item) {
        buf += '<div style="margin-top:10px">' + renderItemBox(m.item) + '</div>';
      }

      if (m.ability) {
        buf += '<div style="margin-top:10px">' + renderAbilityBox(m.ability, monData) + '</div>';
      }

      if (m.nature) {
        var eff = NATURE_EFFECTS[m.nature] || null;
        var natText = '<strong>Nature:</strong> ' + escapeHTML(m.nature);
        if (eff) {
          natText += ' (<span style="color:#1f9d3a">' + eff[0] + '&#8593;</span> / <span style="color:#c22e28">' + eff[1] + '&#8595;</span>)';
        } else {
          natText += ' (Neutral)';
        }
        buf += '<div style="margin-top:8px">' + natText + '</div>';
      }

      var moves = m.moves || [];
      if (moves.length) {
        buf += '<div style="margin-top:10px;display:flex;flex-direction:column;gap:6px">';
        for (var mj = 0; mj < moves.length; mj++) {
          buf += renderMoveBox(moves[mj], monData);
        }
        buf += '</div>';
      }

      buf += '</div></div>';
    }
    buf += '</div>';

    buf += '</div>';
    this.html(buf);
  }
});
