// Test script for EncounterLocations Google Sheets parsing
// Tests the column-based format with gifts/trades and encounter blocks

function toID(text) {
  return String(text || '').toLowerCase().replace(/[^a-z0-9]+/g, '');
}

// Sample CSV matching the Encounter Locations sheet format:
//   Column A = row labels (ignored)
//   Columns B+ = location data
//   Row 1 = location names
//   Row 2 = gifts/trades
//   Row 3 = encounter 1 name
//   Rows 4-12 = encounter 1 data (9 rows: main + 7 SOS slots + additional SOS note)
//   Row 13 = encounter 2 name
//   Rows 14-22 = encounter 2 data
const SAMPLE_CSV = `"Row Labels","Route 1","Iki Town","Route 2"
"Gifts/Trades","Rowlet (Starter, Held: Oran Berry) | Litten (Starter, Held: Oran Berry) | Popplio (Starter, Held: Oran Berry)","","Eevee (Gift from NPC)"
"Encounter 1 Name","Table 1 (Day) | Grass:","","Table 1 | Grass:"
"Encounter 1 Row 1","Encounters (Levels 3-5): Yungoos (10%), Rattata (Forme 1) (10%), Pikipek (10%), Grubbin (10%), Pichu (10%), Bounsweet (10%), Scatterbug (Forme 16) (10%), Swablu (10%), Igglybuff (10%), Sentret (10%)","","Encounters (Levels 4-6): Caterpie (40%), Metapod (30%), Butterfree (30%)"
"Encounter 1 Row 2","SOS Slot 1 (Levels 3-5): Yungoos (10%), Rattata (10%), Pikipek (10%), Grubbin (10%), Pichu (10%), Bounsweet (10%), Scatterbug (Forme 16) (10%), Swablu (10%), Buneary (10%), Sentret (10%)","","SOS Slot 1 (Levels 4-6): Caterpie (50%), Metapod (50%)"
"Encounter 1 Row 3","SOS Slot 2 (Levels 3-5): Yungoos (10%), Rattata (Forme 1) (10%), Pikipek (10%), Grubbin (10%), Pichu (10%), Bounsweet (10%), Scatterbug (Forme 16) (10%), Swablu (10%), Igglybuff (10%), Sentret (10%)","",""
"Encounter 1 Row 4","SOS Slot 3 (Levels 3-5): Yungoos (10%), Rattata (10%), Pikipek (10%), Grubbin (10%), Pichu (10%), Bounsweet (10%), Scatterbug (Forme 16) (10%), Swablu (10%), Buneary (10%), Sentret (10%)","",""
"Encounter 1 Row 5","SOS Slot 4 (Levels 3-5): Yungoos (10%), Rattata (Forme 1) (10%), Pikipek (10%), Grubbin (10%), Pichu (10%), Bounsweet (10%), Scatterbug (Forme 16) (10%), Swablu (10%), Igglybuff (10%), Sentret (10%)","",""
"Encounter 1 Row 6","SOS Slot 5 (Levels 3-5): Yungoos (10%), Rattata (10%), Pikipek (10%), Grubbin (10%), Pichu (10%), Bounsweet (10%), Scatterbug (Forme 16) (10%), Swablu (10%), Buneary (10%), Sentret (10%)","",""
"Encounter 1 Row 7","SOS Slot 6 (Levels 3-5): Yungoos (10%), Rattata (Forme 1) (10%), Pikipek (10%), Grubbin (10%), Pichu (10%), Bounsweet (10%), Scatterbug (Forme 16) (10%), Swablu (10%), Igglybuff (10%), Sentret (10%)","",""
"Encounter 1 Row 8","SOS Slot 7 (Levels 3-5): Yungoos (10%), Rattata (10%), Pikipek (10%), Grubbin (10%), Pichu (10%), Bounsweet (10%), Scatterbug (Forme 16) (10%), Swablu (10%), Buneary (10%), Sentret (10%)","",""
"Encounter 1 Row 9","Additional SOS encounters: (None)","",""
"Encounter 2 Name","Table 1 (Night) | Grass Night:","",""
"Encounter 2 Row 1","Encounters (Levels 3-5): Hoothoot (40%), Zubat (30%), Spinarak (30%)","",""
"Encounter 2 Row 2","SOS Slot 1 (Levels 3-5): Hoothoot (50%), Zubat (50%)","",""
"Encounter 2 Row 3","","",""
"Encounter 2 Row 4","","",""
"Encounter 2 Row 5","","",""
"Encounter 2 Row 6","","",""
"Encounter 2 Row 7","","",""
"Encounter 2 Row 8","","",""
"Encounter 2 Row 9","Additional SOS encounters: (None)","",""`;

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

