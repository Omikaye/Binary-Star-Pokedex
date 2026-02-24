// Test script for enhanced Google Sheets location parsing with battles
// This tests the new battle format parsing logic

const fs = require('fs');
const path = require('path');

function toID(text) {
  return String(text || '').toLowerCase().replace(/[^a-z0-9]+/g, '');
}

// Sample CSV data with new battle format
const SAMPLE_CSV = `"Field Description","Route 1","Hau'oli City","Melemele Meadow"
"Name","Route 1","Hau'oli City","Melemele Meadow"
"Location Notes","Starting route where you begin your journey. This Rattata is guaranteed to be your first catchable encounter here.","The main city on Melemele Island with shops and facilities","Beautiful meadow area with wild flowers"
"Shops","Pokemart Basic","Pokemart Basic, Boutique Hau'oli",""
"Battle 1","S154 - Static - Alolan Rattata Tutorial","491 - Story - Hau battle 1 | Rowlet Chosen","S023 - Static - Caterpie encounter"
"Battle 2","","492 - Story - Hau battle 2 | Litten Chosen","501 - Optional - Youngster on path"
"Battle 3","","","502 - Optional - Lass near flowers"
"Grass Encounters","(Levels 3-5): Yungoos (10%), Rattata (20%)","","(Levels 4-6): Caterpie (40%), Metapod (30%)"
"Trainers","","","010"
"Items","Potion x5 - From Kukui","Town Map - From Mom","Antidote - Hidden in grass"`;

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

function parseRange(str) {
  if (!str) return null;
  const cleaned = str.toString().trim();
  const m = cleaned.match(/(\d+)(?:-(\d+))?/);
  if (!m) return null;
  return { min: parseInt(m[1], 10), max: parseInt(m[2] || m[1], 10) };
}

function parsePokemonList(str) {
  if (!str || str.trim().toLowerCase() === 'none') return [];
  
  const pokemon = [];
  const re = /([^,(]+)\s*\(([^)]+)\)/g;
  let match;
  
  while ((match = re.exec(str)) !== null) {
    const name = match[1].trim();
    const inside = match[2];
    
    const parts = inside.split(/,\s*/);
    let chance = null;
    const sos = [];
    
    for (const part of parts) {
      const chanceMatch = part.match(/(\d+)%/);
      if (chanceMatch) {
        chance = parseInt(chanceMatch[1], 10);
      } else if (part.toLowerCase().startsWith('sos:')) {
        const sosList = part.replace(/^sos:\s*/i, '').trim();
        if (sosList) sos.push(...sosList.split(/\s*,\s*/));
      } else if (!chanceMatch && part.trim() && !part.includes('%')) {
        sos.push(part.trim());
      }
    }
    
    pokemon.push({ name, chance, sos });
  }
  
  return pokemon;
}

function parseList(str) {
  if (!str || str.trim().toLowerCase() === 'none') return [];
  return str.split(/\s*,\s*/).map(s => s.trim()).filter(s => s);
}

