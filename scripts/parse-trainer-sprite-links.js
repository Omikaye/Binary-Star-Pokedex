const fs = require('fs');
const path = require('path');

// Parse trainerspritelinks.txt and convert to JSON
const inputFile = path.join(__dirname, '../images/sprites/trainersprites/trainerspritelinks.txt');
const outputFile = path.join(__dirname, '../data/trainer-sprite-links.json');

const content = fs.readFileSync(inputFile, 'utf8');
// Normalize line endings and trim
const lines = content.replace(/\r/g, '').split('\n').map(l => l.trim()).filter(line => line && !line.startsWith('#'));

const spriteLinks = {};

// Helper function to convert to ID format (lowercase, no special chars)
function toID(text) {
  if (typeof text !== "string" && typeof text !== "number") return "";
  return ("" + text).toLowerCase().replace(/[^a-z0-9]+/g, "");
}

for (const line of lines) {
  // Split on the first ':' to allow URLs with additional ':'
  const idx = line.indexOf(':');
  if (idx <= 0) continue;
  let name = line.slice(0, idx).trim();
  const url = line.slice(idx + 1).trim();
  if (!name || !url) continue;
  
  // Strip "(Name)" prefix if present
  if (name.startsWith('(Name)')) {
    name = name.replace(/^\(Name\)\s*/, '').trim();
  }
  
  const id = toID(name);
  spriteLinks[id] = url;
}

// Write to JSON file
fs.writeFileSync(outputFile, JSON.stringify(spriteLinks, null, 2));
console.log(`Parsed ${Object.keys(spriteLinks).length} trainer sprite links to ${outputFile}`);
