const fs = require('fs');
const path = require('path');

// Parse trainerspritelinks.txt and convert to JSON
const inputFile = path.join(__dirname, '../images/sprites/trainersprites/trainerspritelinks.txt');
const outputFile = path.join(__dirname, '../data/trainer-sprite-links.json');

const content = fs.readFileSync(inputFile, 'utf8');
const lines = content.split('\n').filter(line => line.trim());

const spriteLinks = {};

// Helper function to convert to ID format (lowercase, no special chars)
function toID(text) {
  if (typeof text !== "string" && typeof text !== "number") return "";
  return ("" + text).toLowerCase().replace(/[^a-z0-9]+/g, "");
}

for (const line of lines) {
  const match = line.match(/^(.+?):\s*(.+)$/);
  if (match) {
    const name = match[1].trim();
    const url = match[2].trim();
    const id = toID(name);
    spriteLinks[id] = url;
  }
}

// Write to JSON file
fs.writeFileSync(outputFile, JSON.stringify(spriteLinks, null, 2));
console.log(`Parsed ${Object.keys(spriteLinks).length} trainer sprite links to ${outputFile}`);
