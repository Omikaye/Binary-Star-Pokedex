// Sync locations from Google Sheets to data/locations.json
// Sheet structure: Column A has field descriptions, subsequent columns are individual locations
// Sheet URL: https://docs.google.com/spreadsheets/d/1x21QTXNVGAvrQsiDCGzF-m09ASGW8ofgxjoqcLmQYkE/edit?gid=0#gid=0
// Sheet name: BattleLocations

const fs = require('fs');
const path = require('path');
const https = require('https');

function toID(text) {
  return String(text || '').toLowerCase().replace(/[^a-z0-9]+/g, '');
}

// Configuration
const SHEET_ID = '1x21QTXNVGAvrQsiDCGzF-m09ASGW8ofgxjoqcLmQYkE';
const SHEET_GID = '0'; // BattleLocations sheet
const OUT = path.join(__dirname, '..', 'data', 'locations.json');

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
        // Follow redirect
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
    if (!line.trim()) continue;
    
    // Simple CSV parser - handles quoted fields
    const fields = [];
    let currentField = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      const nextChar = line[i + 1];
      
      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          // Escaped quote
          currentField += '"';
          i++; // Skip next quote
        } else {
          // Toggle quotes
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        // Field separator
        fields.push(currentField);
        currentField = '';
      } else {
        currentField += char;
      }
    }
    // Add last field
    fields.push(currentField);
    rows.push(fields);
  }
  
  return rows;
}

function parseRange(str) {
  // Parse level ranges like "13-15" or "13"
  if (!str) return null;
  const cleaned = str.toString().trim();
  const m = cleaned.match(/(\d+)(?:-(\d+))?/);
  if (!m) return null;
  return { min: parseInt(m[1], 10), max: parseInt(m[2] || m[1], 10) };
}

function parsePokemonList(str) {
  // Parse pokemon entries like: "Yungoos (10%), Rattata (20%, SOS: Raticate)"
  if (!str || str.trim().toLowerCase() === 'none') return [];
  
  const pokemon = [];
  // Match patterns like: Name (chance%, optional SOS info)
  const re = /([^,(]+)\s*\(([^)]+)\)/g;
  let match;
  
  while ((match = re.exec(str)) !== null) {
    const name = match[1].trim().replace(/\s*\(Forme\s+(\d+)\)/i, ' $1');
    const inside = match[2];
    
    // Parse inside: "10%" or "10%, SOS: Pokemon1, Pokemon2"
    const parts = inside.split(/,\s*/);
    let chance = null;
    const sos = [];
    
    for (const part of parts) {
      const chanceMatch = part.match(/(\d+)%/);
      if (chanceMatch) {
        chance = parseInt(chanceMatch[1], 10);
      } else if (part.toLowerCase().startsWith('sos:')) {
        // SOS Pokemon list after "SOS:"
        const sosList = part.replace(/^sos:\s*/i, '').trim();
        if (sosList) sos.push(...sosList.split(/\s*,\s*/));
      } else if (!chanceMatch && part.trim() && !part.includes('%')) {
        // Additional SOS pokemon without SOS: prefix
        sos.push(part.trim());
      }
    }
    
    pokemon.push({ name, chance, sos });
  }
  
  return pokemon;
}

function parseEncounters(encounterData) {
  // encounterData is an object with keys like "Grass", "Cave", etc.
  // Each value is an object with levelRange and pokemon list
  const encounters = [];
  
  for (const [spot, data] of Object.entries(encounterData)) {
    if (!data || typeof data !== 'object') continue;
    
    const encounter = {
      spot,
      levelRange: data.levelRange || { min: 1, max: 1 },
      pokemon: data.pokemon || []
    };
    
    encounters.push(encounter);
  }
  
  return encounters;
}

function parseList(str) {
  // Parse comma-separated lists
  if (!str || str.trim().toLowerCase() === 'none') return [];
  return str.split(/\s*,\s*/).map(s => s.trim()).filter(s => s);
}

function parseShops(str) {
  // Parse shop items: "Potion - $200, Super Potion - $700"
  if (!str || str.trim().toLowerCase() === 'none') return [];
  
  const shops = [];
  const items = str.split(/\s*,\s*/);
  
  for (const item of items) {
    const match = item.match(/^(.+?)\s*-\s*(.+)$/);
    if (match) {
      shops.push({ item: match[1].trim(), price: match[2].trim() });
    }
  }
  
  return shops;
}

