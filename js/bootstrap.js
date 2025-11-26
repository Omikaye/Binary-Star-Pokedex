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

/**
 * Probes a URL using HEAD request to check if the resource exists.
 * Returns an object with { ok: boolean, status: number, url: string }
 */
async function probeUrl(url) {
  try {
    const res = await fetch(url, { method: 'HEAD' });
    return { ok: res.ok, status: res.status, url };
  } catch (err) {
    return { ok: false, status: 0, url, error: err.message };
  }
}

/**
 * Dynamically import a module with fallback to multiple locations.
 * Attempts imports in this order:
 *   1. Direct relative import: import(specifier)
 *   2. Absolute path using window.Config.baseurl: import(baseurl + specifier without ./)
 *   3. Absolute site-root path: import('/' + specifier without ./)
 *   4. Dist prefix path: import('./dist/' + specifier without ./)
 *
 * Uses HEAD probes before attempting import to avoid noisy import errors where possible.
 * Provides clear error messages with URLs tried and HTTP statuses.
 *
 * @param {string} specifier - The module specifier (e.g., './js/panels.js')
 * @returns {Promise<any>} - The imported module
 */
async function dynamicImportWithFallback(specifier) {
  const attempts = [];
  const specifierWithoutPrefix = specifier.replace(/^\.\//, '');

  // Build list of candidate URLs to try
  const candidates = [
    specifier, // 1. Direct relative import
  ];

  // 2. Absolute path using window.Config.baseurl
  if (window.Config && window.Config.baseurl) {
    candidates.push(window.Config.baseurl + specifierWithoutPrefix);
  }

  // 3. Absolute site-root path
  candidates.push('/' + specifierWithoutPrefix);

  // 4. Dist prefix path
  candidates.push('./dist/' + specifierWithoutPrefix);

  for (const url of candidates) {
    // First probe with HEAD to check if resource exists (avoid noisy import errors)
    const probe = await probeUrl(url);
    attempts.push(probe);

    if (probe.ok) {
      try {
        const mod = await import(url);
        console.info(`[bootstrap] Successfully imported: ${url}`);
        return mod;
      } catch (importErr) {
        // Import failed despite HEAD success (e.g., syntax error, CORS issue)
        attempts[attempts.length - 1].importError = importErr.message;
        console.warn(`[bootstrap] HEAD succeeded but import failed for ${url}:`, importErr.message);
      }
    } else {
      console.debug(`[bootstrap] HEAD probe failed for ${url}: status=${probe.status}`);
    }
  }

  // All attempts failed - build detailed error message
  const errorDetails = attempts.map(a => {
    let detail = `  - ${a.url}: HTTP ${a.status}`;
    if (a.error) detail += ` (fetch error: ${a.error})`;
    if (a.importError) detail += ` (import error: ${a.importError})`;
    return detail;
  }).join('\n');

  const err = new Error(
    `Failed to import module "${specifier}" from any location.\n` +
    `Attempted URLs and statuses:\n${errorDetails}`
  );
  err.attempts = attempts;
  throw err;
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
    // Use dynamicImportWithFallback for robustness across different deployment scenarios
    await dynamicImportWithFallback('./js/data.js');
    await dynamicImportWithFallback('./js/panels.js');
    await dynamicImportWithFallback('./js/search.js');
    await dynamicImportWithFallback('./js/pokedex.js');
    await dynamicImportWithFallback('./js/pokedex-pokemon.js');
    await dynamicImportWithFallback('./js/pokedex-moves.js');
    await dynamicImportWithFallback('./js/pokedex-search.js');
    await dynamicImportWithFallback('./js/router.js');

    console.info('[bootstrap] data loaded and app modules initialized.');
  } catch (err) {
    console.error('[bootstrap] Initialization error:', err);

    // Build detailed diagnostic message for the UI
    let diagnosticHtml = `<div style="padding: 20px; font-family: monospace;">
      <h2 style="color: #c00; margin-bottom: 10px;">Initialization Error</h2>
      <p style="color: #333; margin-bottom: 15px;"><strong>Error:</strong> ${escapeHtml(String(err.message || err))}</p>`;

    // If the error has attempt details (from dynamicImportWithFallback), show them
    if (err.attempts && Array.isArray(err.attempts)) {
      diagnosticHtml += `<div style="background: #f5f5f5; padding: 10px; border-radius: 4px; margin-bottom: 15px;">
        <strong>URLs attempted:</strong>
        <ul style="margin: 10px 0; padding-left: 20px;">`;
      for (const attempt of err.attempts) {
        const status = attempt.status === 0 ? 'Network error' : `HTTP ${attempt.status}`;
        const extra = attempt.importError ? ` - Import error: ${escapeHtml(attempt.importError)}` : '';
        const fetchErr = attempt.error ? ` - Fetch error: ${escapeHtml(attempt.error)}` : '';
        diagnosticHtml += `<li><code>${escapeHtml(attempt.url)}</code>: ${status}${fetchErr}${extra}</li>`;
      }
      diagnosticHtml += `</ul></div>`;
    }

    diagnosticHtml += `<div style="background: #fff3cd; padding: 10px; border-radius: 4px; border: 1px solid #ffc107;">
      <strong>Recommended fix:</strong> Ensure the site is deployed using the CI build workflow 
      which publishes the <code>./dist</code> directory to GitHub Pages. 
      See the repository README for deployment instructions.
    </div></div>`;

    const bodyEl = document.querySelector('.pfx-panel .pfx-body');
    if (bodyEl) {
      bodyEl.innerHTML = diagnosticHtml;
    }
  }
})();

/**
 * Escapes HTML special characters to prevent XSS
 * @param {string} str - The string to escape
 * @returns {string} - The escaped string
 */
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
