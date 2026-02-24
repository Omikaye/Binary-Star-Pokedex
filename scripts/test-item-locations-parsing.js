// Test script for table-based ItemLocations parsing
// This tests the parsing logic for multiple tables in one sheet

const fs = require('fs');

function toID(text) {
  return String(text || '').toLowerCase().replace(/[^a-z0-9]+/g, '');
}

// Sample CSV data matching the vertical table-based format
const SAMPLE_CSV = `Route 1
Item,Num,Method
Poké Ball,10,From Kukui after the capture tutorial
Potion,5,From Kukui after the capture tutorial
Miracle Medicine,1,North of the grass patch next to the Trainer Tips sign.

Iki Town
Item,Num,Method
Town Map,1,From Hau
Potion,3,From Mom

Route 2
Item,Quantity,How to Obtain
Revive,1,On ground
Rare Candy,2,Behind rock
Super Potion,5,From NPC in Pokemon Center`;

// Sample CSV data matching the horizontal 3-column layout (new format)
// Two location tables side by side: Route 3 (cols 0-2) and Melemele Meadow (cols 3-5)
const SAMPLE_CSV_HORIZONTAL = `Route 3,,,Melemele Meadow,,
Item,Num,Method,Item,Num,Method
Repel,3,On ground,Honey,2,Behind rock
Super Repel,1,From NPC,Max Repel,1,Gift from trainer
Antidote,5,From shop,,`;

function parseCSV(csvText) {
  const rows = [];
  const lines = csvText.split(/\r?\n/);
  
  for (const line of lines) {
    if (!line.trim()) {
      rows.push([]); // Empty row - signals end of current table for boundary detection
      continue;
    }
    
    const fields = [];
    let currentField = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      const nextChar = line[i + 1];
      
      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          currentField += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        fields.push(currentField);
        currentField = '';
      } else {
        currentField += char;
      }
    }
    fields.push(currentField);
    rows.push(fields);
  }
  
  return rows;
}

function parseTableBasedItemLocations(rows) {
  const locationItems = {};
  let currentLocation = null;
  let headerFound = false;
  let itemColumnIndex = -1;
  let numColumnIndex = -1;
  let methodColumnIndex = -1;
  
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    
    // Skip completely empty rows
    if (row.every(cell => !cell || cell.trim() === '')) {
      if (currentLocation) {
        headerFound = false;
      }
      continue;
    }
    
    // Check if this is a header row
    const rowText = row.map(c => (c || '').toLowerCase().trim());
    const hasItem = rowText.some(c => c.includes('item'));
    const hasNum = rowText.some(c => c.includes('num') || c.includes('quantity') || c.includes('qty'));
    const hasMethod = rowText.some(c => c.includes('method') || c.includes('obtain') || c.includes('how'));
    
    if (hasItem && hasNum && hasMethod) {
      headerFound = true;
      
      itemColumnIndex = rowText.findIndex(c => c.includes('item'));
      numColumnIndex = rowText.findIndex(c => c.includes('num') || c.includes('quantity') || c.includes('qty'));
      methodColumnIndex = rowText.findIndex(c => c.includes('method') || c.includes('obtain') || c.includes('how'));
      
      continue;
    }
    
    // Data row
    if (headerFound && currentLocation && itemColumnIndex >= 0) {
      const itemName = row[itemColumnIndex] ? row[itemColumnIndex].trim() : '';
      const numStr = row[numColumnIndex] ? row[numColumnIndex].trim() : '1';
      const method = row[methodColumnIndex] ? row[methodColumnIndex].trim() : '';
      
      if (itemName) {
        let quantity = 1;
        const numMatch = numStr.match(/(\d+)/);
        if (numMatch) {
          quantity = parseInt(numMatch[1], 10);
        }
        
        locationItems[currentLocation].push({
          item: itemName,
          quantity: quantity,
          obtain: method
        });
      }
      continue;
    }
    
    // Table name (location name)
    const firstCell = row[0] ? row[0].trim() : '';
    if (firstCell && !headerFound) {
      const locationName = firstCell;
      const locationId = toID(locationName);
      currentLocation = locationId;
      
      if (!locationItems[locationId]) {
        locationItems[locationId] = [];
      }
      
      headerFound = false;
    }
  }
  
  return locationItems;
}

