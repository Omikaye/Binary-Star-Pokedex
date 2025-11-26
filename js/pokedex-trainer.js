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
      this.html('<div class="pfx-body dexentry"><a href="' + Config.baseurl + '" class="pfx-backbutton" data-target="back"><i class="fa fa-chevron-left"></i> Pok&eacute;dex</a><h1>Trainer ' + norm + '</h1><p>Trainer not found.</p></div>');
      return;
    }

    this.trainer = trainer;
    this.shortTitle = trainer.name;

    var buf = '<div class="pfx-body dexentry">';
    buf += '<a href="' + Config.baseurl + 'trainers/" class="pfx-backbutton" data-target="back"><i class="fa fa-chevron-left"></i> Trainers</a>';
    buf += '<h1><a href="' + Config.baseurl + 'trainers/' + norm + '" data-target="push" class="subtle">[' + trainer.id + '] ' + escapeHTML(trainer.name) + '</a></h1>';

    // Prize Money
    buf += '<dl>';
    buf += '<dt>Prize Money:</dt> <dd>$' + (trainer.prizeMoney || 0) + '</dd>';

    // Location placeholder (link to locations root for now)
    buf += '<dt>Location:</dt> <dd><a href="' + Config.baseurl + 'locations/" data-target="push">Coming soon</a></dd>';
    buf += '</dl>';

    // Team
    buf += '<h3>Team</h3>';
    buf += '<ul class="utilichart nokbd">';
    var TYPE_COLORS = {
      Normal: '#A8A77A', Fire: '#EE8130', Water: '#6390F0', Electric: '#F7D02C', Grass: '#7AC74C', Ice: '#96D9D6',
      Fighting: '#C22E28', Poison: '#A33EA1', Ground: '#E2BF65', Flying: '#A98FF3', Psychic: '#F95587', Bug: '#A6B91A',
      Rock: '#B6A136', Ghost: '#735797', Dragon: '#6F35FC', Dark: '#705746', Steel: '#B7B7CE', Fairy: '#D685AD'
    };
    var NATURE_EFFECTS = {
      Adamant: ['Atk', 'SpA'], Modest: ['SpA', 'Atk'], Jolly: ['Spe', 'SpA'], Timid: ['Spe', 'Atk'],
      Impish: ['Def', 'SpA'], Bold: ['Def', 'Atk'], Careful: ['SpD', 'SpA'], Calm: ['SpD', 'Atk'],
      Naughty: ['Atk', 'SpD'], Lonely: ['Atk', 'Def'], Hasty: ['Spe', 'Def'], Naive: ['Spe', 'SpD'],
      Gentle: ['SpD', 'Def'], Lax: ['Def', 'SpD'], Rash: ['SpA', 'SpD'], Mild: ['SpA', 'Def'],
      Quiet: ['SpA', 'Spe'], Brave: ['Atk', 'Spe'], Relaxed: ['Def', 'Spe'], Sassy: ['SpD', 'Spe'],
      Bashful: null, Docile: null, Serious: null, Hardy: null, Quirky: null
    };
    for (var i = 0; i < (trainer.team || []).length; i++) {
      var m = trainer.team[i] || {};
      var dispName = typeof window.translateDisplayName === 'function' ? window.translateDisplayName(m.name || '') : (m.name || '');
      var monID = toID(dispName);
      var monData = BattlePokedex[monID];

      buf += '<li class="result" style="margin-bottom:50px">';

      // Row 1: Pokemon Sprite | Item Sprite | Name (Level) | Types
      buf += '<div class="resultrow" style="display:flex;align-items:center;gap:6px;flex-wrap:wrap">';
      // Sprites block: keep on same plane and close together
      var spritesBlock = '';
      if (monData) {
        spritesBlock += '<a href="' + Config.baseurl + 'pokemon/' + monID + '" data-target="push" title="' + escapeHTML(monData.name) + '">' +
          '<span class="picon" style="' + getPokemonIcon(monID) + ';display:inline-block;vertical-align:middle"></span>' +
        '</a>';
      } else {
        spritesBlock += '<span class="picon" style="' + getPokemonIcon(monID) + ';display:inline-block;vertical-align:middle"></span>';
      }
      if (m.item) {
        var itemID = toID(m.item);
        var itemName = BattleItems[itemID]?.name || m.item;
        var itemHref = BattleItems[itemID] ? (Config.baseurl + 'items/' + itemID) : null;
        var itemIcon = '<span class="picon" style="' + getItemIcon(itemID) + ';display:inline-block;width:24px;height:24px;vertical-align:middle"></span>';
        spritesBlock += itemHref ? ('<a href="' + itemHref + '" data-target="push" title="' + escapeHTML(itemName) + '" style="margin-left:4px">' + itemIcon + '</a>') : ('<span style="margin-left:4px">' + itemIcon + '</span>');
      }
      buf += '<span style="display:inline-flex;align-items:center;gap:4px">' + spritesBlock + '</span>';
      var nameHtml = '<span style="font-size:14px">' + escapeHTML(monData ? monData.name : (m.name || '???')) + '</span> <small>(Lv. ' + (m.level || '?') + ')</small>';
      buf += '<span class="col namecol" style="min-width:200px">' + nameHtml + '</span>';
      // Types badges
      var types = (monData?.types || []);
      if (types.length) {
        buf += '<span class="col" style="display:inline-flex;gap:4px">' + types.map(function(t){return getTypeIcon(t);}).join('') + '</span>';
      }
      buf += '</div>';

      // Row 2: Ability | Nature with effects
      var abilHtml = '';
      if (m.ability) {
        var abilID = toID(m.ability);
        var abilName = BattleAbilities[abilID]?.name || m.ability;
        var abilHref = BattleAbilities[abilID] ? (Config.baseurl + 'abilities/' + abilID) : null;
        abilHtml = '<strong>Ability:</strong> ' + (abilHref ? ('<a href="' + abilHref + '" data-target="push">' + escapeHTML(abilName) + '</a>') : escapeHTML(abilName));
      }
      var natureHtml = '';
      if (m.nature) {
        var eff = NATURE_EFFECTS[m.nature] || null;
        if (eff) {
          natureHtml = '<strong>Nature:</strong> ' + escapeHTML(m.nature) +
            ' (<span style="color:#1f9d3a">' + eff[0] + '↑</span> / <span style="color:#c22e28">' + eff[1] + '↓</span>)';
        } else {
          natureHtml = '<strong>Nature:</strong> ' + escapeHTML(m.nature) + ' (Neutral)';
        }
      }
      var line2 = [abilHtml, natureHtml].filter(Boolean).join(' ');
      if (line2) buf += '<div class="resultsub" style="margin-top:4px">' + line2 + '</div>';

      // Row 3: Moves (colored by type, bold if STAB)
      var moves = m.moves || [];
      if (moves.length) {
        var mv = [];
        var stabTypes = (monData?.types || []).map(t => toID(t));
        for (var j = 0; j < moves.length; j++) {
          var moveName = moves[j];
          var moveID = toID(moveName);
          var move = BattleMovedex[moveID];
          var color = move ? TYPE_COLORS[move.type] : null;
          var isSTAB = move && stabTypes.indexOf(toID(move.type)) >= 0;
          var inner = move ? escapeHTML(move.name) : escapeHTML(moveName);
          var linkStart = move ? '<a href="' + Config.baseurl + 'moves/' + moveID + '" data-target="push"' : '<span';
          var linkEnd = move ? '</a>' : '</span>';
          var style = color ? (' style="background:' + color + ';color:#fff;padding:2px 6px;border-radius:4px;display:inline-block"') : '';
          var weightStart = isSTAB ? '<strong>' : '';
          var weightEnd = isSTAB ? '</strong>' : '';
          mv.push(linkStart + style + '>' + weightStart + inner + weightEnd + linkEnd);
        }
        // Two per line, consistent indentation via grid
        var rowA = mv.slice(0, 2);
        var rowB = mv.slice(2, 4);
        buf += '<div class="resultsub" style="margin-top:4px;display:grid;grid-template-columns:auto 1fr;column-gap:12px">' +
          '<span>' + (rowA[0] || '') + '</span><span>' + (rowA[1] || '') + '</span>' +
        '</div>';
        if (rowB.length) {
          buf += '<div class="resultsub" style="margin-top:2px;display:grid;grid-template-columns:auto 1fr;column-gap:12px">' +
            '<span>' + (rowB[0] || '') + '</span><span>' + (rowB[1] || '') + '</span>' +
          '</div>';
        }
      }

      buf += '</li>';
    }
    buf += '</ul>';

    buf += '</div>';

    this.html(buf);
  }
});
