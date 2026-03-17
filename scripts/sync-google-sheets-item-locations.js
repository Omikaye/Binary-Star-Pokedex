// Sync item locations from Google Sheets (ItemLocations tab) and merge with existing locations.json
// Sheet (base): https://docs.google.com/spreadsheets/d/1x21QTXNVGAvrQsiDCGzF-m09ASGW8ofgxjoqcLmQYkE
// ItemLocations tab (edit link): https://docs.google.com/spreadsheets/d/1x21QTXNVGAvrQsiDCGzF-m09ASGW8ofgxjoqcLmQYkE/edit?gid=1958269454#gid=1958269454
// Sheet name: ItemLocations
// CSV export pattern used by this script: https://docs.google.com/spreadsheets/d/1x21QTXNVGAvrQsiDCGzF-m09ASGW8ofgxjoqcLmQYkE/export?format=csv&gid=1958269454

const fs = require('fs');
const path = require('path');
const https = require('https');

function toID(text) {
  return String(text || '').toLowerCase().replace(/[^a-z0-9]+/g, '');
}

// Configuration
const SHEET_ID = '1x21QTXNVGAvrQsiDCGzF-m09ASGW8ofgxjoqcLmQYkE';
const ITEM_LOCATIONS_GID = '1958269454'; // ItemLocations sheet GID
const LOCATIONS_JSON = path.join(__dirname, '..', 'data', 'locations.json');

// Export URL for CSV format
// Note: GID will need to be determined from the actual sheet
function getCSVUrl(gid) {
  return `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${gid}`;
}

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
    // Keep empty lines as they signal table boundaries in table-based parsing
    if (!line.trim()) {
      rows.push([]); // Empty row preserved for table separation
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

function parseHorizontalItemLocations(rows) {
  // Parse horizontal format: tables side by side, each exactly 3 columns wide.
  // Row 0: location names at col 0, col 3, col 6, ... (other cells in row 0 are empty)
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
  
  console.log('Detected horizontal item locations format');
  
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
      
      if (!itemName) continue; // empty Item cell = no entry for this row in this block
      
      const numStr = row[numCol] ? row[numCol].trim() : '1';
      const method = row[methodCol] ? row[methodCol].trim() : '';
      
      const quantity = numStr || 1;
      
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
  // Try horizontal format first (tables side by side, 3 cols each, no blank separator columns)
  const horizontal = parseHorizontalItemLocations(rows);
  if (Object.keys(horizontal).length > 0) {
    return horizontal;
  }
  
  // Fall back to vertical table-based format (tables separated by blank rows)
  console.log('Using vertical table-based format');
  return parseTableBasedItemLocations(rows);
}

function parseTableBasedItemLocations(rows) {
  // Parse tables where each table starts with a location name,
  // followed by header row (Item, Num, Method),
  // followed by data rows
  
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
      // Empty row might signal end of current table
      if (currentLocation) {
        headerFound = false;
      }
      continue;
    }
    
    // Check if this is a header row (contains "Item", "Num", "Method")
    const rowText = row.map(c => (c || '').toLowerCase().trim());
    const hasItem = rowText.some(c => c.includes('item'));
    const hasNum = rowText.some(c => c.includes('num') || c.includes('quantity') || c.includes('qty'));
    const hasMethod = rowText.some(c => c.includes('method') || c.includes('obtain') || c.includes('how'));
    
    if (hasItem && hasNum && hasMethod) {
      // This is a header row
      headerFound = true;
      
      // Find column indices
      itemColumnIndex = rowText.findIndex(c => c.includes('item'));
      numColumnIndex = rowText.findIndex(c => c.includes('num') || c.includes('quantity') || c.includes('qty'));
      methodColumnIndex = rowText.findIndex(c => c.includes('method') || c.includes('obtain') || c.includes('how'));
      
      continue;
    }
    
    // If we have a header but this row has data in the expected columns, it's a data row
    if (headerFound && currentLocation && itemColumnIndex >= 0) {
      const itemName = row[itemColumnIndex] ? row[itemColumnIndex].trim() : '';
      const numStr = row[numColumnIndex] ? row[numColumnIndex].trim() : '1';
      const method = row[methodColumnIndex] ? row[methodColumnIndex].trim() : '';
      
      if (itemName) {
        const quantity = numStr || 1;
        
        locationItems[currentLocation].push({
          item: itemName,
          quantity: quantity,
          obtain: method
        });
      }
      continue;
    }
    
    // Otherwise, check if this row is a table name (location name)
    // A table name is typically a single cell with text, or first cell has text and others are empty
    const firstCell = row[0] ? row[0].trim() : '';
    if (firstCell && !headerFound) {
      // This looks like a location name
      const locationName = firstCell;
      const locationId = toID(locationName);
      currentLocation = locationId;
      
      if (!locationItems[locationId]) {
        locationItems[locationId] = [];
      }
      
      headerFound = false; // Will look for header next
    }
  }
  
  return locationItems;
}

