const fs = require('fs');
const path = require('path');

// Read the raw items file
const rawPath = path.join(process.cwd(), 'data/rawtxt/Item.txt');
const outputPath = path.join(process.cwd(), 'data/items.json');

console.log('Reading Item.txt...');
const rawText = fs.readFileSync(rawPath, 'utf8');

const items = [];
const lines = rawText.split('\n');

let currentItem = null;
let currentDescription = [];
let inDescription = false;

function finalizeItem() {
  if (currentItem && currentItem.name) {
    // Join multi-line descriptions, remove newlines, and strip bracketed content
    if (currentDescription.length > 0) {
      currentItem.desc = currentDescription.join(' ')
        .replace(/\s+/g, ' ')
        .replace(/\[[^\]]*\]/g, '') // Remove anything in brackets
        .trim();
    }
    items.push(currentItem);
  }
}

for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();
  
  // Empty line signals end of current item
  if (line === '') {
    finalizeItem();
    currentItem = null;
    currentDescription = [];
    inDescription = false;
    continue;
  }
  
  if (line.startsWith('Item name:')) {
    // Start new item
    finalizeItem();
    const name = line.substring('Item name:'.length).trim();
    currentItem = {
      name: name,
      num: 0,
      desc: '',
      shortDesc: '',
      buyPrice: 0,
      sellPrice: 0
    };
    currentDescription = [];
    inDescription = false;
  } else if (line.startsWith('Item Index Number:')) {
    if (currentItem) {
      currentItem.num = parseInt(line.substring('Item Index Number:'.length).trim()) || 0;
    }
    inDescription = false;
  } else if (line.startsWith('Item Description:')) {
    // Description starts on next line(s)
    currentDescription = [];
    inDescription = true;
  } else if (line.startsWith('Item BuyPrice:')) {
    if (currentItem) {
      currentItem.buyPrice = parseInt(line.substring('Item BuyPrice:'.length).trim()) || 0;
    }
    inDescription = false;
  } else if (line.startsWith('Item SellPrice:')) {
    if (currentItem) {
      currentItem.sellPrice = parseInt(line.substring('Item SellPrice:'.length).trim()) || 0;
    }
    inDescription = false;
  } else {
    // Part of description - only add if we're in description mode
    if (currentItem && inDescription && !line.startsWith('Item ')) {
      currentDescription.push(line);
    }
  }
}

// Finalize last item
finalizeItem();

// Build the items object keyed by ID (lowercase, no spaces/special chars)
const itemsObj = {};
for (const item of items) {
  if (!item.name) continue;
  
  // Generate ID: lowercase, remove spaces and special chars
  const id = item.name.toLowerCase()
    .replace(/[^a-z0-9]+/g, '')
    .replace(/^[0-9]+/, ''); // remove leading numbers if any
  
  itemsObj[id] = item;
}

console.log(`Parsed ${items.length} items`);
console.log(`Writing to ${outputPath}...`);

fs.writeFileSync(outputPath, JSON.stringify(itemsObj, null, 2), 'utf8');

console.log('Done! Items written to data/items.json');