function parseGiftsTrades(str) {
  if (!str || !str.trim() || str.trim().toLowerCase() === 'none') return [];
  const entries = str.split('|').map(s => s.trim()).filter(s => s);
  const result = [];
  for (const entry of entries) {
    const parenMatch = entry.match(/^(.+?)\s*\((.+)\)\s*$/);
    if (parenMatch) {
      result.push({ name: parenMatch[1].trim(), description: parenMatch[2].trim() });
    } else {
      result.push({ name: entry.trim(), description: '' });
    }
  }
  return result;
}

function parseLevelRange(str) {
  const match = str.match(/[Ll]ev(?:el)?s?\s*(\d+)(?:\s*-\s*(\d+))?/);
  if (!match) return null;
  return { min: parseInt(match[1], 10), max: parseInt(match[2] || match[1], 10) };
}

function parseEncounterEntry(entry) {
  entry = entry.trim();
  if (!entry) return null;
  const chanceMatch = entry.match(/^(.*)\s*\((\d+)%\)\s*$/);
  if (chanceMatch) {
    return { name: chanceMatch[1].trim(), chance: parseInt(chanceMatch[2], 10) };
  }
  return { name: entry, chance: null };
}

function parseEncounterDataRow(str) {
  if (!str || !str.trim()) return [];
  const colonIdx = str.indexOf(':');
  if (colonIdx < 0) return [];
  const pokemonPart = str.substring(colonIdx + 1).trim();
  if (!pokemonPart || pokemonPart.toLowerCase() === '(none)' || pokemonPart.toLowerCase() === 'none') {
    return [];
  }

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

function parseEncounterName(str) {
  if (!str || !str.trim()) return '';
  const parts = str.split('|');
  const name = parts[parts.length - 1].trim();
  return name.replace(/:+\s*$/, '').trim();
}

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
    if (lower.startsWith('additional sos')) continue;

    if (lower.startsWith('encounters') || lower.match(/^encounters\s*\(/i)) {
      const lr = parseLevelRange(row);
      if (lr) levelRange = lr;
      mainPokemon = parseEncounterDataRow(row);
    } else if (lower.match(/^sos\s+slot\s+\d+/i)) {
      sosLists.push(parseEncounterDataRow(row));
    }
  }

  if (!mainPokemon.length) return null;

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
    return { name: mon.name, chance: mon.chance, sos: Array.from(sosSet) };
  });

  return { spot: encounterName, levelRange, pokemon };
}

function convertSheetToEncounterData(rows) {
  if (rows.length < 2) return {};
  const result = {};
  const locationRow = rows[0] || [];
  const numColumns = Math.max(...rows.map(r => r.length));

  for (let col = 1; col < numColumns; col++) {
    const locationName = (locationRow[col] || '').trim();
    if (!locationName) continue;
    const locationId = toID(locationName);

    const giftsTradesRaw = rows[1] ? (rows[1][col] || '').trim() : '';
    const giftsTrades = parseGiftsTrades(giftsTradesRaw);

    const encounters = [];
    let rowIdx = 2;
    while (rowIdx < rows.length) {
      const nameCell = rows[rowIdx] ? (rows[rowIdx][col] || '').trim() : '';
      const dataRows = [];
      for (let d = 1; d <= 9; d++) {
        const dataIdx = rowIdx + d;
        dataRows.push(rows[dataIdx] ? (rows[dataIdx][col] || '').trim() : '');
      }
      if (nameCell) {
        const encounter = parseEncounterBlock(nameCell, dataRows);
        if (encounter) encounters.push(encounter);
      }
      rowIdx += 10;
    }

    result[locationId] = { giftsTrades, encounters };
  }

  return result;
}

