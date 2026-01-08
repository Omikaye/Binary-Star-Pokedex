window.PokedexUsagePanel = PokedexResultPanel.extend({
  initialize: function(id) {
    id = toID(id);
    var pokemon = BattlePokedex[id];
    
    if (!pokemon) {
      this.html('<div class="pfx-body dexentry"><a href="' + Config.baseurl + 'usage/" class="pfx-backbutton" data-target="back"><i class="fa fa-chevron-left"></i> Usage</a><h1>Pokemon Not Found</h1></div>');
      return;
    }
    
    this.id = id;
    this.shortTitle = pokemon.name + ' - Usage';

    var buf = '<div class="pfx-body dexentry">';

    buf += '<a href="' + Config.baseurl + 'usage/" class="pfx-backbutton" data-target="back"><i class="fa fa-chevron-left"></i> Usage</a>';
    buf += '<h1>';
    if (pokemon.forme) {
      buf += '<a href="' + Config.baseurl + 'usage/' + id + '" data-target="push" class="subtle">' + pokemon.baseSpecies + '<small>-' + pokemon.forme + '</small></a>';
    } else {
      buf += '<a href="' + Config.baseurl + 'usage/' + id + '" data-target="push" class="subtle">' + pokemon.name + '</a>';
    }
    if (pokemon.num > 0) buf += ' <code>#' + pokemon.num + '</code>';
    buf += '</h1>';

    buf += '<img src="' + ResourcePrefix + 'sprites/gen5/' + id + '.png" alt="" width="96" height="96" class="sprite" />';

    // Get usage data
    var usage = { wild: [], trainer: [] };
    
    // Collect wild encounters
    if (window.Locations) {
      for (var i = 0; i < window.Locations.length; i++) {
        var loc = window.Locations[i];
        if (loc.encounters && Array.isArray(loc.encounters)) {
          for (var e = 0; e < loc.encounters.length; e++) {
            var encounter = loc.encounters[e];
            if (encounter.pokemon && Array.isArray(encounter.pokemon)) {
              for (var j = 0; j < encounter.pokemon.length; j++) {
                var mon = encounter.pokemon[j];
                if (mon.name) {
                  var dispName = typeof window.translateDisplayName === 'function' ? 
                    window.translateDisplayName(mon.name) : mon.name;
                  if (toID(dispName) === id) {
                    usage.wild.push({
                      location: loc,
                      encounter: encounter,
                      pokemon: mon,
                      type: 'normal'
                    });
                  }
                }
              }
              // Check SOS encounters
              if (mon.sos && Array.isArray(mon.sos)) {
                for (var s = 0; s < mon.sos.length; s++) {
                  var sosName = mon.sos[s];
                  var sosDispName = typeof window.translateDisplayName === 'function' ? 
                    window.translateDisplayName(sosName) : sosName;
                  if (toID(sosDispName) === id) {
                    usage.wild.push({
                      location: loc,
                      encounter: encounter,
                      pokemon: { name: sosName },
                      type: 'sos'
                    });
                  }
                }
              }
            }
          }
        }
      }
    }

    // Collect trainer usage
    if (window.Trainers) {
      for (var i = 0; i < window.Trainers.length; i++) {
        var trainer = window.Trainers[i];
        if (trainer.team && Array.isArray(trainer.team)) {
          for (var j = 0; j < trainer.team.length; j++) {
            var teamMon = trainer.team[j];
            if (teamMon.name) {
              var dispName = typeof window.translateDisplayName === 'function' ? 
                window.translateDisplayName(teamMon.name) : teamMon.name;
              if (toID(dispName) === id) {
                usage.trainer.push({
                  trainer: trainer,
                  pokemon: teamMon
                });
              }
            }
          }
        }
      }
    }

    // Display wild encounters
    buf += '<h3>Wild Encounters (' + usage.wild.length + ')</h3>';
    if (usage.wild.length > 0) {
      buf += '<ul class="utilichart nokbd">';
      for (var i = 0; i < usage.wild.length; i++) {
        var wildData = usage.wild[i];
        var loc = wildData.location;
        var encounter = wildData.encounter;
        
        buf += '<li class="result">';
        buf += '<a href="' + Config.baseurl + 'locations/' + loc.id + '" data-target="push">';
        buf += '<span class="col namecol" style="width:250px">' + escapeHTML(loc.name);
        if (wildData.type === 'sos') {
          buf += ' <small>(SOS)</small>';
        }
        buf += '</span> ';
        
        var levelText = '';
        if (encounter.levelRange) {
          if (encounter.levelRange.min === encounter.levelRange.max) {
            levelText = 'Lv. ' + encounter.levelRange.min;
          } else {
            levelText = 'Lv. ' + encounter.levelRange.min + '-' + encounter.levelRange.max;
          }
        }
        buf += '<span class="col" style="width:100px">' + levelText + '</span> ';
        
        if (encounter.spot) {
          buf += '<span class="col" style="width:150px;color:#777">' + escapeHTML(encounter.spot) + '</span> ';
        }
        
        buf += '</a>';
        buf += '</li>';
      }
      buf += '</ul>';
    } else {
      buf += '<p style="color:#999;padding:10px">No wild encounters found.</p>';
    }

    // Display trainer usage
    buf += '<h3>Trainer Teams (' + usage.trainer.length + ')</h3>';
    if (usage.trainer.length > 0) {
      buf += '<ul class="utilichart nokbd">';
      for (var i = 0; i < usage.trainer.length; i++) {
        var trainerData = usage.trainer[i];
        var trainer = trainerData.trainer;
        var mon = trainerData.pokemon;
        
        buf += '<li class="result">';
        buf += '<a href="' + Config.baseurl + 'trainers/' + trainer.id + '" data-target="push">';
        
        // Trainer thumbnail
        var trainerBg = (typeof getTrainerBackground === 'function') ? getTrainerBackground(trainer.name, true) : '';
        if (trainerBg) {
          var thumb = '<div style="position:absolute;left:-30px;top:-4px;width:128px;height:85px;opacity:0.35;pointer-events:none;overflow:hidden;">' +
            '<div style="width:512px;height:256px;transform:scale(0.175);transform-origin:top left;' + trainerBg + ';"></div>' +
          '</div>';
          buf += thumb;
        }
        
        buf += '<span class="col namecol" style="width:250px;position:relative;z-index:1">[' + trainer.id + '] ' + escapeHTML(trainer.name) + '</span> ';
        
        var levelText = mon.level ? 'Lv. ' + mon.level : '';
        buf += '<span class="col" style="width:80px;position:relative;z-index:1">' + levelText + '</span> ';
        
        if (mon.ability) {
          buf += '<span class="col" style="width:150px;color:#777;position:relative;z-index:1">' + escapeHTML(mon.ability) + '</span> ';
        }
        if (mon.item) {
          buf += '<span class="col" style="width:150px;color:#777;position:relative;z-index:1">@ ' + escapeHTML(mon.item) + '</span> ';
        }
        
        buf += '</a>';
        buf += '</li>';
      }
      buf += '</ul>';
    } else {
      buf += '<p style="color:#999;padding:10px">Not used by any trainers.</p>';
    }

    buf += '</div>';

    this.html(buf);
  }
});
