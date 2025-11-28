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

// Read IconOrder.txt
const iconOrderPath = path.join(process.cwd(), 'data/rawtxt/IconOrder.txt');
console.log('Reading IconOrder.txt...');
const iconOrderText = fs.readFileSync(iconOrderPath, 'utf8');
const iconOrder = iconOrderText.trim().split('\n').map(line => parseInt(line.trim(), 10));

console.log(`Read ${iconOrder.length} icon indices from IconOrder.txt.`);

// Use the minimum of iconOrder length and itemArray length (ignore extras)
const numToProcess = Math.min(iconOrder.length, itemArray.length);
if (iconOrder.length < itemArray.length) {
  console.warn(`WARNING: IconOrder.txt has only ${iconOrder.length} entries, but we have ${itemArray.length} items. Missing items will use default coordinates.`);
} else if (iconOrder.length > itemArray.length) {
  console.log(`Note: IconOrder.txt has ${iconOrder.length} entries, but we only have ${itemArray.length} items. Extra entries will be ignored.`);
}

// Assign icons to items based on the order
const newItemCoords = {};
for (let i = 0; i < numToProcess; i++) {
  const item = itemArray[i];
  const iconIndex = iconOrder[i];
  
  if (iconIndex < 1 || iconIndex > iconCoords.length) {
    console.error(`ERROR: Invalid icon index ${iconIndex} for item ${item.id} (line ${i + 1} in IconOrder.txt)`);
    process.exit(1);
  }
  
  // Assign the coordinate for this icon index (1-based)
  newItemCoords[item.id] = iconCoords[iconIndex - 1];
}

// If there are items without icon assignments, give them default coordinates
for (let i = numToProcess; i < itemArray.length; i++) {
  const item = itemArray[i];
  newItemCoords[item.id] = [0, 0]; // Default to first icon
}

// Update icons.json with new item coordinates
icons.items = newItemCoords;

console.log('Writing updated icons.json...');
fs.writeFileSync(iconsPath, JSON.stringify(icons, null, 2), 'utf8');

console.log(`Done! Updated ${Object.keys(newItemCoords).length} item icon coordinates.`);
console.log(`Using offset ${BORDER}px and pitch ${PITCH}px (per axis).`);
