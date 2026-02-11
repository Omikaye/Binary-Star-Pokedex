// Locations panels: list and detail
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
    
    if (!query) {
      this.filteredLocations = this.allLocations;
    } else {
      this.filteredLocations = this.allLocations.filter(function(loc) {
        if (!loc) return false;
        
        // Search by location name
        if ((loc.name || '').toLowerCase().indexOf(query) >= 0) return true;
        if ((loc.id || '').toLowerCase().indexOf(query) >= 0) return true;
        
        // Search by Pokemon in encounters
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
                // Check SOS encounters
                if (mon.sos && Array.isArray(mon.sos)) {
                  for (var k = 0; k < mon.sos.length; k++) {
                    var sosName = mon.sos[k];
                    var sosTranslated = window.translateDisplayName ? window.translateDisplayName(sosName) : sosName;
                    if (sosTranslated.toLowerCase().indexOf(query) >= 0) return true;
                  }
                }
              }
            }
          }
        }
        
        // Search by items
        if (loc.items) {
          for (var i = 0; i < loc.items.length; i++) {
            if ((loc.items[i].item || '').toLowerCase().indexOf(query) >= 0) return true;
          }
        }
        
        // Search by shop items
        if (loc.shops) {
          for (var i = 0; i < loc.shops.length; i++) {
            if ((loc.shops[i].item || '').toLowerCase().indexOf(query) >= 0) return true;
          }
        }
        
        // Search by trainers
        if (loc.trainers) {
          for (var i = 0; i < loc.trainers.length; i++) {
            var tid = loc.trainers[i];
            var paddedTid = tid.padStart(3, '0');
            var trainer = (window.Trainers || []).find(function(t) { return t.id === paddedTid; });
            if (trainer && (trainer.name || '').toLowerCase().indexOf(query) >= 0) return true;
          }
        }
        if (loc.bossTrainers) {
          for (var i = 0; i < loc.bossTrainers.length; i++) {
            var tid = loc.bossTrainers[i];
            var paddedTid = tid.padStart(3, '0');
            var trainer = (window.Trainers || []).find(function(t) { return t.id === paddedTid; });
            if (trainer && (trainer.name || '').toLowerCase().indexOf(query) >= 0) return true;
          }
        }
        
        return false;
      });
    }
    
    this.renderLocationList(this.filteredLocations);
  },
  renderLocationList: function(list) {
    var buf = '';
    for (var i = 0; i < list.length; i++) {
      var loc = list[i];
      if (!loc || !loc.id) continue;
      var notes = (loc.notes || '').trim();
      buf += '<li class="result" style="display:block;padding:0;height:auto;min-height:initial;overflow:visible;position:relative">';
      buf += '<a href="' + Config.baseurl + 'locations/' + loc.id + '" data-target="push" style="display:block;padding:8px;text-decoration:none">';
      buf += '<span class="col numcol">' + (this.allLocations.indexOf(loc) + 1) + '</span>';
      buf += '<span class="col namecol">' + escapeHTML(loc.name || loc.id) + '</span>';
      buf += '</a>';
      if (notes) buf += '<div style="padding:4px 12px 8px 12px;color:#666;font-size:0.9em;border-top:1px solid #eee;clear:both;width:100%;box-sizing:border-box;background:#f5f5f5">' + escapeHTML(notes) + '</div>';
      buf += '</li>';
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

    var buf = '<div class="pfx-body dexentry">';
    buf += '<a href="' + Config.baseurl + 'locations/" class="pfx-backbutton" data-target="back"><i class="fa fa-chevron-left"></i> Locations</a>';
    buf += '<h1><a href="' + Config.baseurl + 'locations/' + loc.id + '" data-target="push" class="subtle">' + escapeHTML(loc.name || loc.id) + '</a></h1>';

    // Lightweight CSS for tables and colors
    buf += '<style>\n'
      + '.utilitable th, .utilitable td{border-bottom:1px solid #ddd;padding:6px 8px} .utilitable thead th{border-bottom:2px solid #bbb}\n'
      + '.chancepill{display:inline-block;min-width:42px;text-align:center;background:#f2f2f2;border:1px solid #ddd;border-radius:10px;padding:2px 6px;margin-right:8px;color:#444}\n'
      + '.sos-row td{background:#ffecec}/* light red */\n'
      + '.spot-Grass tbody tr:nth-child(odd){background:#e9f7e9} .spot-Grass tbody tr:nth-child(even){background:#d9f0d9}\n'
      + '.spot-Sky tbody tr:nth-child(odd){background:#e8f4ff} .spot-Sky tbody tr:nth-child(even){background:#d9ecff}\n'
      + '.spot-Surf tbody tr:nth-child(odd){background:#e0ecff} .spot-Surf tbody tr:nth-child(even){background:#d0e3ff}\n'
      + '.spot-Fish tbody tr:nth-child(odd){background:#efe4ff} .spot-Fish tbody tr:nth-child(even){background:#e4d9ff}\n'
      + '.spot-Cave tbody tr:nth-child(odd){background:#f5eee5} .spot-Cave tbody tr:nth-child(even){background:#ede5dc}\n'
      + '</style>';

    if ((loc.notes||'').trim()) {
      buf += '<p class="resultsub">' + escapeHTML(loc.notes) + '</p>';
    }

    // Encounters
    var encounters = loc.encounters || [];
    if (encounters.length) {
      buf += '<div style="background:#e8f5e9;padding:12px;margin:8px 0;border-radius:4px">';
      buf += '<h3 style="margin-top:0;color:#2e7d32">Encounters</h3>';
      for (var s=0; s<encounters.length; s++) {
        var spot = encounters[s];
        if (!spot || !spot.pokemon || !spot.pokemon.length) continue;
        var range = (spot.levelRange && (spot.levelRange.min||spot.levelRange.max)) ? ' (Lv. ' + (spot.levelRange.min===spot.levelRange.max? spot.levelRange.min : (spot.levelRange.min+'-'+spot.levelRange.max)) + ')' : '';
        var spotName = escapeHTML(spot.spot || 'Spot');
        var spotClass = 'spot-' + (spot.spot || '').replace(/\s+/g,'');
        buf += '<h4 style="margin:6px 0 4px">' + spotName + range + '</h4>';
        buf += '<table class="utilitable ' + spotClass + '" style="width:100%;margin-bottom:8px">';
        buf += '<thead><tr><th style="width:80px;text-align:center">Chance</th><th style="text-align:left">Pokémon</th></tr></thead><tbody>';
        for (var p=0; p<spot.pokemon.length; p++) {
          var mon = spot.pokemon[p];
          // Apply dictionary translation to Pokemon name
          var translatedName = window.translateDisplayName(mon.name);
          var monID = toID(translatedName);
          var pokeData = BattlePokedex[monID];
          var displayName = pokeData ? pokeData.name : translatedName;
          
          buf += '<tr>';
          // Percent first
          buf += '<td style="text-align:center"><span class="chancepill">' + (mon.chance!=null? (mon.chance + '%') : '&mdash;') + '</span></td>';
          // Pokemon icon + name link with SOS on same line
          buf += '<td>'
            + '<a href="' + Config.baseurl + 'pokemon/' + monID + '" data-target="push" title="' + escapeHTML(displayName) + '">' 
            + '<span class="picon" style="' + getPokemonIcon(monID) + ';display:inline-block;vertical-align:middle;margin-right:6px"></span>'
            + escapeHTML(displayName)
            + '</a>';
          
          // Add SOS Pokemon on same line
          var sos = mon.sos || [];
          if (sos.length > 0) {
            buf += ' <span style="color:#999;font-size:0.9em">(SOS)</span> ';
            for (var k=0; k<sos.length; k++) {
              var child = sos[k];
              var childTranslated = window.translateDisplayName(child);
              var childID = toID(childTranslated);
              var childData = BattlePokedex[childID];
              var childDisplayName = childData ? childData.name : childTranslated;
              if (k > 0) buf += ', ';
              buf += '<a href="' + Config.baseurl + 'pokemon/' + childID + '" data-target="push" title="' + escapeHTML(childDisplayName) + '" style="font-size:0.9em">' 
                + '<span class="picon" style="' + getPokemonIcon(childID) + ';display:inline-block;vertical-align:middle;margin-right:4px"></span>'
                + escapeHTML(childDisplayName)
                + '</a>';
            }
          }
          
          buf += '</td>';
          buf += '</tr>';
        }
        buf += '</tbody></table>';
      }
      buf += '</div>'; // Close Encounters section
    }
    
    // Static Pokemon (pink section)
    if (loc.staticPokemon && loc.staticPokemon.length) {
      buf += '<div style="background:#fce4ec;padding:12px;margin:8px 0;border-radius:4px">';
      buf += '<h3 style="margin-top:0;color:#c2185b">Static Pokémon</h3>';
      buf += '<p class="resultsub">Static encounter details coming soon.</p>';
      buf += '</div>';
    }
    
    // Trainers
    function renderTrainerList(ids, isBoss) {
      if (!ids || !ids.length) return '';
      var out = '<ul class="utilichart nokbd" style="' + (isBoss ? 'background:#f5f0ff' : '') + '">';
      for (var i=0;i<ids.length;i++) {
        var tid = (ids[i]||'').trim();
        if (!tid) continue;
        var paddedTid = tid.padStart(3, '0');
        var t = (window.Trainers||[]).find(function(tx){ return tx.id === paddedTid; });
        var tname = t ? t.name : ('Trainer ' + tid);
        // Get extra notes from trainer-notes.json
        var tnotes = (window.TrainerNotes && window.TrainerNotes[paddedTid]) ? window.TrainerNotes[paddedTid].extraNotes : '';
        out += '<li class="result"><a href="' + Config.baseurl + 'trainers/' + paddedTid + '" data-target="push">';
        out += '<span class="col namecol">' + escapeHTML(tname);
        if (tnotes) {
          out += ' <span style="color:#777;font-size:0.85em">(' + escapeHTML(tnotes) + ')</span>';
        }
        out += '</span>';
        out += '</a></li>';
      }
      out += '</ul>';
      return out;
    }

    if (loc.trainers && loc.trainers.length) {
      buf += '<div style="background:#e3f2fd;padding:12px;margin:8px 0;border-radius:4px">';
      buf += '<h3 style="margin-top:0;color:#1565c0">Trainers</h3>' + renderTrainerList(loc.trainers, false);
      buf += '</div>';
    }
    if (loc.bossTrainers && loc.bossTrainers.length) {
      buf += '<div style="background:#e3f2fd;padding:12px;margin:8px 0;border-radius:4px">';
      buf += '<h3 style="margin-top:0;color:#7b4397">Boss Trainers</h3>' + renderTrainerList(loc.bossTrainers, true);
      buf += '</div>';
    }
    
    // Battles
    if (loc.battles && loc.battles.length) {
      buf += '<div style="background:#f5f5f5;padding:12px;margin:8px 0;border-radius:4px">';
      buf += '<h3 style="margin-top:0;color:#424242">Battles</h3>';
      buf += '<ul class="utilichart nokbd">';
      for (var bi = 0; bi < loc.battles.length; bi++) {
        var battle = loc.battles[bi];
        var battleID = battle.id;
        var battleTag = battle.tag;
        var battleNotes = battle.notes || '';
        
        // Get tag styling
        var tagConfig = (window.BattleTags && window.BattleTags[battleTag]) || {
          color: '#666',
          backgroundColor: '#f0f0f0',
          description: battleTag
        };
        
        // Determine if this is a trainer or static encounter
        var isStatic = battleID.match(/^[A-Za-z]/);
        var linkTarget = isStatic ? 'static-encounters' : 'trainers';
        
        // Get trainer/encounter name
        var battleName = '';
        var linkID = battleID;
        if (isStatic) {
          var staticEncounters = window.StaticEncounters || {};
          var staticEnc = staticEncounters[battleID];
          battleName = staticEnc ? staticEnc.name : ('Static Encounter ' + battleID);
        } else {
          // Pad trainer ID to 3 digits for lookup
          var paddedTrainerID = battleID.padStart(3, '0');
          var trainer = (window.Trainers || []).find(function(t) { return t.id === paddedTrainerID; });
          battleName = trainer ? trainer.name : ('Trainer ' + battleID);
          linkID = paddedTrainerID; // Use padded ID for the link
        }
        
        buf += '<li class="result"><a href="' + Config.baseurl + linkTarget + '/' + linkID + '" data-target="push">';
        buf += '<span class="col namecol">';
        
        // Add battle tag badge
        buf += '<span class="battle-tag" style="display:inline-block;padding:2px 8px;margin-right:8px;border-radius:12px;font-size:0.75em;font-weight:600;color:' + tagConfig.color + ';background-color:' + tagConfig.backgroundColor + ';cursor:help" title="' + escapeHTML(tagConfig.description) + '">';
        buf += escapeHTML(battleTag);
        buf += '</span>';
        
        // Battle name
        buf += escapeHTML(battleName);
        
        // Battle notes in lighter text
        if (battleNotes) {
          buf += ' <span style="color:#999;font-size:0.85em;font-weight:normal">' + escapeHTML(battleNotes) + '</span>';
        }
        
        buf += '</span>';
        buf += '</a></li>';
      }
      buf += '</ul>';
      buf += '</div>';
    }
    
    // Shop Tables (new format)
    if (loc.shopTables && loc.shopTables.length) {
      for (var sti = 0; sti < loc.shopTables.length; sti++) {
        var shopTableName = loc.shopTables[sti];
        var shopTable = (window.ShopTables && window.ShopTables[shopTableName]) || null;
        
        buf += '<div style="background:#fffde7;padding:12px;margin:8px 0;border-radius:4px">';
        buf += '<h3 style="margin-top:0;color:#f57f17">' + escapeHTML(shopTableName) + '</h3>';
        
        if (shopTable && shopTable.items && shopTable.items.length) {
          buf += '<table class="utilitable" style="width:100%;margin-bottom:8px">';
          buf += '<thead><tr><th style="width:28px"></th><th style="text-align:left">Item</th><th style="width:110px;text-align:center">Price</th></tr></thead><tbody>';
          
          for (var stii = 0; stii < shopTable.items.length; stii++) {
            var shopItem = shopTable.items[stii];
            var tmMatch = shopItem.item.match(/^TM\d+\s*\((.+)\)$/);
            var shopIcon = '';
            var linkTarget = '';
            var linkType = 'items';
            var itemID = '';
            var shopItemData = null;
            
            if (tmMatch) {
              // TM - use TM icon and link to move
              var moveName = tmMatch[1].trim();
              linkTarget = toID(moveName);
              linkType = 'moves';
              shopIcon = '<span class="itemicon" style="' + getItemIcon('tm-normal') + ';width:32px;height:32px;display:inline-block"></span>';
            } else if (shopItem.item === 'Poké Ball') {
              // Fix Poké Ball to use pokball ID (toID removes the accented e)
              itemID = 'pokball';
              linkTarget = 'pokball';
              shopItemData = BattleItems['pokball'];
              if (shopItemData) {
                shopIcon = '<span class="itemicon" style="' + getItemIcon(shopItemData) + ';width:32px;height:32px;display:inline-block"></span>';
              }
            } else {
              // Regular item
              itemID = toID(shopItem.item);
              linkTarget = itemID;
              shopItemData = BattleItems[itemID];
              if (shopItemData) {
                shopIcon = '<span class="itemicon" style="' + getItemIcon(shopItemData) + ';width:32px;height:32px;display:inline-block"></span>';
              }
            }
            
            buf += '<tr>';
            buf += '<td>' + shopIcon + '</td>';
            buf += '<td>';
            if (tmMatch || shopItemData) {
              buf += '<a href="' + Config.baseurl + linkType + '/' + linkTarget + '" data-target="push">' + escapeHTML(shopItem.item) + '</a>';
            } else {
              buf += escapeHTML(shopItem.item);
            }
            buf += '</td>';
            buf += '<td style="text-align:center">' + escapeHTML(shopItem.price || '') + '</td>';
            buf += '</tr>';
          }
          
          buf += '</tbody></table>';
        } else {
          buf += '<p class="resultsub" style="color:#999">Shop data not available. Please update shop-tables.json.</p>';
        }
        
        buf += '</div>';
      }
    }
    
    // Shops (legacy format)
    if (loc.shops && loc.shops.length) {
      buf += '<div style="background:#fffde7;padding:12px;margin:8px 0;border-radius:4px">';
      buf += '<h3 style="margin-top:0;color:#f57f17">Shops</h3>';
      buf += '<table class="utilitable" style="width:100%;margin-bottom:8px">';
      buf += '<thead><tr><th style="width:28px"></th><th style="text-align:left">Item</th><th style="width:110px;text-align:center">Price</th></tr></thead><tbody>';
      for (var si=0; si<loc.shops.length; si++) {
        var sh = loc.shops[si];
        // Check for TM format: "TM90 (Zen Headbutt)"
        var tmMatch = sh.item.match(/^TM\d+\s*\((.+)\)$/);
        var itemID = toID(sh.item);
        var shopItemData = BattleItems[itemID];
        var shopIcon = '';
        var linkTarget = itemID;
        var linkType = 'items';
        
        if (tmMatch) {
          // TM - use TM icon and link to move
          var moveName = tmMatch[1].trim();
          linkTarget = toID(moveName);
          linkType = 'moves';
          shopIcon = '<span class="itemicon" style="' + getItemIcon('tm-normal') + ';width:32px;height:32px;display:inline-block"></span>';
        } else if (sh.item === 'Poké Ball') {
          // Fix Poké Ball to use pokball ID (toID removes the accented e)
          itemID = 'pokball';
          linkTarget = 'pokball';
          shopItemData = BattleItems['pokball'];
          if (shopItemData) {
            shopIcon = '<span class="itemicon" style="' + getItemIcon(shopItemData) + ';width:32px;height:32px;display:inline-block"></span>';
          }
        } else if (shopItemData) {
          shopIcon = '<span class="itemicon" style="' + getItemIcon(shopItemData) + ';width:32px;height:32px;display:inline-block"></span>';
        }
        
        buf += '<tr>';
        buf += '<td>' + shopIcon + '</td>';
        buf += '<td>';
        if (tmMatch || shopItemData) {
          buf += '<a href="' + Config.baseurl + linkType + '/' + linkTarget + '" data-target="push">' + escapeHTML(sh.item) + '</a>';
        } else {
          buf += escapeHTML(sh.item);
        }
        buf += '</td>';
        buf += '<td style="text-align:center">' + escapeHTML(sh.price || '') + '</td>';
        buf += '</tr>';
      }
      buf += '</tbody></table>';
      buf += '</div>';
    }
    
    // Items (quantity own column)
    if (loc.items && loc.items.length) {
      buf += '<div style="background:#fff3e0;padding:12px;margin:8px 0;border-radius:4px">';
      buf += '<h3 style="margin-top:0;color:#e65100">Items</h3>';
      buf += '<table class="utilitable" style="width:100%;margin-bottom:8px">';
      buf += '<thead><tr><th style="width:28px"></th><th style="text-align:left">Item</th><th style="width:70px;text-align:center">Qty</th><th>Obtain</th></tr></thead><tbody>';
      for (var ii=0; ii<loc.items.length; ii++) {
        var it = loc.items[ii];
        // Check for TM format: "TM90 (Zen Headbutt)"
        var tmMatch = it.item.match(/^TM\d+\s*\((.+)\)$/);
        var iid = toID(it.item);
        var itemData = BattleItems[iid];
        var itemIcon = '';
        var linkTarget = iid;
        var linkType = 'items';
        
        // Check if item is money (starts with $)
        if (it.item && it.item.trim().startsWith('$')) {
          itemIcon = '<img src="' + ResourcePrefix + 'sprites/pokedollar_icon.png" style="width:32px;height:32px;display:inline-block" alt="Money" />';
        } else if (tmMatch) {
          // TM - use TM icon and link to move
          var moveName = tmMatch[1].trim();
          linkTarget = toID(moveName);
          linkType = 'moves';
          itemIcon = '<span class="itemicon" style="' + getItemIcon('tm-normal') + ';width:32px;height:32px;display:inline-block"></span>';
        } else if (it.item === 'Poké Ball') {
          // Fix Poké Ball to use pokball ID (toID removes the accented e)
          iid = 'pokball';
          linkTarget = 'pokball';
          itemData = BattleItems['pokball'];
          if (itemData) {
            itemIcon = '<span class="itemicon" style="' + getItemIcon(itemData) + ';width:32px;height:32px;display:inline-block"></span>';
          }
        } else if (itemData) {
          // Only show icon if item exists in data
          itemIcon = '<span class="itemicon" style="' + getItemIcon(itemData) + ';width:32px;height:32px;display:inline-block"></span>';
        }
        
        buf += '<tr>';
        buf += '<td>' + itemIcon + '</td>';
        buf += '<td>';
        if (tmMatch || itemData) {
          buf += '<a href="' + Config.baseurl + linkType + '/' + linkTarget + '" data-target="push">' + escapeHTML(it.item) + '</a>';
        } else {
          buf += escapeHTML(it.item);
        }
        buf += '</td>';
        buf += '<td style="text-align:center">' + (it.quantity != null ? it.quantity : 1) + '</td>';
        buf += '<td>' + escapeHTML(it.obtain || '') + '</td>';
        buf += '</tr>';
      }
      buf += '</tbody></table>';
      buf += '</div>';
    }

    buf += '</div>';
    this.html(buf);
  }
});