function parseHorizontalItemLocations(rows) {
  // Parse horizontal format: tables side by side, each exactly 3 columns wide.
  // Row 0: location names at col 0, col 3, col 6, ...
  // Row 1: repeated header: Item, Num/Qty, Method/Obtain per block
  // Rows 2+: data rows; empty Item cell = no entry for that row in that block
  
  if (rows.length < 3) return {};
  
  // Detection: row 1 must have "item" at col 0 AND "item" at col 3 (≥2 blocks)
  const headerRow = rows[1] || [];
  const h = headerRow.map(c => (c || '').toLowerCase().trim());
  
  if (h.length < 4) return {};
  const col0Item = h[0].includes('item');
  const col1Num = h[1].includes('num') || h[1].includes('qty') || h[1].includes('quantity');
  const col2Method = h[2].includes('method') || h[2].includes('obtain') || h[2].includes('how');
  const col3Item = h[3].includes('item');
  
  if (!col0Item || !col1Num || !col2Method || !col3Item) return {};
  
  const nameRow = rows[0] || [];
  const numCols = Math.max(nameRow.length, headerRow.length);
  const numBlocks = Math.floor(numCols / 3);
  
  const locationItems = {};
  
  for (let block = 0; block < numBlocks; block++) {
    const colOffset = block * 3;
    const locationName = nameRow[colOffset] ? nameRow[colOffset].trim() : '';
    
    if (!locationName) continue;
    
    const locationId = toID(locationName);
    locationItems[locationId] = [];
    
    const itemCol = colOffset;
    const numCol = colOffset + 1;
    const methodCol = colOffset + 2;
    
    for (let r = 2; r < rows.length; r++) {
      const row = rows[r];
      const itemName = row[itemCol] ? row[itemCol].trim() : '';
      
      if (!itemName) continue;
      
      const numStr = row[numCol] ? row[numCol].trim() : '1';
      const method = row[methodCol] ? row[methodCol].trim() : '';
      
      let quantity = 1;
      const numMatch = numStr.match(/(\d+)/);
      if (numMatch) {
        quantity = parseInt(numMatch[1], 10);
      }
      
      locationItems[locationId].push({
        item: itemName,
        quantity: quantity,
        obtain: method
      });
    }
  }
  
  return locationItems;
}

function convertSheetToItemLocations(rows) {
  const horizontal = parseHorizontalItemLocations(rows);
  if (Object.keys(horizontal).length > 0) {
    console.log('Detected horizontal format');
    return horizontal;
  }
  console.log('Using vertical table-based format');
  return parseTableBasedItemLocations(rows);
}

// Run tests
console.log('=== Testing Vertical Table-Based ItemLocations Parsing ===\n');

const rows = parseCSV(SAMPLE_CSV);
console.log(`✓ Parsed ${rows.length} rows from CSV`);

const itemLocationMap = parseTableBasedItemLocations(rows);
const locationCount = Object.keys(itemLocationMap).length;
console.log(`✓ Found items for ${locationCount} locations\n`);

// Verify results
let allTestsPassed = true;

// Test 1: Correct number of locations
if (locationCount !== 3) {
  console.error(`✗ Expected 3 locations, got ${locationCount}`);
  allTestsPassed = false;
} else {
  console.log('✓ Correct number of locations (3)');
}

// Test 2: Location IDs
const expectedIds = ['route1', 'ikitown', 'route2'];
const actualIds = Object.keys(itemLocationMap).sort();
if (JSON.stringify(actualIds) !== JSON.stringify(expectedIds.sort())) {
  console.error(`✗ Location IDs mismatch. Expected: ${expectedIds}, Got: ${actualIds}`);
  allTestsPassed = false;
} else {
  console.log('✓ Location IDs correct');
}

// Test 3: Route 1 items
const route1Items = itemLocationMap['route1'];
if (!route1Items) {
  console.error('✗ Route 1 not found');
  allTestsPassed = false;
} else {
  if (route1Items.length !== 3) {
    console.error(`✗ Route 1: Expected 3 items, got ${route1Items.length}`);
    allTestsPassed = false;
  } else {
    console.log('✓ Route 1 has correct number of items (3)');
  }
  
  const pokeBall = route1Items.find(i => i.item === 'Poké Ball');
  if (!pokeBall || pokeBall.quantity !== 10) {
    console.error('✗ Route 1: Poké Ball quantity incorrect');
    allTestsPassed = false;
  } else {
    console.log('✓ Route 1 Poké Ball quantity correct (10)');
  }
  
  const miracleMedicine = route1Items.find(i => i.item === 'Miracle Medicine');
  if (!miracleMedicine || miracleMedicine.quantity !== 1) {
    console.error('✗ Route 1: Miracle Medicine not found or quantity wrong');
    allTestsPassed = false;
  } else {
    console.log('✓ Route 1 Miracle Medicine found with correct quantity');
  }
}

// Test 4: Iki Town items
const ikiTownItems = itemLocationMap['ikitown'];
if (!ikiTownItems) {
  console.error('✗ Iki Town not found');
  allTestsPassed = false;
} else {
  if (ikiTownItems.length !== 2) {
    console.error(`✗ Iki Town: Expected 2 items, got ${ikiTownItems.length}`);
    allTestsPassed = false;
  } else {
    console.log('✓ Iki Town has correct number of items (2)');
  }
}

