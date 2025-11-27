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

// Create array of items sorted by index number
const itemArray = Object.entries(items)
  .map(([id, data]) => ({ id, num: data.num }))
  .sort((a, b) => a.num - b.num);

console.log(`Processing ${itemArray.length} items...`);

// Generate new coordinates with exceptions
const newItemCoords = {};

// Helper to detect TM/HM items
const isTMHM = (id) => /^tm\d{1,2}$/.test(id) || /^hm\d{1,2}$/.test(id);
// Fixed icon to use for all TM/HM items
const TMHM_ICON = [-133, -364];

let row = 0;
let col = 0;
let startedNormal = false; // set start to (-694, -364) when needed
let seenHM06 = false; // flip when we encounter hm06; next non-TM/HM (Explorer Kit) sets start

// Precompute the grid coordinate for any (row,col)
const coordAt = (r, c) => [-(BORDER + c * PITCH), -(BORDER + r * PITCH)];

for (let i = 0; i < itemArray.length; i++) {
  const { id } = itemArray[i];

  if (isTMHM(id)) {
    // Assign fixed TM/HM icon but DON'T advance grid (next item gets this slot)
    newItemCoords[id] = TMHM_ICON;
    if (id === 'hm06') seenHM06 = true;
    continue;
  }

  // If we've just passed HM06, set next non-TM/HM (Explorer Kit) to start at (-694, -364)
  if (seenHM06 && !startedNormal) {
    row = 11; // 1 + row*33 = 364 => row = 11
    col = 21; // 1 + col*33 = 694 => col = 21
    startedNormal = true;
  }

  // Current grid coordinate
  const [gx, gy] = coordAt(row, col);

  // Normal assignment
  newItemCoords[id] = [gx, gy];

  // Advance grid position unless this item is thick club (uses rare bone icon and should not consume slot)
  if (id !== 'thickclub') {
    col++;
    if (col >= COLUMNS) { col = 0; row++; }
  }
}

// If both items exist, set thickclub to use rarebone's icon
if (newItemCoords['thickclub'] && newItemCoords['rarebone']) {
  newItemCoords['thickclub'] = newItemCoords['rarebone'];
}

// Update icons.json with new item coordinates
icons.items = newItemCoords;

console.log('Writing updated icons.json...');
fs.writeFileSync(iconsPath, JSON.stringify(icons, null, 2), 'utf8');

console.log(`Done! Updated ${Object.keys(newItemCoords).length} item icon coordinates.`);
console.log(`Spritesheet grid: ${COLUMNS} columns × ${Math.ceil(itemArray.length / COLUMNS)} rows`);
console.log(`Using offset ${BORDER}px and pitch ${PITCH}px (per axis).`);
