// Compatibility helpers for legacy UI code
// This file is imported early (from `js/data.js`) to ensure small
// globals expected by legacy modules are present.

if (typeof window !== 'undefined') {
  if (typeof window.escapeHTML !== 'function') {
    window.escapeHTML = function (str, jsEscapeToo) {
      str = String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
      if (jsEscapeToo) str = str.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
      return str;
    };
  }
}