// Test 5: Route 2 with alternative column names (Quantity, How to Obtain)
const route2Items = itemLocationMap['route2'];
if (!route2Items) {
  console.error('✗ Route 2 not found');
  allTestsPassed = false;
} else {
  if (route2Items.length !== 3) {
    console.error(`✗ Route 2: Expected 3 items, got ${route2Items.length}`);
    allTestsPassed = false;
  } else {
    console.log('✓ Route 2 has correct number of items (3)');
  }
  
  const rareCandy = route2Items.find(i => i.item === 'Rare Candy');
  if (!rareCandy || rareCandy.quantity !== 2) {
    console.error(`✗ Route 2: Rare Candy quantity incorrect (expected 2, got ${rareCandy ? rareCandy.quantity : 'not found'})`);
    allTestsPassed = false;
  } else {
    console.log('✓ Route 2 Rare Candy quantity correct (2)');
  }
  
  const superPotion = route2Items.find(i => i.item === 'Super Potion');
  if (!superPotion || !superPotion.obtain.includes('NPC')) {
    console.error('✗ Route 2: Super Potion obtain text incorrect');
    allTestsPassed = false;
  } else {
    console.log('✓ Route 2 Super Potion obtain text correct');
  }
}

// Print full output for inspection
console.log('\n--- Vertical Format Output ---');
console.log(JSON.stringify(itemLocationMap, null, 2));

// ============================================================
console.log('\n=== Testing Horizontal 3-Column ItemLocations Parsing ===\n');

const rowsH = parseCSV(SAMPLE_CSV_HORIZONTAL);
console.log(`✓ Parsed ${rowsH.length} rows from horizontal CSV`);

const itemMapH = convertSheetToItemLocations(rowsH);
const locationCountH = Object.keys(itemMapH).length;
console.log(`✓ Found items for ${locationCountH} locations\n`);

// Test H1: Correct number of locations (2)
if (locationCountH !== 2) {
  console.error(`✗ Expected 2 locations, got ${locationCountH}`);
  allTestsPassed = false;
} else {
  console.log('✓ Correct number of locations (2)');
}

// Test H2: Location IDs
const expectedHIds = ['melemelemeadow', 'route3'].sort();
const actualHIds = Object.keys(itemMapH).sort();
if (JSON.stringify(actualHIds) !== JSON.stringify(expectedHIds)) {
  console.error(`✗ Location IDs mismatch. Expected: ${expectedHIds}, Got: ${actualHIds}`);
  allTestsPassed = false;
} else {
  console.log('✓ Location IDs correct (route3, melemelemeadow)');
}

// Test H3: Route 3 items (3 items)
const route3Items = itemMapH['route3'];
if (!route3Items) {
  console.error('✗ Route 3 not found');
  allTestsPassed = false;
} else {
  if (route3Items.length !== 3) {
    console.error(`✗ Route 3: Expected 3 items, got ${route3Items.length}`);
    allTestsPassed = false;
  } else {
    console.log('✓ Route 3 has correct number of items (3)');
  }
  
  const repel = route3Items.find(i => i.item === 'Repel');
  if (!repel || repel.quantity !== 3) {
    console.error(`✗ Route 3: Repel quantity incorrect (expected 3, got ${repel ? repel.quantity : 'not found'})`);
    allTestsPassed = false;
  } else {
    console.log('✓ Route 3 Repel quantity correct (3)');
  }
}

// Test H4: Melemele Meadow items (2 items — last row empty for that block)
const meadowItems = itemMapH['melemelemeadow'];
if (!meadowItems) {
  console.error('✗ Melemele Meadow not found');
  allTestsPassed = false;
} else {
  if (meadowItems.length !== 2) {
    console.error(`✗ Melemele Meadow: Expected 2 items, got ${meadowItems.length}`);
    allTestsPassed = false;
  } else {
    console.log('✓ Melemele Meadow has correct number of items (2)');
  }
  
  const honey = meadowItems.find(i => i.item === 'Honey');
  if (!honey || honey.obtain !== 'Behind rock') {
    console.error('✗ Melemele Meadow: Honey obtain text incorrect');
    allTestsPassed = false;
  } else {
    console.log('✓ Melemele Meadow Honey obtain text correct');
  }
}

console.log('\n--- Horizontal Format Output ---');
console.log(JSON.stringify(itemMapH, null, 2));

console.log('\n--- Test Summary ---');
if (allTestsPassed) {
  console.log('✓ All tests passed!');
  process.exit(0);
} else {
  console.error('✗ Some tests failed');
  process.exit(1);
}
