// Locations panels: list and detail
window.PokedexLocationsPanel = PokedexResultPanel.extend({
  initialize: function () {
    this.shortTitle = 'Locations';
    var buf = '<div class="pfx-body">';
    buf += '<h1 class="subtle">Locations</h1>';

    // Lightweight CSS tweaks for table clarity and collapsibles
    buf += '<style>\n'
      + '.loc-toggle{display:block;cursor:pointer} .loc-details{display:none;margin:6px 0 10px}\n'
      + '.loc-open .loc-details{display:block}\n'
      + '.utilitable th, .utilitable td{border-bottom:1px solid #ddd;padding:6px 8px} .utilitable thead th{border-bottom:2px solid #bbb}\n'
      + '.chancepill{display:inline-block;min-width:42px;text-align:center;background:#f2f2f2;border:1px solid #ddd;border-radius:10px;padding:2px 6px;margin-right:8px;color:#444}\n'
      + '.sos-row td{background:#fafafa} .spot-title{margin:6px 0 4px;font-weight:600}\n'
      + '</style>';

    buf += '<ul class="utilichart nokbd">';
    var list = (window.Locations || []).slice();
    list.sort(function(a,b){ return (a.name||'').localeCompare(b.name||''); });
    for (var i=0; i<list.length; i++) {
      var loc = list[i];
      if (!loc || !loc.id) continue;
      var notes = (loc.notes||'').trim();
      var rowId = 'loc_' + toID(loc.id);
      buf += '<li class="result loc-row" id="' + rowId + '">';
      // Toggle header behaves like a normal search row
      buf += '<a class="loc-toggle" onclick="var p=this.parentNode; p.classList.toggle(\'loc-open\'); return false;">';
      buf += '<span class="col namecol">' + escapeHTML(loc.name || loc.id) + '</span>';
      if (notes) buf += '<span class="col abilitydesccol">' + escapeHTML(notes) + '</span>';
      buf += '</a>';

      // Details (encounters, trainers, shops, items)
      buf += '<div class="loc-details">';

      // Encounters
      var encounters = loc.encounters || [];
      if (encounters.length) {
        buf += '<h3>Encounters</h3>';
        for (var s=0; s<encounters.length; s++) {
          var spot = encounters[s];
          if (!spot || !spot.pokemon || !spot.pokemon.length) continue;
          var range = (spot.levelRange && (spot.levelRange.min||spot.levelRange.max)) ? ' (Lv. ' + (spot.levelRange.min===spot.levelRange.max? spot.levelRange.min : (spot.levelRange.min+'-'+spot.levelRange.max)) + ')' : '';
          buf += '<div class="spot-title">' + escapeHTML(spot.spot || 'Spot') + range + '</div>';
          buf += '<table class="utilitable" style="width:100%;margin-bottom:8px">';
          buf += '<thead><tr><th style="width:80px;text-align:center">Chance</th><th style="text-align:left">Pokémon</th></tr></thead><tbody>';
          for (var p=0; p<spot.pokemon.length; p++) {
            var mon = spot.pokemon[p];
            var monID = toID(mon.name);
            buf += '<tr>';
            // Percent first
            buf += '<td style="text-align:center"><span class="chancepill">' + (mon.chance!=null? (mon.chance + '%') : '&mdash;') + '</span></td>';
            // Pokemon icon + name link
            buf += '<td>'
              + '<a href="' + Config.baseurl + 'pokemon/' + monID + '" data-target="push" title="' + escapeHTML(mon.name) + '">' 
              + '<span class="picon" style="' + getPokemonIcon(monID) + ';display:inline-block;vertical-align:middle;margin-right:6px"></span>'
              + escapeHTML(mon.name)
              + '</a>'
              + '</td>';
            buf += '</tr>';
            // SOS children rows
            var sos = mon.sos || [];
            for (var k=0; k<sos.length; k++) {
              var child = sos[k];
              var childID = toID(child);
              buf += '<tr class="sos-row">';
              buf += '<td style="text-align:center"><span class="chancepill">SOS</span></td>';
              buf += '<td style="padding-left:28px">'
                + '<a href="' + Config.baseurl + 'pokemon/' + childID + '" data-target="push" title="' + escapeHTML(child) + '">' 
                + '<span class="picon" style="' + getPokemonIcon(childID) + ';display:inline-block;vertical-align:middle;margin-right:6px"></span>'
                + escapeHTML(child)
                + '</a>'
                + '</td>';
              buf += '</tr>';
            }
          }
          buf += '</tbody></table>';
        }
      }

      // Trainers
      function renderTrainerList(ids) {
        if (!ids || !ids.length) return '';
        var out = '<ul class="utilichart nokbd">';
        for (var i=0;i<ids.length;i++) {
          var tid = (ids[i]||'').trim();
          if (!tid) continue;
          var t = (window.Trainers||[]).find(function(tx){ return tx.id === tid; });
          var tname = t ? t.name : ('Trainer ' + tid);
          out += '<li class="result"><a href="' + Config.baseurl + 'trainers/' + tid + '" data-target="push">';
          out += '<span class="col namecol">' + escapeHTML(tname) + '</span>';
          out += '</a></li>';
        }
        out += '</ul>';
        return out;
      }

      if (loc.trainers && loc.trainers.length) {
        buf += '<h3>Trainers</h3>' + renderTrainerList(loc.trainers);
      }
      if (loc.bossTrainers && loc.bossTrainers.length) {
        buf += '<h3>Boss Trainers</h3>' + renderTrainerList(loc.bossTrainers);
      }

      // Shops
      if (loc.shops && loc.shops.length) {
        buf += '<h3>Shops</h3>';
        buf += '<table class="utilitable" style="width:100%;margin-bottom:8px">';
        buf += '<thead><tr><th style="width:28px"></th><th style="text-align:left">Item</th><th style="width:110px;text-align:center">Price</th></tr></thead><tbody>';
        for (var si=0; si<loc.shops.length; si++) {
          var sh = loc.shops[si];
          var itemID = toID(sh.item);
          buf += '<tr>';
          buf += '<td>' + '<span class="picon" style="' + getItemIcon(itemID) + ';display:inline-block;width:24px;height:24px"></span>' + '</td>';
          buf += '<td>' + '<a href="' + Config.baseurl + 'items/' + itemID + '" data-target="push">' + escapeHTML(sh.item) + '</a>' + '</td>';
          buf += '<td style="text-align:center">' + escapeHTML(sh.price || '') + '</td>';
          buf += '</tr>';
        }
        buf += '</tbody></table>';
      }

      // Items
      if (loc.items && loc.items.length) {
        buf += '<h3>Items</h3>';
        buf += '<table class="utilitable" style="width:100%;margin-bottom:8px">';
        buf += '<thead><tr><th style="width:28px"></th><th style="text-align:left">Item</th><th>Obtain</th></tr></thead><tbody>';
        for (var ii=0; ii<loc.items.length; ii++) {
          var it = loc.items[ii];
          var iid = toID(it.item);
          var label = escapeHTML(it.item) + (it.quantity && it.quantity !== 1 ? ' ×' + it.quantity : '');
          buf += '<tr>';
          buf += '<td>' + '<span class="picon" style="' + getItemIcon(iid) + ';display:inline-block;width:24px;height:24px"></span>' + '</td>';
          buf += '<td>' + '<a href="' + Config.baseurl + 'items/' + iid + '" data-target="push">' + label + '</a>' + '</td>';
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

      buf += '</div>'; // end details
      buf += '</li>';
    }
    buf += '</ul>';

    buf += '</div>';
    this.html(buf);
  }
});

// Detail panel not needed anymore; locations expand inline in list
window.PokedexLocationPanel = PokedexResultPanel.extend({
  initialize: function () {
    this.shortTitle = 'Locations';
    this.html('<div class="pfx-body"><h1 class="subtle">Locations</h1><p class="resultsub">Use the Locations list to expand details.</p></div>');
  }
});
