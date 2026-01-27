const fs = require('fs');
const path = require('path');

/**
 * Generate pokemon icons from pokemonspriteiconorder.txt
 * 
 * The sprite sheet layout:
 * - Each row contains 12 pokemon sprites
 * - Each column is -40px wide
 * - Each row is -30px tall
 * - Starts at (0, 0) with "Unknown"
 * - "None" entries are blank spaces that still count toward positioning
 * 
 * So for pokemon at index N (0-based):
 *   columns_per_row = 12
 *   col = N % columns_per_row
 *   row = floor(N / columns_per_row)
 *   x = col * (-40)
 *   y = row * (-30)
 */

const COLUMNS_PER_ROW = 12;
const COL_WIDTH = -40;
const ROW_HEIGHT = -30;

// Read the pokemon sprite icon order
const iconOrderPath = path.join(process.cwd(), 'data/rawtxt/pokemonspriteiconorder.txt');
if (!fs.existsSync(iconOrderPath)) {
  console.error(`ERROR: ${iconOrderPath} not found`);
  process.exit(1);
}

const iconOrderText = fs.readFileSync(iconOrderPath, 'utf8');
const pokemonOrder = iconOrderText
  .trim()
  .split('\n')
  .map(line => line.trim())
  .filter(line => line.length > 0);

console.log(`Read ${pokemonOrder.length} pokemon from pokemonspriteiconorder.txt`);

// Read the Dictionary.cs for name mappings
const dictionaryPath = path.join(process.cwd(), 'data/rawtxt/Dictionary.cs');
const dictionaryText = fs.readFileSync(dictionaryPath, 'utf8');

// Parse Dictionary.cs to build name mappings
// Format: { "Key", "Value" }
const nameMappings = {};
const dictionaryRegex = /{\s*"([^"]+)"\s*,\s*"([^"]+)"\s*}/g;
let match;
while ((match = dictionaryRegex.exec(dictionaryText)) !== null) {
  const key = toID(match[1]);
  const value = toID(match[2]);
  nameMappings[key] = value;
}

console.log(`Parsed ${Object.keys(nameMappings).length} name mappings from Dictionary.cs`);

// Read existing icons.json to preserve item icons
const iconsPath = path.join(process.cwd(), 'data/icons.json');
let existingIcons = { pokemon: {}, items: {} };
if (fs.existsSync(iconsPath)) {
  existingIcons = JSON.parse(fs.readFileSync(iconsPath, 'utf8'));
}

// Build pokemon icons from the sprite order
const icons = {
  pokemon: {},
  items: existingIcons.items || {}
};

for (let index = 0; index < pokemonOrder.length; index++) {
  const pokemonName = pokemonOrder[index];
  
  // Skip "None" entries - they are blank spaces in the sprite sheet
  // but we still count them for positioning
  if (pokemonName === "None") {
    continue;
  }
  
  // Handle entries with multiple pokemon (comma-separated)
  // e.g., "Gumshoos, Gumshoos-Megamax" should add both
  const pokemonList = pokemonName.split(',').map(name => name.trim());
  
  // Calculate sprite position based on the index
  const col = index % COLUMNS_PER_ROW;
  const row = Math.floor(index / COLUMNS_PER_ROW);
  const x = col * COL_WIDTH;
  const y = row * ROW_HEIGHT;
  
  // Add all pokemon variants at this position
  for (const pname of pokemonList) {
    const pokemonId = toID(pname);
    icons.pokemon[pokemonId] = [x, y];
    
    // Also check if there's a mapped name from Dictionary.cs
    // For example, dictionary entries might map form variants to base names
    for (const [dictKey, dictValue] of Object.entries(nameMappings)) {
      if (dictValue === pokemonId) {
        // Store the dictionary key mapping as well, if not already present
        if (!icons.pokemon[dictKey]) {
          icons.pokemon[dictKey] = [x, y];
        }
      }
    }
  }
}

// Write the updated icons.json
fs.writeFileSync(iconsPath, JSON.stringify(icons, undefined, 2));
console.log(`Successfully wrote ${Object.keys(icons.pokemon).length} pokemon icons to icons.json`);
console.log(`Item icons preserved: ${Object.keys(icons.items).length}`);

/**
 * Convert text to ID format (lowercase, no special characters except hyphens)
 */
function toID(text) {
  if (typeof text !== 'string' && typeof text !== 'number') return '';
  return ('' + text).toLowerCase().replace(/[^a-z0-9]+/g, '');
}
