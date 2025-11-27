// Parse rawtxt/Locations.txt to data/locations.json
// Schema:
// {
//   locations: [
//     {
//       id: "route1", // toID(name)
//       name: "Route 1",
//       notes: "This route is orange.", // optional
//       encounters: [
//         {
//           spot: "Grass",
//           levelRange: { min: 13, max: 15 },
//           pokemon: [
//             { name: "Rufflet", chance: 10, sos: [] },
//             { name: "Vullaby", chance: 30, sos: ["Bagon", "Spearow"] }
//           ]
//         }
//       ],
//       giftsTrades: "Trader requests a Happiny in exchange for a Poipole",
//       staticPokemon: ["001", "003"],
//       trainers: ["004", "023", "024"],
//       bossTrainers: ["056"],
//       shops: [ { item: "Cherish Ball", price: "$300" } ],
//       items: [ { item: "Poké Ball", quantity: 10, obtain: "From Kukui after the capture tutorial" } ]
//     }
//   ]
// }

const fs = require('fs');
const path = require('path');

function toID(text) {
  return String(text || '').toLowerCase().replace(/[^a-z0-9]+/g, '');
}

const SRC = path.join(__dirname, '..', 'data', 'rawtxt', 'Locations.txt');
const OUT = path.join(__dirname, '..', 'data', 'locations.json');

if (!fs.existsSync(SRC)) {
  console.error('Source file not found:', SRC);
  process.exit(1);
}

const raw = fs.readFileSync(SRC, 'utf8');

// Split locations by blank line preceding Name: or by \n\nName:
// We iterate linearly building current location.
const lines = raw.split(/\r?\n/);

let locations = [];
let cur = null;
let inEncountersBlock = false;
let encounterLines = [];
let inShopsBlock = false;
let shopLines = [];
let inItemsBlock = false;
let itemLines = [];

function finalizeBlocks() {
  if (inEncountersBlock) {
    cur.encounters = parseEncounters(encounterLines);
  }
  if (inShopsBlock) {
    cur.shops = parseShops(shopLines);
  }
  if (inItemsBlock) {
    cur.items = parseItems(itemLines);
  }
  inEncountersBlock = false; encounterLines = [];
  inShopsBlock = false; shopLines = [];
  inItemsBlock = false; itemLines = [];
}

function startLocation(name) {
  if (cur) {
    finalizeBlocks();
    // Skip empty name entries
    if (cur.name && cur.name.trim() !== '') {
      locations.push(cur);
    }
  }
  cur = {
    id: toID(name),
    name: name,
    notes: '',
    encounters: [],
    giftsTrades: '',
    staticPokemon: [],
    trainers: [],
    bossTrainers: [],
    shops: [],
    items: [],
  };
}

function parseRange(str) {
  // (Levels 13-15)
  const m = str.match(/Levels?\s+(\d+)(?:-(\d+))?/i);
  if (!m) return null;
  return { min: parseInt(m[1],10), max: parseInt(m[2] || m[1],10) };
}

function parseEncounters(lines) {
  const spots = [];
  for (const line of lines) {
    if (!line.trim()) continue;
    // Format: SpotName: (Levels X-Y): Pokemon1 (10%), Pokemon2 (30%, SOS1, SOS2), ...
    const spotMatch = line.match(/^([^:]+):\s*\(Levels[^)]*\):\s*(.*)$/i);
    if (!spotMatch) continue;
    const spotName = spotMatch[1].trim();
    const levelRange = parseRange(spotMatch[0]);
    const rest = spotMatch[2].trim();
    const entries = rest.split(/\s*,\s*/); // split by comma but SOS lists inside parentheses included as single entry first, so we need a smarter parser.
    // We'll re-scan using pattern: Name ( ... )
    const pokemon = [];
    let idx = 0;
    // Re-tokenize using regex global
    const re = /([^,]+?\([^)]*\))(?=\s*,|$)/g;
    const matches = rest.match(re);
    const tokens = matches || [];
    for (const token of tokens) {
      // token like: Vullaby (30%, Bagon, Spearow) OR Pidgey (60%)
      const nameMatch = token.match(/^([^()]+)\(([^)]*)\)$/);
      if (!nameMatch) continue;
      const pokeName = nameMatch[1].trim();
      const inside = nameMatch[2].split(/\s*,\s*/);
      if (!inside.length) continue;
      // First element should contain chance (e.g. 10%)
      const chancePart = inside[0].trim();
      const chanceNumMatch = chancePart.match(/(\d+)/);
      const chance = chanceNumMatch ? parseInt(chanceNumMatch[1],10) : null;
      const sos = inside.slice(1).filter(x => x && !x.match(/\d+%/));
      pokemon.push({ name: pokeName, chance: chance, sos });
    }
    spots.push({ spot: spotName, levelRange, pokemon });
  }
  return spots;
}

