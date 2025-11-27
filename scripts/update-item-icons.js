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
const COLUMNS = 28; // 28 columns in the spritesheet

// Create array of items sorted by index number
const itemArray = Object.entries(items)
  .map(([id, data]) => ({ id, num: data.num }))
  .sort((a, b) => a.num - b.num);

console.log(`Processing ${itemArray.length} items...`);

// Generate new coordinates
const newItemCoords = {};
itemArray.forEach((item, index) => {
  const row = Math.floor(index / COLUMNS);
  const col = index % COLUMNS;
  
  // Calculate x and y offsets (negative because CSS background-position)
  const x = -(col * SPRITE_SIZE);
  const y = -(row * SPRITE_SIZE);
  
  newItemCoords[item.id] = [x, y];
});

// Update icons.json with new item coordinates
icons.items = newItemCoords;

console.log('Writing updated icons.json...');
fs.writeFileSync(iconsPath, JSON.stringify(icons, null, 2), 'utf8');

console.log(`Done! Updated ${Object.keys(newItemCoords).length} item icon coordinates.`);
console.log(`Spritesheet dimensions: ${COLUMNS} columns × ${Math.ceil(itemArray.length / COLUMNS)} rows`);
console.log(`Total size: ${COLUMNS * SPRITE_SIZE}px × ${Math.ceil(itemArray.length / COLUMNS) * SPRITE_SIZE}px`);