// Run tests
console.log('Testing EncounterLocations parsing...\n');

const rows = parseCSV(SAMPLE_CSV);
console.log(`✓ Parsed ${rows.length} rows from CSV`);

const encounterData = convertSheetToEncounterData(rows);
const locationCount = Object.keys(encounterData).length;
console.log(`✓ Found encounter data for ${locationCount} location(s)\n`);

let allTestsPassed = true;

// Test 1: Correct number of locations
if (locationCount !== 3) {
  console.error(`✗ Expected 3 locations, got ${locationCount}`);
  allTestsPassed = false;
} else {
  console.log('✓ Correct number of locations (3)');
}

// Test 2: Route 1 gifts/trades
const route1 = encounterData['route1'];
if (!route1) {
  console.error('✗ Route 1 not found');
  allTestsPassed = false;
} else {
  if (!Array.isArray(route1.giftsTrades) || route1.giftsTrades.length !== 3) {
    console.error(`✗ Route 1: Expected 3 gifts/trades, got ${route1.giftsTrades ? route1.giftsTrades.length : 'N/A'}`);
    allTestsPassed = false;
  } else {
    console.log('✓ Route 1 has 3 gifts/trades');
  }

  const rowlet = route1.giftsTrades[0];
  if (!rowlet || rowlet.name !== 'Rowlet' || !rowlet.description.includes('Starter')) {
    console.error('✗ Route 1: Rowlet gift not parsed correctly:', rowlet);
    allTestsPassed = false;
  } else {
    console.log('✓ Route 1 Rowlet gift parsed correctly (name + description)');
  }
}

// Test 3: Route 1 has two encounters (day and night)
if (!route1 || !Array.isArray(route1.encounters)) {
  console.error('✗ Route 1 encounters not found');
  allTestsPassed = false;
} else {
  if (route1.encounters.length !== 2) {
    console.error(`✗ Route 1: Expected 2 encounters, got ${route1.encounters.length}`);
    allTestsPassed = false;
  } else {
    console.log('✓ Route 1 has 2 encounters (day and night)');
  }

  const grassEnc = route1.encounters[0];
  if (!grassEnc || grassEnc.spot !== 'Grass') {
    console.error('✗ Route 1: Expected "Grass" encounter name, got:', grassEnc && grassEnc.spot);
    allTestsPassed = false;
  } else {
    console.log('✓ Route 1 first encounter name is "Grass"');
  }

  if (grassEnc && (grassEnc.levelRange.min !== 3 || grassEnc.levelRange.max !== 5)) {
    console.error(`✗ Route 1 Grass: Expected levels 3-5, got ${grassEnc.levelRange.min}-${grassEnc.levelRange.max}`);
    allTestsPassed = false;
  } else {
    console.log('✓ Route 1 Grass level range is 3-5');
  }

  if (grassEnc && grassEnc.pokemon.length !== 10) {
    console.error(`✗ Route 1 Grass: Expected 10 pokemon, got ${grassEnc && grassEnc.pokemon.length}`);
    allTestsPassed = false;
  } else {
    console.log('✓ Route 1 Grass has 10 pokemon');
  }
}

