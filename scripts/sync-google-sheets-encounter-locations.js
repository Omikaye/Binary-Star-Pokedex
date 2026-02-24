// Sync encounter locations from Google Sheets to data/locations.json
// Sheet structure: Row 1 = location names, Row 2 = gifts/trades,
//   then repeating blocks of 10 rows: 1 encounter name + 9 encounter data rows
// Sheet URL: https://docs.google.com/spreadsheets/d/1x21QTXNVGAvrQsiDCGzF-m09ASGW8ofgxjoqcLmQYkE/edit?gid=170288071
// Sheet name: EncounterLocations

const fs = require('fs');
const path = require('path');
const https = require('https');

function toID(text) {
  return String(text || '').toLowerCase().replace(/[^a-z0-9]+/g, '');
}

// Configuration
const SHEET_ID = '1x21QTXNVGAvrQsiDCGzF-m09ASGW8ofgxjoqcLmQYkE';
const ENCOUNTER_LOCATIONS_GID = '170288071';
const LOCATIONS_JSON = path.join(__dirname, '..', 'data', 'locations.json');

const CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${ENCOUNTER_LOCATIONS_GID}`;

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

/**
 * Parse gifts/trades string: "Rowlet (Starter, Held: Oran Berry) | Litten (Starter, Held: Oran Berry)"
 * Returns array of {name, description} objects.
 */
function parseGiftsTrades(str) {
  if (!str || !str.trim() || str.trim().toLowerCase() === 'none') return [];

  const entries = str.split('|').map(s => s.trim()).filter(s => s);
  const result = [];

  for (const entry of entries) {
    // Match: "PokemonName (description)" - the last parenthesized group is the description
    // But pokemon names can also have "(Forme X)" so we grab everything after the first "("
    // that doesn't look like a forme indicator
    // Strategy: find the LAST balanced parenthesized group as the description
    const parenMatch = entry.match(/^(.+?)\s*\((.+)\)\s*$/);
    if (parenMatch) {
      result.push({
        name: parenMatch[1].trim(),
        description: parenMatch[2].trim()
      });
    } else {
      result.push({ name: entry.trim(), description: '' });
    }
  }

  return result;
}

/**
 * Parse level range from a string like "(Levels 3-5)" or "(Level 3)" or "Lv. 3-5"
 */
function parseLevelRange(str) {
  const match = str.match(/[Ll]ev(?:el)?s?\s*(\d+)(?:\s*-\s*(\d+))?/);
  if (!match) return null;
  return { min: parseInt(match[1], 10), max: parseInt(match[2] || match[1], 10) };
}

/**
 * Parse a single encounter entry like "Yungoos (10%)" or "Rattata (Forme 1) (10%)"
 * Returns {name, chance} or null.
 */
function parseEncounterEntry(entry) {
  entry = entry.trim();
  if (!entry) return null;
  // Match the last "(N%)" pattern as the chance, everything before it is the name
  const chanceMatch = entry.match(/^(.*)\s*\((\d+)%\)\s*$/);
  if (chanceMatch) {
    return { name: chanceMatch[1].trim(), chance: parseInt(chanceMatch[2], 10) };
  }
  // No chance percentage found - return name only
  return { name: entry, chance: null };
}

/**
 * Parse a row of encounter data.
 * Format: "Encounters (Levels 3-5): Yungoos (10%), Rattata (Forme 1) (10%), ..."
 * or      "SOS Slot 1 (Levels 3-5): Yungoos (10%), ..."
 * or      "Additional SOS encounters: (None)"
 * Returns array of {name, chance} objects.
 */
function parseEncounterDataRow(str) {
  if (!str || !str.trim()) return [];
  const colonIdx = str.indexOf(':');
  if (colonIdx < 0) return [];

  const pokemonPart = str.substring(colonIdx + 1).trim();
  if (!pokemonPart || pokemonPart.toLowerCase() === '(none)' || pokemonPart.toLowerCase() === 'none') {
    return [];
  }

  // Split by comma - entries are "Name (chance%)" or "Name (Forme X) (chance%)"
  // We need to split on ", " but only when not inside parentheses
  const entries = [];
  let current = '';
  let depth = 0;
  for (let i = 0; i < pokemonPart.length; i++) {
    const c = pokemonPart[i];
    if (c === '(') depth++;
    else if (c === ')') depth--;
    else if (c === ',' && depth === 0) {
      entries.push(current.trim());
      current = '';
      continue;
    }
    current += c;
  }
  if (current.trim()) entries.push(current.trim());

  return entries.map(parseEncounterEntry).filter(e => e && e.name);
}

/**
 * Parse encounter name from cell value.
 * Format: "Table 1 (Day) | Grass:" or just "Grass:"
 * Returns the part after the last "|", with trailing ":" stripped.
 */
function parseEncounterName(str) {
  if (!str || !str.trim()) return '';
  const parts = str.split('|');
  const name = parts[parts.length - 1].trim();
  return name.replace(/:+\s*$/, '').trim();
}

/**
 * Parse one encounter block: nameCell is the encounter name cell,
 * dataRows is an array of exactly 9 cell strings (main + SOS slots + additional).
 * Returns an encounter object suitable for locations.json, or null.
 */
function parseEncounterBlock(nameCell, dataRows) {
  const encounterName = parseEncounterName(nameCell);
  if (!encounterName) return null;

  let mainPokemon = [];
  let levelRange = { min: 1, max: 1 };
  const sosLists = [];

  for (let i = 0; i < dataRows.length; i++) {
    const row = (dataRows[i] || '').trim();
    if (!row) continue;
    const lower = row.toLowerCase();

    // Skip "Additional SOS encounters" row
    if (lower.startsWith('additional sos')) continue;

    if (lower.startsWith('encounters') || lower.match(/^encounters\s*\(/i)) {
      // Main encounter row - extract level range and pokemon list
      const lr = parseLevelRange(row);
      if (lr) levelRange = lr;
      mainPokemon = parseEncounterDataRow(row);
    } else if (lower.match(/^sos\s+slot\s+\d+/i)) {
      // SOS slot row
      sosLists.push(parseEncounterDataRow(row));
    }
  }

  if (!mainPokemon.length) return null;

  // For each position in the main list, collect unique SOS Pokemon that differ from the main
  const pokemon = mainPokemon.map((mon, idx) => {
    const sosSet = new Set();
    for (const sosList of sosLists) {
      if (idx < sosList.length) {
        const sosEntry = sosList[idx];
        if (sosEntry && sosEntry.name && sosEntry.name !== mon.name) {
          sosSet.add(sosEntry.name);
        }
      }
    }
    return {
      name: mon.name,
      chance: mon.chance,
      sos: Array.from(sosSet)
    };
  });

  return {
    spot: encounterName,
    levelRange,
    pokemon
  };
}

/**
 * Convert parsed rows into a map of locationId -> {encounters, giftsTrades}.
 * Sheet structure (0-indexed rows, skipping column 0 which is row labels):
 *   Row 0: location names
 *   Row 1: gifts/trades
 *   Row 2: encounter 1 name
 *   Rows 3-11: encounter 1 data (9 rows)
 *   Row 12: encounter 2 name
 *   Rows 13-21: encounter 2 data
 *   ... repeating every 10 rows
 */
function convertSheetToEncounterData(rows) {
  if (rows.length < 2) return {};

  const result = {};

  // Row 0: location names (column 0 is label, columns 1+ are locations)
  const locationRow = rows[0] || [];
  const numColumns = Math.max(...rows.map(r => r.length));

  for (let col = 1; col < numColumns; col++) {
    const locationName = (locationRow[col] || '').trim();
    if (!locationName) continue;

    const locationId = toID(locationName);

    // Row 1: gifts/trades
    const giftsTradesRaw = rows[1] ? (rows[1][col] || '').trim() : '';
    const giftsTrades = parseGiftsTrades(giftsTradesRaw);

    // Encounter blocks: starting at row 2, repeating every 10 rows
    const encounters = [];
    let rowIdx = 2;
    while (rowIdx < rows.length) {
      const nameCell = rows[rowIdx] ? (rows[rowIdx][col] || '').trim() : '';
      // Collect 9 data rows
      const dataRows = [];
      for (let d = 1; d <= 9; d++) {
        const dataIdx = rowIdx + d;
        dataRows.push(rows[dataIdx] ? (rows[dataIdx][col] || '').trim() : '');
      }

      if (nameCell) {
        const encounter = parseEncounterBlock(nameCell, dataRows);
        if (encounter) {
          encounters.push(encounter);
        }
      }

      rowIdx += 10;
    }

    result[locationId] = { giftsTrades, encounters };
  }

  return result;
}

function mergeEncounterDataIntoLocations(locationsData, encounterDataMap) {
  for (const location of locationsData.locations) {
    const data = encounterDataMap[location.id];
    if (!data) continue;

    location.encounters = data.encounters;
    location.giftsTrades = data.giftsTrades;
    console.log(`  ✓ Updated encounters for ${location.name}: ${data.encounters.length} encounter(s), ${data.giftsTrades.length} gift(s)/trade(s)`);
  }
  return locationsData;
}

async function main() {
  try {
    console.log('Fetching data from Google Sheets (EncounterLocations)...');
    console.log('URL:', CSV_URL);

    const csvData = await fetchCSV(CSV_URL);

    if (!csvData || csvData.trim().length === 0) {
      console.error('ERROR: Sheet appears to be empty or inaccessible.');
      console.error('Please ensure:');
      console.error('1. The sheet is publicly accessible (Anyone with the link can view)');
      console.error('2. The sheet ID and GID are correct');
      console.error('3. The EncounterLocations sheet exists');
      process.exit(1);
    }

    console.log('Parsing CSV data...');
    const rows = parseCSV(csvData);
    console.log(`Parsed ${rows.length} rows`);

    console.log('Converting encounter data...');
    const encounterDataMap = convertSheetToEncounterData(rows);
    const locationCount = Object.keys(encounterDataMap).length;
    console.log(`Found encounter data for ${locationCount} location(s)`);

    if (locationCount === 0) {
      console.error('WARNING: No encounter data found in sheet');
      console.error('First few rows:');
      rows.slice(0, 5).forEach((row, i) => console.error(`  Row ${i}:`, row.slice(0, 3)));
    }

    console.log('Reading existing locations.json...');
    if (!fs.existsSync(LOCATIONS_JSON)) {
      console.error(`ERROR: ${LOCATIONS_JSON} not found`);
      console.error('Please run the main location sync first: npm run sync-sheets-locations');
      process.exit(1);
    }

    const locationsData = JSON.parse(fs.readFileSync(LOCATIONS_JSON, 'utf8'));
    console.log(`Loaded ${locationsData.locations.length} locations`);

    console.log('Merging encounter data into locations...');
    const updatedLocations = mergeEncounterDataIntoLocations(locationsData, encounterDataMap);

    fs.writeFileSync(LOCATIONS_JSON, JSON.stringify(updatedLocations, null, 2), 'utf8');
    console.log('✓ Wrote', LOCATIONS_JSON);

  } catch (error) {
    console.error('ERROR:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

main();
