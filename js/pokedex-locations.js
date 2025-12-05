// Locations panels: list and detail
window.PokedexLocationsPanel = PokedexResultPanel.extend({
  initialize: function () {
    this.shortTitle = 'Locations';
    var buf = '<div class="pfx-body dexentry">';
    buf += '<a href="' + Config.baseurl + '" class="pfx-backbutton" data-target="back"><i class="fa fa-chevron-left"></i> Pokédex</a>';
    buf += '<h1><a href="' + Config.baseurl + 'locations/" data-target="push" class="subtle">Locations</a></h1>';

    buf += '<ul class="utilichart nokbd">';
    var list = (window.Locations || []).slice();
    // Don't sort - keep original order from JSON (which is the index order)
    for (var i=0; i<list.length; i++) {
      var loc = list[i];
      if (!loc || !loc.id) continue;
      var notes = (loc.notes||'').trim();
      buf += '<li class="result">';
      buf += '<a href="' + Config.baseurl + 'locations/' + loc.id + '" data-target="push">';
      buf += '<span class="col numcol">' + (i+1) + '</span>';
      buf += '<span class="col namecol">' + escapeHTML(loc.name || loc.id) + '</span> ';
      if (notes) buf += '<span class="col abilitydesccol">' + escapeHTML(notes) + '</span>';
      buf += '</a></li>';
    }
    buf += '</ul>';

    buf += '</div>';
    this.html(buf);
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
      buf += '<h3>Encounters</h3>';
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
          var displayName = mon.name;
          var monID = toID(mon.name);
          // Check if Pokemon exists in dex, if not try to get translated name
          var pokeData = BattlePokedex[monID];
          if (pokeData) {
            displayName = pokeData.name;
          }
          
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
              var childID = toID(child);
              var childData = BattlePokedex[childID];
              var childDisplayName = childData ? childData.name : child;
              if (k > 0) buf += ', ';
              buf += '<a href="' + Config.baseurl + 'pokemon/' + childID + '" data-target="push" title="' + escapeHTML(childDisplayName) + '" style="font-size:0.9em">' 
                + escapeHTML(childDisplayName)
                + '</a>';
            }
          }
          
          buf += '</td>';
          buf += '</tr>';
        }
    // Trainers
    function renderTrainerList(ids, isBoss) {
      if (!ids || !ids.length) return '';
      var out = '<ul class="utilichart nokbd" style="' + (isBoss ? 'background:#f5f0ff' : '') + '">';
      for (var i=0;i<ids.length;i++) {
        var tid = (ids[i]||'').trim();
        if (!tid) continue;
        var t = (window.Trainers||[]).find(function(tx){ return tx.id === tid; });
        var tname = t ? t.name : ('Trainer ' + tid);
        // Get extra notes from trainer-notes.json
        var tnotes = (window.TrainerNotes && window.TrainerNotes[tid]) ? window.TrainerNotes[tid].extraNotes : '';
        out += '<li class="result"><a href="' + Config.baseurl + 'trainers/' + tid + '" data-target="push">';
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
      buf += '<h3>Trainers</h3>' + renderTrainerList(loc.trainers, false);
    }
    if (loc.bossTrainers && loc.bossTrainers.length) {
      buf += '<h3 style="color:#7b4397">Boss Trainers</h3>' + renderTrainerList(loc.bossTrainers, true);
    } }
      out += '</ul>';
      return out;
    }

    if (loc.trainers && loc.trainers.length) {
    // Shops
    if (loc.shops && loc.shops.length) {
      buf += '<h3>Shops</h3>';
      buf += '<table class="utilitable" style="width:100%;margin-bottom:8px">';
      buf += '<thead><tr><th style="width:28px"></th><th style="text-align:left">Item</th><th style="width:110px;text-align:center">Price</th></tr></thead><tbody>';
      for (var si=0; si<loc.shops.length; si++) {
        var sh = loc.shops[si];
        var itemID = toID(sh.item);
        var shopItemData = BattleItems[itemID];
        var shopIcon = '';
        
        if (shopItemData) {
          shopIcon = '<span class="itemicon" style="' + getItemIcon(shopItemData) + ';width:32px;height:32px;display:inline-block"></span>';
        }
        
        buf += '<tr>';
        buf += '<td>' + shopIcon + '</td>';
        buf += '<td>';
        if (shopItemData) {
          buf += '<a href="' + Config.baseurl + 'items/' + itemID + '" data-target="push">' + escapeHTML(sh.item) + '</a>';
        } else {
          buf += escapeHTML(sh.item);
        }
        buf += '</td>';
        buf += '<td style="text-align:center">' + escapeHTML(sh.price || '') + '</td>';
        buf += '</tr>';
      }
      buf += '</tbody></table>';
    }   buf += '<td>' + '<span class="picon" style="' + getItemIcon(itemID) + ';display:inline-block;width:32px;height:32px"></span>' + '</td>';
        buf += '<td>' + '<a href="' + Config.baseurl + 'items/' + itemID + '" data-target="push">' + escapeHTML(sh.item) + '</a>' + '</td>';
    // Items (quantity own column)
    if (loc.items && loc.items.length) {
      buf += '<h3>Items</h3>';
      buf += '<table class="utilitable" style="width:100%;margin-bottom:8px">';
      buf += '<thead><tr><th style="width:28px"></th><th style="text-align:left">Item</th><th style="width:70px;text-align:center">Qty</th><th>Obtain</th></tr></thead><tbody>';
      for (var ii=0; ii<loc.items.length; ii++) {
        var it = loc.items[ii];
        var iid = toID(it.item);
        var itemData = BattleItems[iid];
        var itemIcon = '';
        
        // Check if item is money (starts with $)
        if (it.item && it.item.trim().startsWith('$')) {
          itemIcon = '<img src="' + ResourcePrefix + 'sprites/pokedollar_icon.png" style="width:32px;height:32px;display:inline-block" alt="Money" />';
        } else if (itemData) {
          // Only show icon if item exists in data
          itemIcon = '<span class="itemicon" style="' + getItemIcon(itemData) + ';width:32px;height:32px;display:inline-block"></span>';
        }
        
        buf += '<tr>';
        buf += '<td>' + itemIcon + '</td>';
        buf += '<td>';
        if (itemData) {
          buf += '<a href="' + Config.baseurl + 'items/' + iid + '" data-target="push">' + escapeHTML(it.item) + '</a>';
        } else {
          buf += escapeHTML(it.item);
        }
        buf += '</td>';
        buf += '<td style="text-align:center">' + (it.quantity != null ? it.quantity : 1) + '</td>';
        buf += '<td>' + escapeHTML(it.obtain || '') + '</td>';
        buf += '</tr>';
      }
      buf += '</tbody></table>';
    }   buf += '<td>' + '<a href="' + Config.baseurl + 'items/' + iid + '" data-target="push">' + escapeHTML(it.item) + '</a>' + '</td>';
        buf += '<td style="text-align:center">' + (it.quantity != null ? it.quantity : 1) + '</td>';
        buf += '<td>' + escapeHTML(it.obtain || '') + '</td>';
        buf += '</tr>';
      }
      buf += '</tbody></table>';
    }

    // Static encounters placeholder (future)
    if (loc.staticPokemon && loc.staticPokemon.length) {
      buf += '<h3>Static Pokémon</h3>';
      buf += '<p class="resultsub">Static encounter details coming soon.</p>';
    }

    buf += '</div>';
    this.html(buf);
  }
});