function parseItems(str) {
  // Parse items: "Poké Ball x10 - From Kukui, Revive - Hidden"
  if (!str || str.trim().toLowerCase() === 'none') return [];
  
  const items = [];
  // Match pattern: ItemName [quantity] - Description, ItemName2 - Description2
  // Examples: "Potion x5 - From Mom", "Rare Candy - Hidden", "TM01 - From NPC in Pokemon Center"
  // Pattern breaks down: ([^,]+? non-greedy any chars except comma, 
  //   (?:[x×]\s*\d+)? optional quantity like "x5" or "×10",
  //   \s*-\s* dash separator with optional whitespace,
  //   [^,]+? description until comma or end)
  const itemPattern = /([^,]+?\s*(?:[x×]\s*\d+)?\s*-\s*[^,]+?)(?=,|$)/g;
  const matches = str.match(itemPattern);
  
  if (!matches) return [];
  
  for (const entry of matches) {
    const match = entry.match(/^(.+?)\s*-\s*(.+)$/);
    if (!match) continue;
    
    let itemPart = match[1].trim();
    const obtain = match[2].trim();
    let quantity = 1;
    
    // Check for quantity like "x10" or "×5"
    const qtyMatch = itemPart.match(/(.+?)\s*[x×]\s*(\d+)/i);
    if (qtyMatch) {
      itemPart = qtyMatch[1].trim();
      quantity = parseInt(qtyMatch[2], 10);
    }
    
    items.push({ item: itemPart, quantity, obtain });
  }
  
  return items;
}

function parseShopTables(str) {
  // Parse shop table names: "Pokemart 1, Pokemart 2, Special Shop"
  if (!str || str.trim().toLowerCase() === 'none') return [];
  return str.split(/\s*,\s*/).map(s => s.trim()).filter(s => s);
}

function parseGiftsTrades(str) {
  // Parse pipe-separated gifts/trades: "Rowlet (Starter, Held: Oran Berry) | Litten (Starter)"
  // Returns array of {name, description} objects.
  if (!str || !str.trim() || str.trim().toLowerCase() === 'none') return [];
  const entries = str.split('|').map(s => s.trim()).filter(s => s);
  return entries.map(entry => {
    const parenMatch = entry.match(/^(.+?)\s*\((.+)\)\s*$/);
    if (parenMatch) {
      return { name: parenMatch[1].trim(), description: parenMatch[2].trim() };
    }
    return { name: entry.trim(), description: '' };
  });
}

function parseBattle(str) {
  // Parse battle format: "491 - Story - Hau battle 1 | Rowlet Chosen"
  // Format: ID - Tag - Notes
  // ID can be numeric (491) or alphanumeric (S023)
  if (!str || str.trim().toLowerCase() === 'none') return null;
  
  const parts = str.split(/\s*-\s*/);
  if (parts.length < 2) return null;
  
  const id = parts[0].trim();
  const tag = parts[1].trim();
  const notes = parts.length > 2 ? parts.slice(2).join(' - ').trim() : '';
  
  return { id, tag, notes };
}

