// Sync shop tables from Google Sheets ShopLocations page to data/shop-tables.json
// Sheet URL: https://docs.google.com/spreadsheets/d/1x21QTXNVGAvrQsiDCGzF-m09ASGW8ofgxjoqcLmQYkE/edit?gid=1527137776#gid=1527137776
// Sheet name: ShopLocations
// 
// Expected format:
// - Each shop table is defined in columns
// - First row: Shop table name (e.g., "Pokemart Basic")
// - Subsequent rows: Items in format "Item Name - $Price"
// 
// Example:
// | Pokemart Basic | Boutique Hau'oli |
// | Poké Ball - $200 | Silk Scarf - $1000 |
// | Potion - $200 | Muscle Band - $1000 |
// | Antidote - $200 | Wise Glasses - $1000 |

const fs = require('fs');
const path = require('path');
const https = require('https');

// Configuration
const SHEET_ID = '1x21QTXNVGAvrQsiDCGzF-m09ASGW8ofgxjoqcLmQYkE';
const SHEET_GID = '1527137776'; // ShopLocations sheet
const OUT = path.join(__dirname, '..', 'data', 'shop-tables.json');

// Export URL for CSV format
const CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${SHEET_GID}`;

function fetchCSV(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if ([301, 302, 307, 308].includes(res.statusCode)) {
        return fetchCSV(res.headers.location).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        reject(new Error(`Failed to fetch: ${res.statusCode}`));
        return;
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function parseCSV(csvText) {
  const rows = [];
  const lines = csvText.split(/\r?\n/);
  
  for (const line of lines) {
    // Keep empty lines for table-based format separation
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
  // Parse shop item format: "Item Name - $Price"
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

async function main() {
  try {
    console.log('Fetching shop data from Google Sheets...');
    console.log('URL:', CSV_URL);
    
    const csvData = await fetchCSV(CSV_URL);
    
    if (!csvData || csvData.trim().length === 0) {
      console.error('ERROR: Sheet appears to be empty or inaccessible.');
      console.error('Please ensure:');
      console.error('1. The sheet is publicly accessible (Anyone with the link can view)');
      console.error('2. The sheet ID and GID are correct');
      console.error('3. The ShopLocations sheet exists');
      process.exit(1);
    }
    
    console.log('Parsing CSV data...');
    const rows = parseCSV(csvData);
    console.log(`Parsed ${rows.length} rows`);
    
    if (rows.length === 0) {
      console.error('ERROR: No data rows found in sheet');
      process.exit(1);
    }
    
    console.log('Converting to shop tables format...');
    const shopTables = convertSheetToShopTables(rows);
    const tableNames = Object.keys(shopTables);
    console.log(`Converted ${tableNames.length} shop tables`);
    
    if (tableNames.length === 0) {
      console.error('WARNING: No shop tables were converted from the sheet');
      console.error('First few rows of data:');
      rows.slice(0, 5).forEach((row, i) => {
        console.error(`Row ${i}:`, row.slice(0, 3));
      });
    }
    
    const output = { shopTables };
    fs.writeFileSync(OUT, JSON.stringify(output, null, 2), 'utf8');
    console.log('✓ Wrote', OUT, 'with', tableNames.length, 'shop tables');
    
    if (tableNames.length > 0) {
      console.log('\nShop tables:');
      for (const name of tableNames) {
        console.log(`  - ${name}: ${shopTables[name].items.length} items`);
      }
      console.log('\nFirst shop table:');
      console.log(JSON.stringify(shopTables[tableNames[0]], null, 2));
    }
  } catch (error) {
    console.error('ERROR:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

main();
