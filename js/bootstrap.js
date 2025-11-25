/**
 * Bootstrap loader for the Pokédex application.
 * 
 * This module fetches local JSON data files and attaches them to window globals,
 * then dynamically imports the application modules in the correct order.
 */

(async function bootstrap() {
  'use strict';

  const baseUrl = '/Binary-Star-Pokedex/';

  /**
   * Fetches a JSON file and returns the parsed object.
   * @param {string} path - Path relative to baseUrl
   * @param {boolean} optional - If true, returns empty object on failure
   * @returns {Promise<object>}
   */
  async function fetchJSON(path, optional = false) {
    try {
      const response = await fetch(baseUrl + path);
      if (!response.ok) {
        if (optional) {
          console.warn(`[bootstrap] Optional file not found: ${path}`);
          return {};
        }
        throw new Error(`Failed to fetch ${path}: ${response.status} ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      if (optional) {
        console.warn(`[bootstrap] Optional file error: ${path}`, error);
        return {};
      }
      throw error;
    }
  }

  /**
   * Sanitizes loaded data by removing external PokemonShowdown URLs (except images).
   */
  function sanitizeExternalDataUrls() {
    const psUrlPattern = /(https?:)?\/\/[^\s]*pokemonshowdown[^\s]*/i;
    const imagePattern = /\.(png|jpe?g|gif|svg)(\?|$)/i;
    const spritePathPattern = /\/(sprites|images)\//i;

    let sanitizedCount = 0;

    function isExternalDataUrl(value) {
      if (typeof value !== 'string') return false;
      if (!psUrlPattern.test(value)) return false;
      if (imagePattern.test(value) || spritePathPattern.test(value)) return false;
      return true;
    }

    function sanitizeObject(obj) {
      if (obj === null || obj === undefined) return;
      if (typeof obj !== 'object') return;

      if (Array.isArray(obj)) {
        for (let i = 0; i < obj.length; i++) {
          if (isExternalDataUrl(obj[i])) {
            obj[i] = null;
            sanitizedCount++;
          } else if (typeof obj[i] === 'object') {
            sanitizeObject(obj[i]);
          }
        }
      } else {
        for (const key in obj) {
          if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;
          const value = obj[key];
          if (isExternalDataUrl(value)) {
            obj[key] = null;
            sanitizedCount++;
          } else if (typeof value === 'object') {
            sanitizeObject(value);
          }
        }
      }
    }

    const dataObjects = [
      window.BattlePokedex,
      window.BattleMovedex,
      window.BattleItems,
      window.BattleAbilities,
      window.BattleTypeChart,
      window.Learnsets,
      window.BaseGameStats,
      window.ItemPokemonLinks,
      window.Icons,
    ];

    for (const obj of dataObjects) {
      sanitizeObject(obj);
    }

    if (sanitizedCount > 0) {
      console.info(`[bootstrap] Sanitized ${sanitizedCount} external Pokemon Showdown data URL(s) from loaded data.`);
    }
  }

  try {
    console.log('[bootstrap] Loading data files...');

    // Fetch all JSON data files in parallel
    const [
      Config,
      BattlePokedex,
      BattleMovedex,
      BattleItems,
      BattleAbilities,
      BattleTypeChart,
      Learnsets,
      Icons,
      BaseGameStats,
      ItemPokemonLinks
    ] = await Promise.all([
      fetchJSON('data/config.json'),
      fetchJSON('data/pokedex.json'),
      fetchJSON('data/moves.json'),
      fetchJSON('data/items.json'),
      fetchJSON('data/abilities.json'),
      fetchJSON('data/typechart.json'),
      fetchJSON('data/learnsets.json'),
      fetchJSON('data/icons.json'),
      fetchJSON('data/basegame.json', true),
      fetchJSON('data/item-pokemon-links.json', true)
    ]);

    // Attach data to window globals
    window.Config = Config;
    window.ResourcePrefix = (Config.baseurl || baseUrl) + 'images/';
    window.BattlePokedex = BattlePokedex;
    window.BattleMovedex = BattleMovedex;
    window.BattleItems = BattleItems;
    window.BattleAbilities = BattleAbilities;
    window.BattleTypeChart = BattleTypeChart;
    window.Learnsets = Learnsets;
    window.Icons = Icons;
    window.BaseGameStats = BaseGameStats;
    window.ItemPokemonLinks = ItemPokemonLinks;

    // Sanitize external URLs from loaded data
    sanitizeExternalDataUrls();

    console.log('[bootstrap] Data loaded, initializing app modules...');

    // Import application modules in order
    // panels.js sets up jQuery, underscore, Backbone globals
    await import('./panels.js');
    
    // data.js sets up helper functions (toID, getID, etc.)
    await import('./data.js');
    
    // search.js depends on data.js
    await import('./search.js');
    
    // pokedex.js depends on search.js
    await import('./pokedex.js');
    
    // pokedex-pokemon.js depends on pokedex.js
    await import('./pokedex-pokemon.js');
    
    // pokedex-moves.js depends on pokedex.js
    await import('./pokedex-moves.js');
    
    // pokedex-search.js depends on pokedex.js
    await import('./pokedex-search.js');
    
    // router.js initializes the app
    await import('./router.js');

    console.log('[bootstrap] Data loaded and app modules initialized.');

  } catch (error) {
    console.error('[bootstrap] Initialization error:', error);
    
    // Display error to user instead of infinite loading
    const body = document.querySelector('.pfx-body');
    if (body) {
      body.innerHTML = `
        <div class="error" style="padding: 20px; color: #c00;">
          <h2>Initialization Error</h2>
          <p>Failed to load the Pokédex application.</p>
          <pre style="background: #f5f5f5; padding: 10px; overflow: auto;">${escapeErrorHTML(error.message || String(error))}</pre>
          <p>Please check the browser console for more details.</p>
        </div>
      `;
    }
  }

  function escapeErrorHTML(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
})();