function mergeItemsIntoLocations(locationsData, itemLocationMap) {
  // Merge the items from itemLocationMap into the existing locations
  for (const location of locationsData.locations) {
    const locationId = location.id;
    
    if (itemLocationMap[locationId]) {
      // Replace items with the ones from ItemLocations sheet
      location.items = itemLocationMap[locationId];
      console.log(`  ✓ Updated items for ${location.name} (${itemLocationMap[locationId].length} items)`);
    }
  }
  
  return locationsData;
}

async function main() {
  try {
    // First, try to detect the GID by trying common values or let user specify
    // For now, we'll need the GID to be configured
    
    // Read command line argument for GID if provided
    const args = process.argv.slice(2);
    let gid = ITEM_LOCATIONS_GID;
    
    if (args.length > 0) {
      gid = args[0];
      console.log(`Using GID from command line: ${gid}`);
    }
    
    if (!gid) {
      console.error('ERROR: ItemLocations sheet GID not configured.');
      console.error('Please provide the GID as a command line argument:');
      console.error('  npm run sync-item-locations -- <GID>');
      console.error('');
      console.error('To find the GID:');
      console.error('1. Open the Google Sheet');
      console.error('2. Navigate to the "ItemLocations" tab');
      console.error('3. Look at the URL: ...edit#gid=XXXXXXX');
      console.error('4. The number after "gid=" is the GID');
      process.exit(1);
    }
    
    const csvUrl = getCSVUrl(gid);
    console.log('Fetching ItemLocations data from Google Sheets...');
    console.log('URL:', csvUrl);
    
    const csvData = await fetchCSV(csvUrl);
    
    if (!csvData || csvData.trim().length === 0) {
      console.error('ERROR: Sheet appears to be empty or inaccessible.');
      console.error('Please ensure:');
      console.error('1. The sheet is publicly accessible (Anyone with the link can view)');
      console.error('2. The GID is correct for the ItemLocations sheet');
      process.exit(1);
    }
    
    console.log('Parsing CSV data...');
    const rows = parseCSV(csvData);
    console.log(`Parsed ${rows.length} rows`);
    
    console.log('Extracting item locations from tables...');
    const itemLocationMap = convertSheetToItemLocations(rows);
    const locationCount = Object.keys(itemLocationMap).length;
    console.log(`Found items for ${locationCount} locations`);
    
    if (locationCount === 0) {
      console.error('WARNING: No location tables were found in the sheet');
      console.error('Supported formats:');
      console.error('  Horizontal (3-col blocks, no blank separators):');
      console.error('    Loc1 |     |        | Loc2 |     |');
      console.error('    Item | Num | Method | Item | Num | Method');
      console.error('    Ball | 1   | Found  | Map  | 1   | NPC');
      console.error('  Vertical (tables separated by blank rows):');
      console.error('    Location Name');
      console.error('    Item | Num | Method');
      console.error('    Poké Ball | 10 | From Kukui');
      console.error('    (blank line)');
      console.error('    Next Location Name');
    }
    
    // Read existing locations.json
    console.log('Reading existing locations.json...');
    if (!fs.existsSync(LOCATIONS_JSON)) {
      console.error(`ERROR: ${LOCATIONS_JSON} not found`);
      console.error('Please run the main location sync first: npm run sync-sheets-locations');
      process.exit(1);
    }
    
    const locationsData = JSON.parse(fs.readFileSync(LOCATIONS_JSON, 'utf8'));
    console.log(`Loaded ${locationsData.locations.length} locations`);
    
    // Merge items into locations
    console.log('Merging items into locations...');
    const updatedLocations = mergeItemsIntoLocations(locationsData, itemLocationMap);
    
    // Write back to locations.json
    fs.writeFileSync(LOCATIONS_JSON, JSON.stringify(updatedLocations, null, 2), 'utf8');
    console.log('✓ Updated', LOCATIONS_JSON);
    
    // Show summary
    console.log('\nSummary:');
    Object.keys(itemLocationMap).forEach(locId => {
      const location = locationsData.locations.find(l => l.id === locId);
      const locationName = location ? location.name : locId;
      console.log(`  ${locationName}: ${itemLocationMap[locId].length} items`);
    });
    
  } catch (error) {
    console.error('ERROR:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

main();
