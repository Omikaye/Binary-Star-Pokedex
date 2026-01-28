window.PokedexUsagePanel = PokedexResultPanel.extend({
  initialize: function(id) {
    // Translate display names (e.g., "Charizard 1" -> "Charizard-Mega-X") before converting to ID
    id = translateDisplayName(id);
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
    
    // Add "View in Pokedex" button in top right
    buf += '<div style="position:absolute;top:10px;right:10px">';
    buf += '<a href="' + Config.baseurl + 'pokemon/' + id + '" class="button" data-target="push" style="padding:8px 16px;background:#3572b0;color:white;text-decoration:none;border-radius:4px">View in Pokédex</a>';
    buf += '</div>';
    
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
    
    // Helper function to get all pre-evolutions of a Pokemon
    var getPreEvolutions = function(pokemonId) {
      var prevos = [];
      if (!window.BattleEvolutions) return prevos;
      
      // Search all Pokemon for those that evolve into our target
      for (var evoId in window.BattleEvolutions) {
        var evolutions = window.BattleEvolutions[evoId];
        if (Array.isArray(evolutions)) {
          for (var i = 0; i < evolutions.length; i++) {
            var evo = evolutions[i];
            if (toID(evo.target) === pokemonId) {
              prevos.push(evoId);
              // Recursively get pre-evolutions of the pre-evolution
              var deeperPrevos = getPreEvolutions(evoId);
              prevos = prevos.concat(deeperPrevos);
            }
          }
        }
      }
      return prevos;
    };
    
    // Get all pre-evolutions for this Pokemon
    var preEvolutions = getPreEvolutions(id);
    
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
                  var monId = toID(dispName);
                  
                  // Direct match
                  if (monId === id) {
                    usage.wild.push({
                      location: loc,
                      encounter: encounter,
                      pokemon: mon,
                      type: 'normal'
                    });
                  }
                  // Pre-evolution match (show evolved forms where pre-evos are found)
                  else if (preEvolutions.indexOf(monId) !== -1) {
                    usage.wild.push({
                      location: loc,
                      encounter: encounter,
                      pokemon: mon,
                      type: 'evolution',
                      prevoName: dispName
                    });
                  }
                }
                // Check SOS encounters
                if (mon.sos && Array.isArray(mon.sos)) {
                  for (var s = 0; s < mon.sos.length; s++) {
                    var sosName = mon.sos[s];
                    var sosDispName = typeof window.translateDisplayName === 'function' ? 
                      window.translateDisplayName(sosName) : sosName;
                    var sosId = toID(sosDispName);
                    
                    // Direct SOS match
                    if (sosId === id) {
                      usage.wild.push({
                        location: loc,
                        encounter: encounter,
                        pokemon: { name: sosName },
                        type: 'sos',
                        parentMon: mon
                      });
                    }
                    // Pre-evolution SOS match
                    else if (preEvolutions.indexOf(sosId) !== -1) {
                      usage.wild.push({
                        location: loc,
                        encounter: encounter,
                        pokemon: { name: sosName },
                        type: 'sos-evolution',
                        parentMon: mon,
                        prevoName: sosDispName
                      });
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    // Helper function to check if trainer has a location
    var trainerHasLocation = function(trainerId) {
      if (!window.Locations) return false;
      for (var i = 0; i < window.Locations.length; i++) {
        var loc = window.Locations[i];
        if (loc.trainers && loc.trainers.indexOf(trainerId) !== -1) return true;
        if (loc.bossTrainers && loc.bossTrainers.indexOf(trainerId) !== -1) return true;
      }
      return false;
    };
    
    // Helper function to check if static encounter has a location
    var staticEncounterHasLocation = function(staticId) {
      if (!window.Locations) return false;
      for (var i = 0; i < window.Locations.length; i++) {
        var loc = window.Locations[i];
        if (loc.staticPokemon && loc.staticPokemon.indexOf(staticId) !== -1) return true;
      }
      return false;
    };
    
    // Collect trainer usage (only trainers with locations)
    if (window.Trainers) {
      for (var i = 0; i < window.Trainers.length; i++) {
        var trainer = window.Trainers[i];
        // Only include trainers that have a documented location
        if (!trainerHasLocation(trainer.id)) continue;
        
        if (trainer.team && Array.isArray(trainer.team)) {
          for (var j = 0; j < trainer.team.length; j++) {
            var teamMon = trainer.team[j];
            if (teamMon.name) {
              var dispName = typeof window.translateDisplayName === 'function' ? 
                window.translateDisplayName(teamMon.name) : teamMon.name;
              if (toID(dispName) === id) {
                usage.trainer.push({
                  trainer: trainer,
                  pokemon: teamMon,
                  type: 'trainer'
                });
              }
            }
          }
        }
      }
    }
    
    // Collect static encounter usage (only static encounters with locations)
    if (window.StaticEncounters) {
      for (var staticId in window.StaticEncounters) {
        var staticEnc = window.StaticEncounters[staticId];
        // Only include static encounters that have a documented location
        if (!staticEncounterHasLocation(staticEnc.id)) continue;
        
        if (staticEnc.name) {
          var dispName = typeof window.translateDisplayName === 'function' ? 
            window.translateDisplayName(staticEnc.name) : staticEnc.name;
          if (toID(dispName) === id) {
            usage.trainer.push({
              staticEncounter: staticEnc,
              pokemon: staticEnc,
              type: 'static'
            });
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
        
        var displayText = '';
        
        // Build level text
        var levelText = '';
        if (encounter.levelRange) {
          if (encounter.levelRange.min === encounter.levelRange.max) {
            levelText = 'Lvl ' + encounter.levelRange.min;
          } else {
            levelText = 'Lvl ' + encounter.levelRange.min + '-' + encounter.levelRange.max;
          }
        }
        
        // Build spot text
        var spotText = encounter.spot ? escapeHTML(encounter.spot) : '';
        
        // For evolution encounters, format as "PrevoName found at Location Lvl X-Y Spot"
        if (wildData.type === 'evolution') {
          displayText = escapeHTML(wildData.prevoName) + ' found at ' + escapeHTML(loc.name);
          displayText += ' ' + levelText;
          if (spotText) displayText += ' ' + spotText;
        }
        // For SOS evolution encounters
        else if (wildData.type === 'sos-evolution') {
          displayText = escapeHTML(wildData.prevoName) + ' found at ' + escapeHTML(loc.name);
          displayText += ' ' + levelText;
          if (spotText) displayText += ' ' + spotText;
          displayText += ' (SOS)';
        }
        // For SOS encounters, format as "Location Lvl X-Y Spot (SOS)"
        else if (wildData.type === 'sos') {
          displayText = escapeHTML(loc.name);
          displayText += ' ' + levelText;
          if (spotText) displayText += ' ' + spotText;
          displayText += ' (SOS)';
        }
        // For normal encounters
        else {
          displayText = escapeHTML(loc.name);
          displayText += ' ' + levelText;
          if (spotText) displayText += ' ' + spotText;
        }
        
        buf += '<li class="result">';
        buf += '<a href="' + Config.baseurl + 'locations/' + loc.id + '" data-target="push">';
        buf += '<span class="col namecol" style="width:100%">' + displayText + '</span>';
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
        
        buf += '<li class="result">';
        
        // Static encounter display
        if (trainerData.type === 'static') {
          var staticEnc = trainerData.staticEncounter;
          buf += '<a href="' + Config.baseurl + 'encounters/' + staticEnc.id + '" data-target="push">';
          
          buf += '<span class="col namecol" style="width:250px">[' + staticEnc.id + '] ' + escapeHTML(staticEnc.name) + ' (Static)</span> ';
          
          var levelText = staticEnc.level ? 'Lv. ' + staticEnc.level : '';
          buf += '<span class="col" style="width:80px">' + levelText + '</span> ';
          
          if (staticEnc.ability) {
            buf += '<span class="col" style="width:150px;color:#777">' + escapeHTML(staticEnc.ability) + '</span> ';
          }
          if (staticEnc.item) {
            buf += '<span class="col" style="width:150px;color:#777">@ ' + escapeHTML(staticEnc.item) + '</span> ';
          }
        }
        // Regular trainer display
        else {
          var trainer = trainerData.trainer;
          var mon = trainerData.pokemon;
          
          buf += '<a href="' + Config.baseurl + 'trainers/' + trainer.id + '" data-target="push">';
          
          buf += '<span class="col namecol" style="width:250px">[' + trainer.id + '] ' + escapeHTML(trainer.name) + '</span> ';
          
          var levelText = mon.level ? 'Lv. ' + mon.level : '';
          buf += '<span class="col" style="width:80px">' + levelText + '</span> ';
          
          if (mon.ability) {
            buf += '<span class="col" style="width:150px;color:#777">' + escapeHTML(mon.ability) + '</span> ';
          }
          if (mon.item) {
            buf += '<span class="col" style="width:150px;color:#777">@ ' + escapeHTML(mon.item) + '</span> ';
          }
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
