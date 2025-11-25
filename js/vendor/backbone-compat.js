// js/vendor/backbone-compat.js
// Provides an ESM-compatible export for Backbone by loading the UMD script
// and exporting window.Backbone. Uses top-level await so consumers can import it.

function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      // already inserted; wait for it to load if necessary
      // Assume it's loaded if present, otherwise still resolve (best-effort)
      return resolve();
    }
    const s = document.createElement('script');
    s.src = src;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error('Failed to load ' + src));
    document.head.appendChild(s);
  });
}

const backboneUmdUrl = 'https://unpkg.com/backbone@1.6.0/backbone-min.js';

// If Backbone is already present, just export it.
if (!window.Backbone) {
  await loadScript(backboneUmdUrl);
  if (!window.Backbone) {
    throw new Error('Backbone failed to initialize after loading UMD script');
  }
}

export default window.Backbone;
export const Backbone = window.Backbone;