function parseShops(str) {
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
  if (!str || str.trim().toLowerCase() === 'none') return [];
  
  const items = [];
  const itemPattern = /([^,]+?\s*(?:[x×]\s*\d+)?\s*-\s*[^,]+?)(?=,|$)/g;
  const matches = str.match(itemPattern);
  
  if (!matches) return [];
  
  for (const entry of matches) {
    const match = entry.match(/^(.+?)\s*-\s*(.+)$/);
    if (!match) continue;
    
    let itemPart = match[1].trim();
    const obtain = match[2].trim();
    let quantity = 1;
    
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
  if (!str || str.trim().toLowerCase() === 'none') return [];
  return str.split(/\s*,\s*/).map(s => s.trim()).filter(s => s);
}

function parseGiftsTrades(str) {
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
  
  const fieldDescriptions = rows.map(row => row[0] ? row[0].trim() : '');
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
    
    for (let row = 0; row < rows.length; row++) {
      const field = fieldDescriptions[row].toLowerCase();
      const value = rows[row][col] ? rows[row][col].trim() : '';
      
      if (!value) continue;
      
      if (field.includes('name') && !field.includes('pokemon')) {
        location.name = value;
        location.id = toID(value);
      } else if (field.includes('location notes')) {
        location.notes = value;
      } else if (field === 'shops') {
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
        location.shops = parseShops(value);
      } else if (field.includes('item') && !field.includes('pokemon')) {
        location.items = parseItems(value);
      } else if (field.match(/^battle\s+\d+$/i)) {
        const battle = parseBattle(value);
        if (battle) {
          location.battles.push(battle);
        }
      } else if (field.includes('grass') || field.includes('cave') || 
                 field.includes('water') || field.includes('fishing') ||
                 field.includes('encounter')) {
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
    
    if (location.name) {
      locations.push(location);
    }
  }
  
  return locations;
}

// Run tests
console.log('Testing enhanced Google Sheets location parsing with battles...\n');

const rows = parseCSV(SAMPLE_CSV);
console.log(`✓ Parsed ${rows.length} rows from CSV`);

const locations = convertSheetToLocations(rows);
console.log(`✓ Converted ${locations.length} locations\n`);

// Verify results
let allTestsPassed = true;

// Test 1: Correct number of locations
if (locations.length !== 3) {
  console.error(`✗ Expected 3 locations, got ${locations.length}`);
  allTestsPassed = false;
} else {
  console.log('✓ Correct number of locations (3)');
}

// Test 2: Location names
const expectedNames = ['Route 1', "Hau'oli City", 'Melemele Meadow'];
const actualNames = locations.map(l => l.name);
if (JSON.stringify(actualNames) !== JSON.stringify(expectedNames)) {
  console.error(`✗ Location names mismatch. Expected: ${expectedNames}, Got: ${actualNames}`);
  allTestsPassed = false;
} else {
  console.log('✓ Location names correct');
}

// Test 3: Route 1 location notes
const route1 = locations.find(l => l.id === 'route1');
if (!route1) {
  console.error('✗ Route 1 not found');
  allTestsPassed = false;
} else {
  if (!route1.notes.includes('Starting route')) {
    console.error(`✗ Route 1: Location notes incorrect: ${route1.notes}`);
    allTestsPassed = false;
  } else {
    console.log('✓ Route 1 location notes correct');
  }
  
  // Test battle parsing
  if (route1.battles.length !== 1) {
    console.error(`✗ Route 1: Expected 1 battle, got ${route1.battles.length}`);
    allTestsPassed = false;
  } else {
    const battle = route1.battles[0];
    if (battle.id !== 'S154' || battle.tag !== 'Static' || !battle.notes.includes('Rattata')) {
      console.error(`✗ Route 1: Battle incorrectly parsed:`, battle);
      allTestsPassed = false;
    } else {
      console.log('✓ Route 1 battle with alphanumeric ID parsed correctly');
    }
  }
}

// Test 4: Hau'oli City shop tables and battles
const hauoliCity = locations.find(l => l.id === 'hauolicity');
if (!hauoliCity) {
  console.error("✗ Hau'oli City not found");
  allTestsPassed = false;
} else {
  if (hauoliCity.shopTables.length !== 2) {
    console.error(`✗ Hau'oli City: Expected 2 shop tables, got ${hauoliCity.shopTables.length}`);
    allTestsPassed = false;
  } else if (hauoliCity.shopTables[0] !== 'Pokemart Basic' || hauoliCity.shopTables[1] !== 'Boutique Hau\'oli') {
    console.error(`✗ Hau'oli City: Shop tables incorrect:`, hauoliCity.shopTables);
    allTestsPassed = false;
  } else {
    console.log("✓ Hau'oli City shop tables parsed correctly");
  }
  
  if (hauoliCity.battles.length !== 2) {
    console.error(`✗ Hau'oli City: Expected 2 battles, got ${hauoliCity.battles.length}`);
    allTestsPassed = false;
  } else {
    const battle1 = hauoliCity.battles[0];
    const battle2 = hauoliCity.battles[1];
    if (battle1.id !== '491' || battle1.tag !== 'Story' || !battle1.notes.includes('Rowlet')) {
      console.error(`✗ Hau'oli City: Battle 1 incorrectly parsed:`, battle1);
      allTestsPassed = false;
    } else if (battle2.id !== '492' || battle2.tag !== 'Story' || !battle2.notes.includes('Litten')) {
      console.error(`✗ Hau'oli City: Battle 2 incorrectly parsed:`, battle2);
      allTestsPassed = false;
    } else {
      console.log("✓ Hau'oli City battles with notes parsed correctly");
    }
  }
}

// Test 5: Melemele Meadow multiple battles
const meadow = locations.find(l => l.id === 'melemelemeadow');
if (!meadow) {
  console.error('✗ Melemele Meadow not found');
  allTestsPassed = false;
} else {
  if (meadow.battles.length !== 3) {
    console.error(`✗ Melemele Meadow: Expected 3 battles, got ${meadow.battles.length}`);
    allTestsPassed = false;
  } else {
    const staticBattle = meadow.battles[0];
    const optionalBattle1 = meadow.battles[1];
    const optionalBattle2 = meadow.battles[2];
    
    if (staticBattle.tag !== 'Static' || optionalBattle1.tag !== 'Optional' || optionalBattle2.tag !== 'Optional') {
      console.error('✗ Melemele Meadow: Battle tags incorrect');
      allTestsPassed = false;
    } else {
      console.log('✓ Melemele Meadow multiple battles with different tags parsed correctly');
    }
  }
}

// Print full output for inspection
console.log('\n--- Generated Output (First Location) ---');
console.log(JSON.stringify(locations[0], null, 2));

console.log('\n--- Test Summary ---');
if (allTestsPassed) {
  console.log('✓ All tests passed!');
  process.exit(0);
} else {
  console.error('✗ Some tests failed');
  process.exit(1);
}
