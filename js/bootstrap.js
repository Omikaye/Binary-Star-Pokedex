// js/bootstrap.js
// Imports jQuery and Underscore (via importmap), sets globals, then loads backbone UMD, then loads data and app modules.

// js/bootstrap.js (top)
import $ from 'jquery';
import _ from 'underscore';
import Backbone from 'backbone'; // resolves to /js/vendor/backbone-compat.js

// expose legacy globals
window.$ = window.jQuery = $;
window._ = _;
window.Backbone = Backbone;

// Helper: dynamically load a script and await it
function loadScript(src) {
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = (e) => reject(new Error(`Failed to load script ${src}`));
    document.head.appendChild(s);
  });
}

async function ensureBackbone() {
  // If Backbone is already present (e.g., dist/bundled), do nothing.
  if (window.Backbone) return;
  // Load UMD build of Backbone which expects window._ and window.jQuery
  // You can change the CDN URL if you prefer jsDelivr/unpkg/other
  const backboneUrl = 'https://unpkg.com/backbone@1.6.0/backbone-min.js';
  await loadScript(backboneUrl);
  if (!window.Backbone) {
    throw new Error('Backbone failed to initialize after loading UMD script');
  }
}

function loadJSON(path) {
  return fetch(path).then((res) => {
    if (!res.ok) throw new Error(`Failed to load ${path}: ${res.status}`);
    return res.json();
  });
}

(async function init() {
  try {
    // Ensure backbone global exists (UMD script reads window._ and window.jQuery)
    await ensureBackbone();
    // Now we can fetch JSON data
    const [
      BattlePokedex,
      BattleMovedex,
      BattleItems,
      BattleAbilities,
      BattleTypeChart,
      Learnsets,
      Icons,
      Config,
      BaseGameStats,
      ItemPokemonLinks,
    ] = await Promise.all([
      loadJSON('data/pokedex.json'),
      loadJSON('data/moves.json'),
      loadJSON('data/items.json'),
      loadJSON('data/abilities.json'),
      loadJSON('data/typechart.json'),
      loadJSON('data/learnsets.json'),
      loadJSON('data/icons.json'),
      loadJSON('data/config.json').catch(() => ({ baseurl: '/Binary-Star-Pokedex/' })),
      loadJSON('data/basegame.json').catch(() => ({})),
      loadJSON('data/item-pokemon-links.json').catch(() => ({})),
    ]);

    // Attach to window exactly as the app expects.
    window.Config = Config || { baseurl: '/Binary-Star-Pokedex/' };
    window.ResourcePrefix = window.Config.baseurl + 'images/';

    window.BattlePokedex = BattlePokedex || {};
    window.BattleMovedex = BattleMovedex || {};
    window.BattleItems = BattleItems || {};
    window.BattleAbilities = BattleAbilities || {};
    window.BattleTypeChart = BattleTypeChart || {};
    window.Learnsets = Learnsets || {};
    window.BaseGameStats = BaseGameStats || {};
    window.ItemPokemonLinks = ItemPokemonLinks || {};
    window.Icons = Icons || {};

    // Now import the data initializer (which expects window.*) and the app modules
    await import('./data.js');
    await import('./panels.js');
    await import('./search.js');
    await import('./pokedex.js');
    await import('./pokedex-pokemon.js');
    await import('./pokedex-moves.js');
    await import('./pokedex-search.js');
    await import('./router.js');

    console.info('[bootstrap] data loaded and app modules initialized.');
  } catch (err) {
    console.error('[bootstrap] Initialization error:', err);
    const bodyEl = document.querySelector('.pfx-panel .pfx-body');
    if (bodyEl) bodyEl.innerHTML = `<p style="color:red;">Initialization error: ${String(err.message || err)}</p>`;
  }
})();
