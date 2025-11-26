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
    for (var i = 0; i < (trainer.team || []).length; i++) {
      var m = trainer.team[i] || {};
      var monID = toID(m.name);
      var monData = BattlePokedex[monID];

      buf += '<li class="result">';
      buf += '<div class="resultrow">';

      // Pokemon name (link if found)
      if (monData) {
        buf += '<a href="' + Config.baseurl + 'pokemon/' + monID + '" data-target="push">'
          + '<span class="picon" style="' + getPokemonIcon(monID) + '"></span>'
          + '<span class="col namecol">' + escapeHTML(monData.name) + ' <small>(Lv. ' + (m.level || '?') + ')</small></span>'
          + '</a>';
      } else {
        buf += '<span class="col namecol">' + escapeHTML(m.name || '???') + ' <small>(Lv. ' + (m.level || '?') + ')</small></span>';
      }

      buf += '</div>';

      // Details line: item, ability, nature
      var details = [];
      if (m.item) {
        var itemID = toID(m.item);
        if (BattleItems[itemID]) {
          details.push('<strong>Item:</strong> <a href="' + Config.baseurl + 'items/' + itemID + '" data-target="push">' + escapeHTML(BattleItems[itemID].name) + '</a>');
        } else {
          details.push('<strong>Item:</strong> ' + escapeHTML(m.item));
        }
      }
      if (m.ability) {
        var abilID = toID(m.ability);
        if (BattleAbilities[abilID]) {
          details.push('<strong>Ability:</strong> <a href="' + Config.baseurl + 'abilities/' + abilID + '" data-target="push">' + escapeHTML(BattleAbilities[abilID].name) + '</a>');
        } else {
          details.push('<strong>Ability:</strong> ' + escapeHTML(m.ability));
        }
      }
      if (m.nature) {
        details.push('<strong>Nature:</strong> ' + escapeHTML(m.nature));
      }

      if (details.length) {
        buf += '<div class="resultsub">' + details.join(' &nbsp; | &nbsp; ') + '</div>';
      }

      // Moves
      var moves = m.moves || [];
      if (moves.length) {
        var mv = [];
        for (var j = 0; j < moves.length; j++) {
          var moveName = moves[j];
          var moveID = toID(moveName);
          if (BattleMovedex[moveID]) {
            mv.push('<a href="' + Config.baseurl + 'moves/' + moveID + '" data-target="push">' + escapeHTML(BattleMovedex[moveID].name) + '</a>');
          } else {
            mv.push(escapeHTML(moveName));
          }
        }
        buf += '<div class="resultsub"><strong>Moves:</strong> ' + mv.join(' / ') + '</div>';
      }

      buf += '</li>';
    }
    buf += '</ul>';

    buf += '</div>';

    this.html(buf);
  }
});
