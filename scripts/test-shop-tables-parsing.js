// Test script for shop tables parsing
// This tests the parsing logic without requiring network access

const fs = require('fs');
const path = require('path');

// Sample CSV data matching the expected ShopLocations format
const SAMPLE_CSV = `"Pokémart Basic","Boutique Hau'oli","Battle Items Shop"
"Poké Ball - $200","Silk Scarf - $1000","X Attack - $500"
"Potion - $200","Muscle Band - $1000","X Defense - $550"
"Antidote - $200","Wise Glasses - $1000","X Speed - $350"
"Paralyze Heal - $200","Choice Band - $4000","X Sp. Atk - $350"
"Awakening - $100","","X Sp. Def - $350"`;

function parseCSV(csvText) {
  const rows = [];
  const lines = csvText.split(/\r?\n/);
  
  for (const line of lines) {
    if (!line.trim()) continue;
    
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

function convertSheetToShopTables(rows) {
  if (rows.length < 2) {
    console.log('Sheet is empty or has insufficient data');
    return {};
  }
  
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
console.log('Testing shop tables parsing...\n');

const rows = parseCSV(SAMPLE_CSV);
console.log(`✓ Parsed ${rows.length} rows from CSV`);

const shopTables = convertSheetToShopTables(rows);
const tableNames = Object.keys(shopTables);
console.log(`✓ Converted ${tableNames.length} shop tables\n`);

// Verify results
let allTestsPassed = true;

// Test 1: Correct number of shop tables
if (tableNames.length !== 3) {
  console.error(`✗ Expected 3 shop tables, got ${tableNames.length}`);
  allTestsPassed = false;
} else {
  console.log('✓ Correct number of shop tables (3)');
}

// Test 2: Shop table names
const expectedNames = ['Pokémart Basic', "Boutique Hau'oli", 'Battle Items Shop'];
if (JSON.stringify(tableNames) !== JSON.stringify(expectedNames)) {
  console.error(`✗ Shop table names mismatch. Expected: ${expectedNames}, Got: ${tableNames}`);
  allTestsPassed = false;
} else {
  console.log('✓ Shop table names correct');
}

// Test 3: Pokémart Basic items
const pokemartBasic = shopTables['Pokémart Basic'];
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
const boutique = shopTables["Boutique Hau'oli"];
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
const battleShop = shopTables['Battle Items Shop'];
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

// Print full output for inspection
console.log('\n--- Generated Output (Pokémart Basic) ---');
console.log(JSON.stringify(pokemartBasic, null, 2));

console.log('\n--- Test Summary ---');
if (allTestsPassed) {
  console.log('✓ All tests passed!');
  process.exit(0);
} else {
  console.error('✗ Some tests failed');
  process.exit(1);
}
