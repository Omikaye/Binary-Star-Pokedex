window.PokedexUsagePanel = PokedexResultPanel.extend({
  initialize: function(id) {
    // Translate display names (e.g., "Charizard 1" -> "Charizard-Mega-X") before converting to ID
    id = translateDisplayName(id);
    id = toID(id);
    id = resolveDexID(id, BattlePokedex);
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
    var detail = window.getPokemonUsageDetail(id);
    var usage = { wild: detail.wild, sos: detail.sos, prevo: detail.prevoWild, trainer: detail.trainer.slice() };

    // Helper function to check if static encounter has a location
    var staticEncounterHasLocation = function(staticId) {
      if (!window.Locations) return false;
      for (var i = 0; i < window.Locations.length; i++) {
        var loc = window.Locations[i];
        if (loc.staticPokemon && loc.staticPokemon.indexOf(staticId) !== -1) return true;
      }
      return false;
    };

    // Collect static encounter usage (only static encounters with locations)
    if (window.StaticEncounters) {
      for (var staticId in window.StaticEncounters) {
        var staticEnc = window.StaticEncounters[staticId];
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

    var renderWildList = function(list, emptyText, showPrevo) {
      var out = '';
      if (list.length === 0) return '<p style="color:#999;padding:10px">' + emptyText + '</p>';
      out += '<ul class="utilichart nokbd">';
      for (var i = 0; i < list.length; i++) {
        var wildData = list[i];
        var loc = wildData.location;
        var encounter = wildData.encounter;
        var levelText = '';
        if (encounter.levelRange) {
          levelText = encounter.levelRange.min === encounter.levelRange.max ?
            'Lvl ' + encounter.levelRange.min : 'Lvl ' + encounter.levelRange.min + '-' + encounter.levelRange.max;
        }
        var spotText = encounter.spot ? escapeHTML(encounter.spot) : '';
        var displayText = '';
        if (showPrevo) displayText += escapeHTML(wildData.prevoName) + ' found at ';
        displayText += escapeHTML(loc.name) + ' ' + levelText;
        if (spotText) displayText += ' ' + spotText;
        if (wildData.type === 'sos') displayText += ' (SOS)';
        out += '<li class="result"><a href="' + Config.baseurl + 'locations/' + loc.id + '" data-target="push">';
        out += '<span class="col namecol" style="width:100%">' + displayText + '</span></a></li>';
      }
      return out + '</ul>';
    };

    // Display wild encounters
    buf += '<h3>Wild Encounters (' + usage.wild.length + ')</h3>';
    buf += renderWildList(usage.wild, 'No wild encounters found.', false);

    buf += '<h3>S.O.S. Encounters (' + usage.sos.length + ')</h3>';
    buf += renderWildList(usage.sos, 'No S.O.S. encounters found.', false);

    buf += '<h3>Pre-evolution Usage (' + usage.prevo.length + ')</h3>';
    buf += renderWildList(usage.prevo, 'No pre-evolutions found in the wild.', true);

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
          var trainerLoc = trainerData.location;
          
          buf += '<a href="' + Config.baseurl + 'trainers/' + trainer.id + '" data-target="push">';
          
          var trainerLabel = escapeHTML(trainer.name);
          if (trainerLoc) trainerLabel += ' <span style="color:#777">(' + escapeHTML(trainerLoc.name) + ')</span>';
          if (trainerData.megaOf) trainerLabel += ' <small style="color:#777">[' + escapeHTML(trainerData.megaOf) + ' + Mega Stone]</small>';
          buf += '<span class="col namecol" style="width:350px">' + trainerLabel + '</span> ';
          
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
