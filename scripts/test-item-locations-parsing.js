// Test script for table-based ItemLocations parsing
// This tests the parsing logic for multiple tables in one sheet

const fs = require('fs');

function toID(text) {
  return String(text || '').toLowerCase().replace(/[^a-z0-9]+/g, '');
}

// Sample CSV data matching the table-based format
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

// Run tests
console.log('Testing table-based ItemLocations parsing...\n');

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
console.log('\n--- Generated Output ---');
console.log(JSON.stringify(itemLocationMap, null, 2));

console.log('\n--- Test Summary ---');
if (allTestsPassed) {
  console.log('✓ All tests passed!');
  process.exit(0);
} else {
  console.error('✗ Some tests failed');
  process.exit(1);
}
