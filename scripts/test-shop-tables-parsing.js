// Test script for shop tables parsing
// This tests the parsing logic without requiring network access

const fs = require('fs');
const path = require('path');

// Sample CSV data for column-based format (legacy)
const SAMPLE_CSV_COLUMN = `"Pokémart Basic","Boutique Hau'oli","Battle Items Shop"
"Poké Ball - $200","Silk Scarf - $1000","X Attack - $500"
"Potion - $200","Muscle Band - $1000","X Defense - $550"
"Antidote - $200","Wise Glasses - $1000","X Speed - $350"
"Paralyze Heal - $200","Choice Band - $4000","X Sp. Atk - $350"
"Awakening - $100","","X Sp. Def - $350"`;

// Sample CSV data for table-based format (new format matching problem statement)
const SAMPLE_CSV_TABLE = `Route 1
Item,Cost
Move Deleter,Free
Smoke Ball,$1120
Cleanse Tag,$770
Sticky Barb,$1800

Route 2
Item,Price
Potion,$200
Super Potion,$700
Revive,$2000`;

function parseCSV(csvText) {
  const rows = [];
  const lines = csvText.split(/\r?\n/);
  
  for (const line of lines) {
    // Keep empty lines for table-based format
    if (!line.trim()) {
      rows.push([]);
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

function parseShopItem(str) {
  if (!str || str.trim().toLowerCase() === 'none') return null;
  
  const match = str.match(/^(.+?)\s*-\s*(.+)$/);
  if (!match) return null;
  
  return {
    item: match[1].trim(),
    price: match[2].trim()
  };
}

// Sample CSV data for horizontal 2-column layout (new format)
// Two shop tables side by side: Pokemart (cols 0-1) and Boutique (cols 2-3)
const SAMPLE_CSV_HORIZONTAL = `Pokemart Hau'oli,,Boutique Hau'oli,
Item,Cost,Item,Cost
Poké Ball,$200,Silk Scarf,$1000
Potion,$200,Muscle Band,$1000
Antidote,$200,Wise Glasses,$1000
,,Choice Band,$4000`;

function parseHorizontalShopTables(rows) {
  // Parse horizontal format: tables side by side, each exactly 2 columns wide.
  // Row 0: shop names at col 0, col 2, col 4, ...
  // Row 1: repeated header: Item, Cost/Price per block
  // Rows 2+: data rows; empty Item cell = no entry for that row in that block
  
  if (rows.length < 3) return {};
  
  // Detection: row 1 must have "item" at col 0 AND "item" at col 2 (≥2 blocks)
  const headerRow = rows[1] || [];
  const h = headerRow.map(c => (c || '').toLowerCase().trim());
  
  if (h.length < 4) return {};
  const col0Item = h[0] === 'item' || h[0].includes('item');
  const col1Price = h[1] === 'cost' || h[1] === 'price' || h[1].includes('cost') || h[1].includes('price');
  const col2Item = h[2] === 'item' || h[2].includes('item');
  
  if (!col0Item || !col1Price || !col2Item) return {};
  
  console.log('Detected horizontal shop tables format');
  
  const nameRow = rows[0] || [];
  const numCols = Math.max(nameRow.length, headerRow.length);
  const numBlocks = Math.floor(numCols / 2);
  
  const shopTables = {};
  
  for (let block = 0; block < numBlocks; block++) {
    const colOffset = block * 2;
    const shopName = nameRow[colOffset] ? nameRow[colOffset].trim() : '';
    
    if (!shopName) continue;
    
    shopTables[shopName] = {
      name: shopName,
      items: []
    };
    
    const itemCol = colOffset;
    const priceCol = colOffset + 1;
    
    for (let r = 2; r < rows.length; r++) {
      const row = rows[r];
      const itemName = row[itemCol] ? row[itemCol].trim() : '';
      
      if (!itemName) continue;
      
      const priceStr = row[priceCol] ? row[priceCol].trim() : '';
      
      shopTables[shopName].items.push({
        item: itemName,
        price: priceStr
      });
    }
  }
  
  return shopTables;
}

function parseTableBasedShopTables(rows) {
  // Parse table-based format where each table starts with a shop/location name,
  // followed by header row (Item, Cost/Price),
  // followed by data rows with items
  
  const shopTables = {};
  let currentShop = null;
  let headerFound = false;
  let itemColumnIndex = -1;
  let priceColumnIndex = -1;
  
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    
    // Skip completely empty rows
    if (row.every(cell => !cell || cell.trim() === '')) {
      if (currentShop) {
        headerFound = false;
      }
      continue;
    }
    
    // Check if this is a header row (contains "Item" and "Cost"/"Price")
    const rowText = row.map(c => (c || '').toLowerCase().trim());
    const hasItem = rowText.some(c => c === 'item');
    const hasPrice = rowText.some(c => c === 'cost' || c === 'price');
    
    if (hasItem && hasPrice) {
      // This is a header row
      headerFound = true;
      
      // Find column indices
      itemColumnIndex = rowText.findIndex(c => c === 'item');
      priceColumnIndex = rowText.findIndex(c => c === 'cost' || c === 'price');
      
      continue;
    }
    
    // If we have a header and current shop, this is a data row
    if (headerFound && currentShop && itemColumnIndex >= 0) {
      const itemName = row[itemColumnIndex] ? row[itemColumnIndex].trim() : '';
      const priceStr = row[priceColumnIndex] ? row[priceColumnIndex].trim() : '';
      
      if (itemName && priceStr) {
        shopTables[currentShop].items.push({
          item: itemName,
          price: priceStr
        });
      }
      continue;
    }
    
    // Otherwise, check if this row is a table name (shop/location name)
    // In table-based format, the table name is in the first cell;
    // adjacent cells may be empty or carry labels derived from the shop name
    // (e.g. "Pokemart Cost"), but must not be unrelated shop names (column format).
    const firstCell = row[0] ? row[0].trim() : '';
    const firstCellHasDash = firstCell.includes(' - ');
    // Accept adjacent cells that are empty OR that start with the shop name
    const otherCellsEmptyOrLabel = row.slice(1).every(c => {
      const val = (c || '').trim();
      return val === '' || val.toLowerCase().startsWith(firstCell.toLowerCase());
    });
    
    if (firstCell && otherCellsEmptyOrLabel && !firstCellHasDash && !headerFound) {
      // This looks like a shop/location name
      currentShop = firstCell;
      
      if (!shopTables[currentShop]) {
        shopTables[currentShop] = {
          name: currentShop,
          items: []
        };
      }
      
      headerFound = false; // Will look for header next
    }
  }
  
  return shopTables;
}

function convertSheetToShopTables(rows) {
  if (rows.length < 2) {
    console.log('Sheet is empty or has insufficient data');
    return {};
  }
  
  // Try horizontal format first (tables side by side, 2 cols each, no blank separator columns)
  const horizontalShops = parseHorizontalShopTables(rows);
  if (Object.keys(horizontalShops).length > 0) {
    return horizontalShops;
  }
  
  // Try table-based format next (vertical tables separated by blank rows)
  const tableBasedShops = parseTableBasedShopTables(rows);
  if (Object.keys(tableBasedShops).length > 0) {
    console.log('Detected table-based format');
    return tableBasedShops;
  }
  
  // Fallback to column-based format (legacy: row 0 = names, rows 1+ = "Item - $Price")
  console.log('Using column-based format');
  const shopTables = {};
  const numColumns = Math.max(...rows.map(row => row.length));
  
  // First row contains shop table names
  for (let col = 0; col < numColumns; col++) {
    const shopName = rows[0][col] ? rows[0][col].trim() : '';
    if (!shopName) continue;
    
    shopTables[shopName] = {
      name: shopName,
      items: []
    };
    
    // Subsequent rows contain items
    for (let row = 1; row < rows.length; row++) {
      const value = rows[row][col] ? rows[row][col].trim() : '';
      if (!value) continue;
      
      const item = parseShopItem(value);
      if (item) {
        shopTables[shopName].items.push(item);
      }
    }
  }
  
  return shopTables;
}

// Run tests
console.log('=== Testing Column-Based Format (Legacy) ===\n');

const rowsColumn = parseCSV(SAMPLE_CSV_COLUMN);
console.log(`✓ Parsed ${rowsColumn.length} rows from CSV`);

const shopTablesColumn = convertSheetToShopTables(rowsColumn);
const tableNamesColumn = Object.keys(shopTablesColumn);
console.log(`✓ Converted ${tableNamesColumn.length} shop tables\n`);

// Verify column-based results
let allTestsPassed = true;

// Test 1: Correct number of shop tables
if (tableNamesColumn.length !== 3) {
  console.error(`✗ Expected 3 shop tables, got ${tableNamesColumn.length}`);
  allTestsPassed = false;
} else {
  console.log('✓ Correct number of shop tables (3)');
}

// Test 2: Shop table names
const expectedNamesColumn = ['Pokémart Basic', "Boutique Hau'oli", 'Battle Items Shop'];
if (JSON.stringify(tableNamesColumn) !== JSON.stringify(expectedNamesColumn)) {
  console.error(`✗ Shop table names mismatch. Expected: ${expectedNamesColumn}, Got: ${tableNamesColumn}`);
  allTestsPassed = false;
} else {
  console.log('✓ Shop table names correct');
}

// Test 3: Pokémart Basic items
const pokemartBasic = shopTablesColumn['Pokémart Basic'];
if (!pokemartBasic) {
  console.error('✗ Pokémart Basic not found');
  allTestsPassed = false;
} else {
  if (pokemartBasic.items.length !== 5) {
    console.error(`✗ Pokémart Basic: Expected 5 items, got ${pokemartBasic.items.length}`);
    allTestsPassed = false;
  } else {
    console.log('✓ Pokémart Basic has correct number of items');
  }
  
  const pokeball = pokemartBasic.items.find(i => i.item === 'Poké Ball');
  if (!pokeball || pokeball.price !== '$200') {
    console.error('✗ Pokémart Basic: Poké Ball item incorrect');
    allTestsPassed = false;
  } else {
    console.log('✓ Pokémart Basic items parsed correctly');
  }
}

// Test 4: Boutique with apostrophe in name
const boutique = shopTablesColumn["Boutique Hau'oli"];
if (!boutique) {
  console.error("✗ Boutique Hau'oli not found");
  allTestsPassed = false;
} else {
  if (boutique.items.length !== 4) {
    console.error(`✗ Boutique Hau'oli: Expected 4 items, got ${boutique.items.length}`);
    allTestsPassed = false;
  } else {
    console.log("✓ Boutique Hau'oli parsed correctly");
  }
}

// Test 5: Battle Items Shop
const battleShop = shopTablesColumn['Battle Items Shop'];
if (!battleShop) {
  console.error('✗ Battle Items Shop not found');
  allTestsPassed = false;
} else {
  if (battleShop.items.length !== 5) {
    console.error(`✗ Battle Items Shop: Expected 5 items, got ${battleShop.items.length}`);
    allTestsPassed = false;
  } else {
    console.log('✓ Battle Items Shop has correct number of items');
  }
}

console.log('\n=== Testing Table-Based Format (New) ===\n');

const rowsTable = parseCSV(SAMPLE_CSV_TABLE);
console.log(`✓ Parsed ${rowsTable.length} rows from CSV`);

const shopTablesTable = convertSheetToShopTables(rowsTable);
const tableNamesTable = Object.keys(shopTablesTable);
console.log(`✓ Converted ${tableNamesTable.length} shop tables\n`);

// Test table-based format
if (tableNamesTable.length !== 2) {
  console.error(`✗ Expected 2 shop tables, got ${tableNamesTable.length}`);
  allTestsPassed = false;
} else {
  console.log('✓ Correct number of shop tables (2)');
}

const route1Shop = shopTablesTable['Route 1'];
if (!route1Shop) {
  console.error('✗ Route 1 shop not found');
  allTestsPassed = false;
} else {
  if (route1Shop.items.length !== 4) {
    console.error(`✗ Route 1: Expected 4 items, got ${route1Shop.items.length}`);
    allTestsPassed = false;
  } else {
    console.log('✓ Route 1 has correct number of items');
  }
  
  const moveDeleterItem = route1Shop.items.find(i => i.item === 'Move Deleter');
  if (!moveDeleterItem || moveDeleterItem.price !== 'Free') {
    console.error('✗ Route 1: Move Deleter item incorrect');
    allTestsPassed = false;
  } else {
    console.log('✓ Route 1 items parsed correctly (including "Free" price)');
  }
}

const route2Shop = shopTablesTable['Route 2'];
if (!route2Shop) {
  console.error('✗ Route 2 shop not found');
  allTestsPassed = false;
} else {
  if (route2Shop.items.length !== 3) {
    console.error(`✗ Route 2: Expected 3 items, got ${route2Shop.items.length}`);
    allTestsPassed = false;
  } else {
    console.log('✓ Route 2 has correct number of items');
  }
}

// Print full output for inspection
console.log('\n--- Column-Based Output (Pokémart Basic) ---');
console.log(JSON.stringify(pokemartBasic, null, 2));

console.log('\n--- Table-Based Output (Route 1) ---');
console.log(JSON.stringify(route1Shop, null, 2));

// ============================================================
console.log('\n=== Testing Horizontal 2-Column Shop Tables Parsing ===\n');

const rowsH = parseCSV(SAMPLE_CSV_HORIZONTAL);
console.log(`✓ Parsed ${rowsH.length} rows from horizontal CSV`);

const shopTablesH = convertSheetToShopTables(rowsH);
const tableNamesH = Object.keys(shopTablesH);
console.log(`✓ Converted ${tableNamesH.length} shop tables\n`);

// Test H1: Correct number of shop tables (2)
if (tableNamesH.length !== 2) {
  console.error(`✗ Expected 2 shop tables, got ${tableNamesH.length}`);
  allTestsPassed = false;
} else {
  console.log('✓ Correct number of shop tables (2)');
}

// Test H2: Shop names
const pokemartHauoli = shopTablesH["Pokemart Hau'oli"];
if (!pokemartHauoli) {
  console.error("✗ Pokemart Hau'oli not found");
  allTestsPassed = false;
} else {
  if (pokemartHauoli.items.length !== 3) {
    console.error(`✗ Pokemart Hau'oli: Expected 3 items, got ${pokemartHauoli.items.length}`);
    allTestsPassed = false;
  } else {
    console.log("✓ Pokemart Hau'oli has correct number of items (3)");
  }
  
  const pokeball = pokemartHauoli.items.find(i => i.item === 'Poké Ball');
  if (!pokeball || pokeball.price !== '$200') {
    console.error("✗ Pokemart Hau'oli: Poké Ball price incorrect");
    allTestsPassed = false;
  } else {
    console.log("✓ Pokemart Hau'oli Poké Ball price correct ($200)");
  }
}

// Test H3: Boutique (4 items — last row only has Boutique data)
const boutiqueH = shopTablesH["Boutique Hau'oli"];
if (!boutiqueH) {
  console.error("✗ Boutique Hau'oli not found in horizontal result");
  allTestsPassed = false;
} else {
  if (boutiqueH.items.length !== 4) {
    console.error(`✗ Boutique Hau'oli: Expected 4 items, got ${boutiqueH.items.length}`);
    allTestsPassed = false;
  } else {
    console.log("✓ Boutique Hau'oli has correct number of items (4)");
  }
  
  const choiceBand = boutiqueH.items.find(i => i.item === 'Choice Band');
  if (!choiceBand || choiceBand.price !== '$4000') {
    console.error("✗ Boutique Hau'oli: Choice Band price incorrect");
    allTestsPassed = false;
  } else {
    console.log("✓ Boutique Hau'oli Choice Band price correct ($4000)");
  }
}

console.log('\n--- Horizontal Output ---');
console.log(JSON.stringify(shopTablesH, null, 2));

// ============================================================
console.log('\n=== Testing New Format: Populated Adjacent Name Cells ===\n');

// New format: adjacent cells in the name row are populated (e.g., "Pokemart Cost")
// Single table case
const SAMPLE_CSV_NEW_SINGLE = `Pokemart,Pokemart Cost
Item,Cost
Cherish Ball,$300
Quick Ball,"$1,000"
Heart Scale,$100`;

const rowsNewSingle = parseCSV(SAMPLE_CSV_NEW_SINGLE);
console.log(`✓ Parsed ${rowsNewSingle.length} rows from new-format (single table) CSV`);

const shopTablesNewSingle = convertSheetToShopTables(rowsNewSingle);
const tableNamesNewSingle = Object.keys(shopTablesNewSingle);
console.log(`✓ Converted ${tableNamesNewSingle.length} shop tables\n`);

if (tableNamesNewSingle.length !== 1) {
  console.error(`✗ New single-table format: Expected 1 shop table, got ${tableNamesNewSingle.length}`);
  allTestsPassed = false;
} else {
  console.log('✓ New single-table format: Correct number of shop tables (1)');
}

const pokemartNew = shopTablesNewSingle['Pokemart'];
if (!pokemartNew) {
  console.error('✗ New single-table format: Pokemart not found');
  allTestsPassed = false;
} else {
  if (pokemartNew.items.length !== 3) {
    console.error(`✗ New single-table format: Pokemart expected 3 items, got ${pokemartNew.items.length}`);
    allTestsPassed = false;
  } else {
    console.log('✓ New single-table format: Pokemart has correct number of items (3)');
  }
  const cherishBall = pokemartNew.items.find(i => i.item === 'Cherish Ball');
  if (!cherishBall || cherishBall.price !== '$300') {
    console.error('✗ New single-table format: Cherish Ball price incorrect');
    allTestsPassed = false;
  } else {
    console.log('✓ New single-table format: Cherish Ball price correct ($300)');
  }
}

// Multiple tables separated by blank rows (new format)
const SAMPLE_CSV_NEW_MULTI = `Pokemart,Pokemart Cost
Item,Cost
Cherish Ball,$300
Quick Ball,"$1,000"

Boutique,Boutique Cost
Item,Cost
Silk Scarf,$1000
Muscle Band,$1000`;

const rowsNewMulti = parseCSV(SAMPLE_CSV_NEW_MULTI);
const shopTablesNewMulti = convertSheetToShopTables(rowsNewMulti);
const tableNamesNewMulti = Object.keys(shopTablesNewMulti);
console.log(`\n✓ Parsed new-format multi-table CSV (${tableNamesNewMulti.length} tables)`);

if (tableNamesNewMulti.length !== 2) {
  console.error(`✗ New multi-table format: Expected 2 shop tables, got ${tableNamesNewMulti.length}`);
  allTestsPassed = false;
} else {
  console.log('✓ New multi-table format: Correct number of shop tables (2)');
}

const boutiqueNew = shopTablesNewMulti['Boutique'];
if (!boutiqueNew || boutiqueNew.items.length !== 2) {
  console.error(`✗ New multi-table format: Boutique expected 2 items, got ${boutiqueNew ? boutiqueNew.items.length : 'not found'}`);
  allTestsPassed = false;
} else {
  console.log('✓ New multi-table format: Boutique has correct number of items (2)');
}

// ============================================================
console.log('\n=== Testing Shop Table Name Mismatch Validation ===\n');

function validateShopTableNames(shopTables, locationsData) {
  const referencedShops = new Set();
  for (const location of (locationsData.locations || [])) {
    for (const shopName of (location.shopTables || [])) {
      referencedShops.add(shopName);
    }
  }
  const knownShops = new Set(Object.keys(shopTables));
  const missing = [...referencedShops].filter(name => !knownShops.has(name));
  const unreferenced = [...knownShops].filter(name => !referencedShops.has(name));
  return { missing, unreferenced };
}

// Simulate locations.json with known shop references
const fakeLocations = {
  locations: [
    { id: 'route1', name: 'Route 1', shopTables: ['Pokemart Basic', 'Unknown Shop'] },
    { id: 'route2', name: 'Route 2', shopTables: [] }
  ]
};
// shop-tables.json has 'Pokemart Basic' and 'Orphan Shop'
const fakeShopTables = {
  'Pokemart Basic': { name: 'Pokemart Basic', items: [] },
  'Orphan Shop': { name: 'Orphan Shop', items: [] }
};

const { missing, unreferenced } = validateShopTableNames(fakeShopTables, fakeLocations);

if (missing.length !== 1 || missing[0] !== 'Unknown Shop') {
  console.error(`✗ Missing detection: expected ['Unknown Shop'], got ${JSON.stringify(missing)}`);
  allTestsPassed = false;
} else {
  console.log('✓ Missing shop detection works ("Unknown Shop" detected as missing)');
}

if (unreferenced.length !== 1 || unreferenced[0] !== 'Orphan Shop') {
  console.error(`✗ Unreferenced detection: expected ['Orphan Shop'], got ${JSON.stringify(unreferenced)}`);
  allTestsPassed = false;
} else {
  console.log('✓ Unreferenced shop detection works ("Orphan Shop" detected as unreferenced)');
}

// Verify no false positives when names match exactly
const { missing: m2, unreferenced: u2 } = validateShopTableNames(
  { 'Pokemart Basic': { name: 'Pokemart Basic', items: [] } },
  { locations: [{ id: 'r1', shopTables: ['Pokemart Basic'] }] }
);
if (m2.length !== 0 || u2.length !== 0) {
  console.error(`✗ No-mismatch case failed: missing=${JSON.stringify(m2)}, unreferenced=${JSON.stringify(u2)}`);
  allTestsPassed = false;
} else {
  console.log('✓ No false positives when names match exactly');
}

console.log('\n--- Test Summary ---');
if (allTestsPassed) {
  console.log('✓ All tests passed!');
  process.exit(0);
} else {
  console.error('✗ Some tests failed');
  process.exit(1);
}