// Test 4: SOS encounters - Rattata (Forme 1) should have Rattata as SOS
if (route1 && route1.encounters && route1.encounters[0]) {
  const grassEnc = route1.encounters[0];
  const rattataForme1 = grassEnc.pokemon.find(p => p.name === 'Rattata (Forme 1)');
  if (!rattataForme1) {
    console.error('✗ Rattata (Forme 1) not found in Route 1 Grass');
    allTestsPassed = false;
  } else if (!rattataForme1.sos.includes('Rattata')) {
    console.error('✗ Rattata (Forme 1) should have Rattata as SOS, got:', rattataForme1.sos);
    allTestsPassed = false;
  } else {
    console.log('✓ Rattata (Forme 1) has Rattata as SOS encounter');
  }

  // Yungoos should have no SOS (same pokemon in all SOS slots)
  const yungoos = grassEnc.pokemon.find(p => p.name === 'Yungoos');
  if (!yungoos) {
    console.error('✗ Yungoos not found in Route 1 Grass');
    allTestsPassed = false;
  } else if (yungoos.sos.length !== 0) {
    console.error('✗ Yungoos should have no SOS encounters, got:', yungoos.sos);
    allTestsPassed = false;
  } else {
    console.log('✓ Yungoos has no SOS encounters (same in all slots)');
  }

  // Igglybuff should have Buneary as SOS
  const igglybuff = grassEnc.pokemon.find(p => p.name === 'Igglybuff');
  if (!igglybuff) {
    console.error('✗ Igglybuff not found in Route 1 Grass');
    allTestsPassed = false;
  } else if (!igglybuff.sos.includes('Buneary')) {
    console.error('✗ Igglybuff should have Buneary as SOS, got:', igglybuff.sos);
    allTestsPassed = false;
  } else {
    console.log('✓ Igglybuff has Buneary as SOS encounter');
  }
}

// Test 5: Route 1 night encounter
if (route1 && route1.encounters && route1.encounters[1]) {
  const nightEnc = route1.encounters[1];
  if (nightEnc.spot !== 'Grass Night') {
    console.error(`✗ Route 1 night encounter: Expected "Grass Night", got "${nightEnc.spot}"`);
    allTestsPassed = false;
  } else {
    console.log('✓ Route 1 night encounter name is "Grass Night"');
  }

  if (nightEnc.pokemon.length !== 3) {
    console.error(`✗ Route 1 night: Expected 3 pokemon, got ${nightEnc.pokemon.length}`);
    allTestsPassed = false;
  } else {
    console.log('✓ Route 1 night encounter has 3 pokemon');
  }
}

// Test 6: Iki Town has no encounters and no gifts/trades
const ikiTown = encounterData['ikitown'];
if (!ikiTown) {
  console.error('✗ Iki Town not found');
  allTestsPassed = false;
} else {
  if (ikiTown.encounters.length !== 0) {
    console.error(`✗ Iki Town: Expected 0 encounters, got ${ikiTown.encounters.length}`);
    allTestsPassed = false;
  } else {
    console.log('✓ Iki Town has 0 encounters');
  }
  if (ikiTown.giftsTrades.length !== 0) {
    console.error(`✗ Iki Town: Expected 0 gifts/trades, got ${ikiTown.giftsTrades.length}`);
    allTestsPassed = false;
  } else {
    console.log('✓ Iki Town has 0 gifts/trades');
  }
}

// Test 7: Route 2 has gifts/trades and encounters
const route2 = encounterData['route2'];
if (!route2) {
  console.error('✗ Route 2 not found');
  allTestsPassed = false;
} else {
  if (!Array.isArray(route2.giftsTrades) || route2.giftsTrades.length !== 1) {
    console.error(`✗ Route 2: Expected 1 gift/trade, got ${route2.giftsTrades ? route2.giftsTrades.length : 'N/A'}`);
    allTestsPassed = false;
  } else {
    console.log('✓ Route 2 has 1 gift/trade');
  }

  const eevee = route2.giftsTrades[0];
  if (!eevee || eevee.name !== 'Eevee' || eevee.description !== 'Gift from NPC') {
    console.error('✗ Route 2: Eevee gift not parsed correctly:', eevee);
    allTestsPassed = false;
  } else {
    console.log('✓ Route 2 Eevee gift parsed correctly');
  }

  if (route2.encounters.length !== 1) {
    console.error(`✗ Route 2: Expected 1 encounter, got ${route2.encounters.length}`);
    allTestsPassed = false;
  } else {
    console.log('✓ Route 2 has 1 encounter');
  }
}

// Print summary
console.log('\n--- Generated Output (Route 1) ---');
console.log(JSON.stringify(encounterData['route1'], null, 2));

console.log('\n--- Test Summary ---');
if (allTestsPassed) {
  console.log('✓ All tests passed!');
  process.exit(0);
} else {
  console.error('✗ Some tests failed');
  process.exit(1);
}