function convertSheetToLocations(rows) {
  if (rows.length < 2) {
    console.log('Sheet is empty or has insufficient data');
    return [];
  }
  
  // First column is field descriptions
  const fieldDescriptions = rows.map(row => row[0] ? row[0].trim() : '');
  
  // Subsequent columns are locations
  const locations = [];
  const numColumns = Math.max(...rows.map(row => row.length));
  
  for (let col = 1; col < numColumns; col++) {
    const location = {
      id: '',
      name: '',
      notes: '',
      encounters: [],
      giftsTrades: [],
      staticPokemon: [],
      trainers: [],
      bossTrainers: [],
      shops: [],
      shopTables: [],
      items: [],
      battles: []
    };
    
    let encounterData = {};
    
    for (let row = 0; row < rows.length; row++) {
      const field = fieldDescriptions[row].toLowerCase();
      const value = rows[row][col] ? rows[row][col].trim() : '';
      
      if (!value) continue;
      
      // Map fields based on description
      if (field.includes('name') && !field.includes('pokemon')) {
        location.name = value;
        location.id = toID(value);
      } else if (field.includes('location notes')) {
        location.notes = value;
      } else if (field === 'shops') {
        // Shops field contains comma-separated shop table names
        location.shopTables = parseShopTables(value);
      } else if (field.includes('gifts') || field.includes('trades')) {
        location.giftsTrades = parseGiftsTrades(value);
      } else if (field.includes('static pokemon')) {
        location.staticPokemon = parseList(value);
      } else if (field.includes('boss trainer')) {
        location.bossTrainers = parseList(value);
      } else if (field.includes('trainer') && !field.includes('boss')) {
        location.trainers = parseList(value);
      } else if (field.includes('shop') && !field.startsWith('shops')) {
        // Legacy shop item format: "Item - Price"
        location.shops = parseShops(value);
      } else if (field.includes('item') && !field.includes('pokemon')) {
        location.items = parseItems(value);
      } else if (field.match(/^battle\s+\d+$/i)) {
        // Battle fields like "Battle 1", "Battle 2", etc.
        const battle = parseBattle(value);
        if (battle) {
          location.battles.push(battle);
        }
      } else if (field.includes('grass') || field.includes('cave') || 
                 field.includes('water') || field.includes('fishing') ||
                 field.includes('encounter')) {
        // Encounter type - look for format like "Grass (Levels 3-5): Pokemon list"
        const encounterMatch = value.match(/^([^:()]+)?(?:\(Levels?\s+([^)]+)\))?\s*:?\s*(.*)$/i);
        if (encounterMatch) {
          const spotName = encounterMatch[1] ? encounterMatch[1].trim() : field;
          const levelStr = encounterMatch[2];
          const pokemonStr = encounterMatch[3];
          
          const levelRange = parseRange(levelStr) || { min: 1, max: 1 };
          const pokemon = parsePokemonList(pokemonStr);
          
          if (pokemon.length > 0) {
            location.encounters.push({
              spot: spotName.charAt(0).toUpperCase() + spotName.slice(1),
              levelRange,
              pokemon
            });
          }
        } else {
          // Try to parse as just pokemon list
          const pokemon = parsePokemonList(value);
          if (pokemon.length > 0) {
            location.encounters.push({
              spot: field.charAt(0).toUpperCase() + field.slice(1),
              levelRange: { min: 1, max: 1 },
              pokemon
            });
          }
        }
      }
    }
    
    // Only add location if it has a name
    if (location.name) {
      locations.push(location);
    }
  }
  
  return locations;
}

async function main() {
  try {
    console.log('Fetching data from Google Sheets...');
    console.log('URL:', CSV_URL);
    
    const csvData = await fetchCSV(CSV_URL);
    
    if (!csvData || csvData.trim().length === 0) {
      console.error('ERROR: Sheet appears to be empty or inaccessible.');
      console.error('Please ensure:');
      console.error('1. The sheet is publicly accessible (Anyone with the link can view)');
      console.error('2. The sheet ID and GID are correct');
      console.error('3. The BattleLocations sheet exists');
      process.exit(1);
    }
    
    console.log('Parsing CSV data...');
    const rows = parseCSV(csvData);
    console.log(`Parsed ${rows.length} rows`);
    
    if (rows.length === 0) {
      console.error('ERROR: No data rows found in sheet');
      process.exit(1);
    }
    
    console.log('Converting to locations format...');
    const locations = convertSheetToLocations(rows);
    console.log(`Converted ${locations.length} locations`);
    
    if (locations.length === 0) {
      console.error('WARNING: No locations were converted from the sheet');
      console.error('First few rows of data:');
      rows.slice(0, 5).forEach((row, i) => {
        console.error(`Row ${i}:`, row.slice(0, 3));
      });
    }
    
    const output = { locations };
    fs.writeFileSync(OUT, JSON.stringify(output, null, 2), 'utf8');
    console.log('✓ Wrote', OUT, 'with', locations.length, 'locations');
    
    if (locations.length > 0) {
      console.log('\nFirst location:');
      console.log(JSON.stringify(locations[0], null, 2));
    }
  } catch (error) {
    console.error('ERROR:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

main();
