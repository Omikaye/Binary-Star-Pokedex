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
    const parsedUrl = new URL(url);
    const options = {
      hostname: parsedUrl.hostname,
      path: parsedUrl.pathname + parsedUrl.search,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; node.js)'
      }
    };
    https.get(options, (res) => {
      if ([301, 302, 303, 307, 308].includes(res.statusCode)) {
        const location = res.headers.location;
        const redirectUrl = /^https?:\/\//.test(location) ? location : new URL(location, url).href;
        const redirectHost = new URL(redirectUrl).hostname;
        if (!redirectHost.endsWith('.google.com') && !redirectHost.endsWith('.googleapis.com') && !redirectHost.endsWith('.googleusercontent.com')) {
          reject(new Error(`Unexpected redirect to ${redirectHost}`));
          return;
        }
        return fetchCSV(redirectUrl).then(resolve).catch(reject);
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

function parseHorizontalShopTables(rows) {
  // Parse horizontal format: tables side by side, each exactly 2 columns wide.
  // Row 0: shop names at even column indices (0, 2, 4, ...); the adjacent odd column is empty.
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
      
      if (!itemName) continue; // empty Item cell = no entry for this row in this block
      
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
    // In table-based format, the table name is alone in the first cell
    // and other cells in that row should be empty or not contain " - $" pattern
    const firstCell = row[0] ? row[0].trim() : '';
    const otherCellsEmpty = row.slice(1).every(c => !c || c.trim() === '');
    const firstCellHasDash = firstCell.includes(' - ');
    
    // Only identify as shop name if:
    // 1. First cell has content
    // 2. Other cells are empty (table name row)
    // 3. First cell doesn't have " - " (would indicate item data in column format)
    // 4. No header found yet (prevents data rows from being misidentified as shop names)
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

function validateShopTableNames(shopTables, locationsJsonPath) {
  // Compare shop table names between shop-tables.json and locations.json shopTables references.
  // Emits warnings but does not throw.
  if (!fs.existsSync(locationsJsonPath)) {
    console.log('(Skipping shop name validation: locations.json not found)');
    return;
  }
  
  let locationsData;
  try {
    locationsData = JSON.parse(fs.readFileSync(locationsJsonPath, 'utf8'));
  } catch (e) {
    console.log('(Skipping shop name validation: could not parse locations.json)');
    return;
  }
  
  // Collect all shop names referenced in locations.json
  const referencedShops = new Set();
  for (const location of (locationsData.locations || [])) {
    for (const shopName of (location.shopTables || [])) {
      referencedShops.add(shopName);
    }
  }
  
  const knownShops = new Set(Object.keys(shopTables));
  
  // Check for references missing from shop-tables.json
  const missingFromShopTables = [...referencedShops].filter(name => !knownShops.has(name));
  if (missingFromShopTables.length > 0) {
    console.warn('\nWARNING: The following shop names are referenced by locations.json but missing from shop-tables.json:');
    for (const name of missingFromShopTables) {
      console.warn(`  - "${name}"`);
    }
  }
  
  // Check for shop tables not referenced by any location
  const unreferencedShops = [...knownShops].filter(name => !referencedShops.has(name));
  if (unreferencedShops.length > 0) {
    console.warn('\nWARNING: The following shop tables exist in shop-tables.json but are not referenced by any location:');
    for (const name of unreferencedShops) {
      console.warn(`  - "${name}"`);
    }
  }
  
  if (missingFromShopTables.length === 0 && unreferencedShops.length === 0) {
    console.log('✓ Shop table names validated: all names match between shop-tables.json and locations.json');
  }
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
    
    // Validate shop table names against locations.json
    console.log('\nValidating shop table names against locations.json...');
    const LOCATIONS_JSON = path.join(__dirname, '..', 'data', 'locations.json');
    validateShopTableNames(shopTables, LOCATIONS_JSON);
    
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
