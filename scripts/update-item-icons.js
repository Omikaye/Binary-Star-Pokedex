const fs = require('fs');
const path = require('path');

// Read items.json and icons.json
const itemsPath = path.join(process.cwd(), 'data/items.json');
const iconsPath = path.join(process.cwd(), 'data/icons.json');

console.log('Reading items.json...');
const items = JSON.parse(fs.readFileSync(itemsPath, 'utf8'));

console.log('Reading icons.json...');
const icons = JSON.parse(fs.readFileSync(iconsPath, 'utf8'));

// Spritesheet configuration
const SPRITE_SIZE = 32; // 32x32px per sprite
const BORDER = 1; // 1px blue border around each sprite cell
const PITCH = SPRITE_SIZE + BORDER; // distance between sprite starts (33px)
const COLUMNS = 28; // 28 columns in the spritesheet


// New system: prepare to accept icon order from IconOrder.txt
// Each line in IconOrder.txt is the icon index (1-based) for the corresponding item in items.json (sorted by index)

// Example usage:
// 1. User provides IconOrder.txt with icon indices, one per line, matching the item order
// 2. For each item, assign the coordinate for that icon index

// Precompute all possible icon coordinates (1-based)
const iconCoords = [];
for (let i = 0; i < 896; i++) { // 28 cols * 32 rows = 896
  const row = Math.floor(i / COLUMNS);
  const col = i % COLUMNS;
  iconCoords.push([-(BORDER + col * PITCH), -(BORDER + row * PITCH)]);
}

// Prepare item order (sorted by item index)
const itemArray = Object.entries(items)
  .map(([id, data]) => ({ id, num: data.num }))
  .sort((a, b) => a.num - b.num);

console.log(`Prepared ${itemArray.length} items for icon assignment.`);
console.log(`Ready to accept icon order from IconOrder.txt.`);

// To finish: read IconOrder.txt, assign iconCoords[iconIndex-1] to each item in order, and write to icons.json
// (This step will be performed after you provide IconOrder.txt)
