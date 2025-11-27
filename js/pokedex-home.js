// Homepage panel
window.PokedexHomePanel = PokedexResultPanel.extend({
  initialize: function () {
    this.shortTitle = 'Home';
    var buf = '<div class="pfx-body dexentry">';
    buf += '<h1>Pokémon Binary Star</h1>';
    buf += '<p class="resultsub">A comprehensive Pokédex for the Pokémon Binary Star ROM hack by Omikaye</p>';

    buf += '<div style="max-width:800px;margin:20px auto;line-height:1.6">';
    
    buf += '<h2>About the ROM Hack</h2>';
    buf += '<p>Pokémon Binary Star is a custom ROM hack featuring new adventures, expanded Pokédex entries, custom encounters, and a reimagined region. Explore new locations, battle unique trainers, and discover custom mechanics!</p>';

    buf += '<h2>About This Site</h2>';
    buf += '<p>This Pokédex is a static, client-side reference tool built to help players navigate Binary Star. Features include:</p>';
    buf += '<ul style="padding-left:40px">';
    buf += '<li>Complete Pokémon data with stats, abilities, moves, and learnsets</li>';
    buf += '<li>Move and ability details with distribution lists</li>';
    buf += '<li>Trainer rosters with full team details</li>';
    buf += '<li>Location guides with encounter tables, items, shops, and trainers</li>';
    buf += '<li>Item database with descriptions and Pokémon associations</li>';
    buf += '</ul>';

    buf += '<h2>Quick Links</h2>';
    buf += '<div style="display:flex;gap:12px;flex-wrap:wrap;margin:16px 0">';
    buf += '<a href="' + Config.baseurl + 'dex" class="button" style="padding:12px 20px;background:#3572b0;color:white;text-decoration:none;border-radius:4px">Browse Pokédex</a>';
    buf += '<a href="' + Config.baseurl + 'locations/" class="button" style="padding:12px 20px;background:#68a968;color:white;text-decoration:none;border-radius:4px">Explore Locations</a>';
    buf += '<a href="' + Config.baseurl + 'trainers/" class="button" style="padding:12px 20px;background:#c9515c;color:white;text-decoration:none;border-radius:4px">View Trainers</a>';
    buf += '<a href="' + Config.baseurl + 'moves/" class="button" style="padding:12px 20px;background:#aa9038;color:white;text-decoration:none;border-radius:4px">Search Moves</a>';
    buf += '</div>';

    buf += '<p style="margin-top:24px;color:#777;font-size:0.95em">Data generated from <code>@pkmn/*</code> packages. Site source available on <a href="https://github.com/Strackeror/Static-Showdown-Dex">GitHub</a>.</p>';
    
    buf += '</div>';

    buf += '</div>';
    this.html(buf);
  }
});
