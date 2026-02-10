// Test script for Google Sheets location parsing
// This tests the parsing logic without requiring network access

const fs = require('fs');
const path = require('path');

function toID(text) {
  return String(text || '').toLowerCase().replace(/[^a-z0-9]+/g, '');
}

// Sample CSV data matching the expected Google Sheets format
const SAMPLE_CSV = `"Field Description","Route 1","Iki Town","Route 2"
"Name","Route 1","Iki Town","Route 2"
"Notes","Starting route where you begin your journey","Your peaceful home town","The second route with tougher Pokemon"
"Grass Encounters","(Levels 3-5): Yungoos (10%), Rattata (20%, SOS: Raticate), Pikachu (5%)","","(Levels 4-6): Pidgey (40%), Spearow (30%)"
"Cave Encounters","","",""
"Water Encounters","","","(Levels 5-10): Magikarp (100%)"
"Static Pokemon","","Meowth, Eevee",""
"Trainers","001, 002","","003, 004, 005"
"Boss Trainers","","010",""
"Gifts/Trades","","Starter Pokemon from Professor",""
"Shops","Potion - $200, Poké Ball - $200","","Super Potion - $700, Revive - $1500"
"Items","Potion x5 - From Mom, Poké Ball - Hidden in grass","Town Map - From Hau","Revive - On ground, Rare Candy x2 - Behind rock"`;

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
    
    const qtyMatch = itemPart.match(/(.+?)\s*[x×]\s*(\d+)/i);
    if (qtyMatch) {
      itemPart = qtyMatch[1].trim();
      quantity = parseInt(qtyMatch[2], 10);
    }
    
    items.push({ item: itemPart, quantity, obtain });
  }
  
  return items;
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
      giftsTrades: '',
      staticPokemon: [],
      trainers: [],
      bossTrainers: [],
      shops: [],
      items: []
    };
    
    for (let row = 0; row < rows.length; row++) {
      const field = fieldDescriptions[row].toLowerCase();
      const value = rows[row][col] ? rows[row][col].trim() : '';
      
      if (!value) continue;
      
      if (field.includes('name') && !field.includes('pokemon')) {
        location.name = value;
        location.id = toID(value);
      } else if (field.includes('notes') || field.includes('description')) {
        location.notes = value;
      } else if (field.includes('gifts') || field.includes('trades')) {
        location.giftsTrades = value;
      } else if (field.includes('static pokemon')) {
        location.staticPokemon = parseList(value);
      } else if (field.includes('boss trainer')) {
        location.bossTrainers = parseList(value);
      } else if (field.includes('trainer') && !field.includes('boss')) {
        location.trainers = parseList(value);
      } else if (field.includes('shop')) {
        location.shops = parseShops(value);
      } else if (field.includes('item') && !field.includes('pokemon')) {
        location.items = parseItems(value);
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
console.log('Testing Google Sheets location parsing...\n');

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
const expectedNames = ['Route 1', 'Iki Town', 'Route 2'];
const actualNames = locations.map(l => l.name);
if (JSON.stringify(actualNames) !== JSON.stringify(expectedNames)) {
  console.error(`✗ Location names mismatch. Expected: ${expectedNames}, Got: ${actualNames}`);
  allTestsPassed = false;
} else {
  console.log('✓ Location names correct');
}

// Test 3: Route 1 encounters
const route1 = locations.find(l => l.id === 'route1');
if (!route1) {
  console.error('✗ Route 1 not found');
  allTestsPassed = false;
} else {
  if (route1.encounters.length !== 1) {
    console.error(`✗ Route 1: Expected 1 encounter type, got ${route1.encounters.length}`);
    allTestsPassed = false;
  } else {
    const grassEncounter = route1.encounters[0];
    if (grassEncounter.pokemon.length !== 3) {
      console.error(`✗ Route 1: Expected 3 pokemon in grass, got ${grassEncounter.pokemon.length}`);
      allTestsPassed = false;
    } else {
      console.log('✓ Route 1 encounters correct');
    }
    
    // Check SOS chains
    const rattata = grassEncounter.pokemon.find(p => p.name === 'Rattata');
    if (!rattata || rattata.sos.length !== 1 || rattata.sos[0] !== 'Raticate') {
      console.error('✗ Route 1: Rattata SOS chain incorrect');
      allTestsPassed = false;
    } else {
      console.log('✓ Route 1 SOS chains correct');
    }
  }
}

// Test 4: Iki Town data
const ikiTown = locations.find(l => l.id === 'ikitown');
if (!ikiTown) {
  console.error('✗ Iki Town not found');
  allTestsPassed = false;
} else {
  if (ikiTown.staticPokemon.length !== 2) {
    console.error(`✗ Iki Town: Expected 2 static pokemon, got ${ikiTown.staticPokemon.length}`);
    allTestsPassed = false;
  } else if (ikiTown.staticPokemon[0] !== 'Meowth' || ikiTown.staticPokemon[1] !== 'Eevee') {
    console.error(`✗ Iki Town: Static pokemon incorrect: ${ikiTown.staticPokemon}`);
    allTestsPassed = false;
  } else {
    console.log('✓ Iki Town static pokemon correct');
  }
  
  if (ikiTown.bossTrainers.length !== 1 || ikiTown.bossTrainers[0] !== '010') {
    console.error(`✗ Iki Town: Boss trainers incorrect: ${ikiTown.bossTrainers}`);
    allTestsPassed = false;
  } else {
    console.log('✓ Iki Town boss trainers correct');
  }
}

// Test 5: Route 2 multiple encounter types
const route2 = locations.find(l => l.id === 'route2');
if (!route2) {
  console.error('✗ Route 2 not found');
  allTestsPassed = false;
} else {
  if (route2.encounters.length !== 2) {
    console.error(`✗ Route 2: Expected 2 encounter types, got ${route2.encounters.length}`);
    allTestsPassed = false;
  } else {
    console.log('✓ Route 2 multiple encounter types correct');
  }
  
  if (route2.trainers.length !== 3) {
    console.error(`✗ Route 2: Expected 3 trainers, got ${route2.trainers.length}`);
    allTestsPassed = false;
  } else {
    console.log('✓ Route 2 trainers correct');
  }
  
  if (route2.shops.length !== 2) {
    console.error(`✗ Route 2: Expected 2 shop items, got ${route2.shops.length}`);
    allTestsPassed = false;
  } else {
    console.log('✓ Route 2 shops correct');
  }
  
  if (route2.items.length !== 2) {
    console.error(`✗ Route 2: Expected 2 items, got ${route2.items.length}`);
    allTestsPassed = false;
  } else {
    const rareCandy = route2.items.find(i => i.item === 'Rare Candy');
    if (!rareCandy || rareCandy.quantity !== 2) {
      console.error(`✗ Route 2: Rare Candy quantity incorrect`);
      allTestsPassed = false;
    } else {
      console.log('✓ Route 2 items with quantities correct');
    }
  }
}

// Print full output for inspection
console.log('\n--- Generated Output ---');
console.log(JSON.stringify({ locations }, null, 2));

console.log('\n--- Test Summary ---');
if (allTestsPassed) {
  console.log('✓ All tests passed!');
  process.exit(0);
} else {
  console.error('✗ Some tests failed');
  process.exit(1);
}
