// Locations panels: list and detail
window.PokedexLocationsPanel = PokedexResultPanel.extend({
  initialize: function () {
    this.shortTitle = 'Locations';
    var buf = '<div class="pfx-body dexentry">';
    buf += '<a href="' + Config.baseurl + '" class="pfx-backbutton" data-target="back"><i class="fa fa-chevron-left"></i> Pokédex</a>';
    buf += '<h1><a href="' + Config.baseurl + 'locations/" data-target="push" class="subtle">Locations</a></h1>';

    buf += '<ul class="utilichart nokbd">';
    var list = (window.Locations || []).slice();
    list.sort(function(a,b){ return (a.name||'').localeCompare(b.name||''); });
    for (var i=0; i<list.length; i++) {
      var loc = list[i];
      if (!loc || !loc.id) continue;
      buf += '<li class="result">';
      buf += '<a href="' + Config.baseurl + 'locations/' + loc.id + '" data-target="push">';
      buf += '<span class="col namecol">' + escapeHTML(loc.name || loc.id) + '</span> ';
      var notes = (loc.notes||'').trim();
      if (notes) {
        buf += '<span class="col abilitydesccol">' + escapeHTML(notes) + '</span>';
      }
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
        buf += '<h4 style="margin:6px 0 4px">' + escapeHTML(spot.spot || 'Spot') + range + '</h4>';
        buf += '<table class="utilitable" style="width:100%;margin-bottom:8px">';
        buf += '<thead><tr><th style="text-align:left">Pokémon</th><th style="width:60px">Chance</th></tr></thead><tbody>';
        for (var p=0; p<spot.pokemon.length; p++) {
          var mon = spot.pokemon[p];
          var monID = toID(mon.name);
          buf += '<tr>';
          buf += '<td>' + '<span class="picon" style="' + getPokemonIcon(monID) + ';display:inline-block;vertical-align:middle;margin-right:6px"></span>' + escapeHTML(mon.name) + '</td>';
          buf += '<td style="text-align:center">' + (mon.chance!=null? (mon.chance + '%') : '&mdash;') + '</td>';
          buf += '</tr>';
          // SOS children rows
          var sos = mon.sos || [];
          for (var k=0; k<sos.length; k++) {
            var child = sos[k];
            var childID = toID(child);
            buf += '<tr>';
            buf += '<td style="padding-left:28px">' + '<span class="picon" style="' + getPokemonIcon(childID) + ';display:inline-block;vertical-align:middle;margin-right:6px"></span>' + escapeHTML(child) + '</td>';
            buf += '<td style="text-align:center">SOS</td>';
            buf += '</tr>';
          }
        }
        buf += '</tbody></table>';
      }
    }

    // Gifts/Trades
    if ((loc.giftsTrades||'').trim() && (loc.giftsTrades.toLowerCase() !== 'none')) {
      buf += '<h3>Gifts / Trades</h3>';
      buf += '<p>' + escapeHTML(loc.giftsTrades) + '</p>';
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
      buf += '<thead><tr><th style="width:28px"></th><th style="text-align:left">Item</th><th style="width:110px">Price</th></tr></thead><tbody>';
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

    buf += '</div>';
    this.html(buf);
  }
});