function parseShops(lines) {
  const out = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.toLowerCase() === 'none') continue;
    // Expect: Item <tab or multiple spaces> Price
    const parts = trimmed.split(/\t+/);
    if (parts.length === 1) {
      // fallback split by two or more spaces
      const sp = trimmed.split(/\s{2,}/);
      if (sp.length >= 2) {
        out.push({ item: sp[0].trim(), price: sp[1].trim() });
        continue;
      }
    }
    if (parts.length >= 2) out.push({ item: parts[0].trim(), price: parts[1].trim() });
  }
  return out;
}

function parseItems(lines) {
  const out = [];
  for (const line of lines) {
    let trimmed = line.trim();
    if (!trimmed || trimmed.toLowerCase() === 'none') continue;
    // Pattern: Item [x|×]N <tab or two+ spaces> Obtain text
    // Extract quantity suffix
    let itemPart = trimmed;
    let obtainPart = '';
    const tabSplit = trimmed.split(/\t+/);
    if (tabSplit.length >= 2) {
      itemPart = tabSplit[0].trim();
      obtainPart = tabSplit.slice(1).join(' ').trim();
    } else {
      const spaceSplit = trimmed.split(/\s{2,}/);
      if (spaceSplit.length >= 2) {
        itemPart = spaceSplit[0].trim();
        obtainPart = spaceSplit.slice(1).join(' ').trim();
      }
    }
    // Default quantity is 1 if unspecified
    let quantity = 1;
    // Quantity may be in formats: "x900", "×10", or with space as in "x 100"
    const qtyMatch = itemPart.match(/(.+?)[x×]\s*(\d+)/i);
    let itemName = itemPart;
    if (qtyMatch) {
      itemName = qtyMatch[1].trim();
      quantity = parseInt(qtyMatch[2],10);
    }
    out.push({ item: itemName, quantity, obtain: obtainPart });
  }
  return out;
}

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.startsWith('Name:')) {
    const nameMatch = line.match(/^Name:\s*"(.*)"/);
    const name = nameMatch ? nameMatch[1] : line.replace('Name:', '').trim();
    startLocation(name);
    continue;
  }
  if (!cur) continue; // skip until first Name

  if (line.startsWith('Extra Notes:')) {
    const m = line.match(/^Extra Notes:\s*"(.*)"/);
    cur.notes = m ? m[1] : line.replace('Extra Notes:', '').trim();
    continue;
  }
  if (line.startsWith('Encounters:')) {
    inEncountersBlock = true;
    encounterLines = [];
    continue;
  }
  if (inEncountersBlock) {
    if (line.trim() === '}') {
      inEncountersBlock = false;
      cur.encounters = parseEncounters(encounterLines);
      continue;
    } else {
      encounterLines.push(line);
      continue;
    }
  }
  if (line.startsWith('Gifts/Trades:')) {
    cur.giftsTrades = line.replace('Gifts/Trades:', '').trim();
    continue;
  }
  if (line.startsWith('Static Pokemon:')) {
    const inside = line.match(/\(([^)]*)\)/);
    cur.staticPokemon = inside && inside[1].trim() ? inside[1].split(/\s*,\s*/).filter(x=>x) : [];
    continue;
  }
  if (line.startsWith('Trainers:')) {
    const inside = line.match(/\(([^)]*)\)/);
    cur.trainers = inside && inside[1].trim() ? inside[1].split(/\s*,\s*/).filter(x=>x) : [];
    continue;
  }
  if (line.startsWith('Boss Trainers:')) {
    const inside = line.match(/\(([^)]*)\)/);
    cur.bossTrainers = inside && inside[1].trim() ? inside[1].split(/\s*,\s*/).filter(x=>x) : [];
    continue;
  }
  if (line.startsWith('Shops:')) {
    inShopsBlock = true; shopLines = []; continue;
  }
  if (inShopsBlock) {
    if (line.trim() === '}') { inShopsBlock = false; cur.shops = parseShops(shopLines); continue; }
    shopLines.push(line); continue;
  }
  if (line.startsWith('Items:')) {
    inItemsBlock = true; itemLines = []; continue;
  }
  if (inItemsBlock) {
    if (line.trim() === '}') { inItemsBlock = false; cur.items = parseItems(itemLines); continue; }
    itemLines.push(line); continue;
  }
}

// Push last
if (cur) {
  finalizeBlocks();
  if (cur.name && cur.name.trim() !== '') locations.push(cur);
}

// Remove empty notes/giftsTrades arrays if blank for cleanliness? Keep for consistency.

const output = { locations };
fs.writeFileSync(OUT, JSON.stringify(output, null, 2), 'utf8');
console.log('Wrote', OUT, 'with', locations.length, 'locations');
