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
    // In table-based format, the table name is alone in the first cell
    // and other cells in that row should be empty or not contain " - $" pattern
    const firstCell = row[0] ? row[0].trim() : '';
    const otherCellsEmpty = row.slice(1).every(c => !c || c.trim() === '');
    const firstCellHasDash = firstCell.includes(' - ');
    
    if (firstCell && otherCellsEmpty && !firstCellHasDash && !headerFound) {
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
  
  // Try table-based format first
  const tableBasedShops = parseTableBasedShopTables(rows);
  if (Object.keys(tableBasedShops).length > 0) {
    console.log('Detected table-based format');
    return tableBasedShops;
  }
  
  // Fallback to column-based format
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

console.log('\n--- Test Summary ---');
if (allTestsPassed) {
  console.log('✓ All tests passed!');
  process.exit(0);
} else {
  console.error('✗ Some tests failed');
  process.exit(1);
}
