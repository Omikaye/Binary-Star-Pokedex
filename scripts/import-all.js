const fs = require('fs');
const path = require('path');

console.log('========================================');
console.log('MASTER DATA IMPORT');
console.log('========================================\n');

// Helper function
const toID = (text) => String(text || '').toLowerCase().replace(/[^a-z0-9]+/g, '');

// ============================================
// STEP 0: Load Dictionary (form name conversions) & Mega Evolutions
// ============================================
const dictionaryPath = path.join(__dirname, '..', 'data', 'rawtxt', 'Dictionary.cs');
let nameMap = {};
try {
  const dictRaw = fs.readFileSync(dictionaryPath, 'utf8');
  // Parse lines like { "Key",    "Value" }
  const dictRegex = /{\s*"([^"]+)",\s*"([^"]+)"\s*}/g;
  let m;
  while ((m = dictRegex.exec(dictRaw))) {
    nameMap[m[1]] = m[2];
  }
  console.log(`Loaded ${Object.keys(nameMap).length} dictionary form mappings`);
} catch (e) {
  console.warn('Dictionary.cs not found or unreadable; proceeding without form renames');
}

// Parse MegaEvolutions.txt to gather required items for forms
const megaPath = path.join(__dirname, '..', 'data', 'rawtxt', 'MegaEvolutions.txt');
let megaFormItems = {}; // finalFormName -> [item]
let megaBaseToForms = {}; // baseSpecies -> Set(formFinalName)
try {
  const megaRaw = fs.readFileSync(megaPath, 'utf8');
  const megaLines = megaRaw.split(/\r?\n/);
  let currentBase = null;
  for (let i = 0; i < megaLines.length; i++) {
    const line = megaLines[i].trim();
    if (!line) continue;
    if (line === '======') { continue; }
    // Base species line pattern: "<num> <Species Name>"
    const baseMatch = line.match(/^(\d+)\s+(.+)$/);
    if (baseMatch) {
      currentBase = baseMatch[2].trim();
      continue;
    }
    if (currentBase && line.startsWith('Can Mega Evolve into')) {
      const evMatch = line.match(/^Can Mega Evolve into (.+?) if its held item is (.+?)\.?$/);
      if (evMatch) {
        const formKey = evMatch[1].trim();
        const item = evMatch[2].trim();
        const finalName = nameMap[formKey] || formKey;
        megaFormItems[finalName] = [item];
        const baseSpecies = finalName.includes('-') ? finalName.split('-')[0] : finalName;
        if (!megaBaseToForms[baseSpecies]) megaBaseToForms[baseSpecies] = new Set();
        megaBaseToForms[baseSpecies].add(finalName);
      }
    }
  }
  console.log(`Parsed ${Object.keys(megaFormItems).length} mega form item mappings`);
} catch (e) {
  console.warn('MegaEvolutions.txt not found or unreadable; proceeding without mega requiredItems');
}

// ============================================
// STEP 1: Import PokedexEntries.txt
// ============================================
console.log('STEP 1: Importing PokedexEntries.txt to pokedex.json...');

const pokedexEntriesPath = path.join(__dirname, '..', 'data', 'rawtxt', 'PokedexEntries.txt');
const pokedexPath = path.join(__dirname, '..', 'data', 'pokedex.json');

let rawData;
try {
  rawData = fs.readFileSync(pokedexEntriesPath, 'utf8');
} catch (err) {
  console.error('Failed to read PokedexEntries.txt:', err.message);
  process.exit(1);
}

let entries;
try {
  entries = JSON.parse(rawData);
} catch (err) {
  console.error('Failed to parse PokedexEntries.txt as JSON:', err.message);
  process.exit(1);
}

const pokedex = {};
let convertedCount = 0;

// Build map of base species numbers as we go (after rename) so we can normalize num for forms
const baseNums = {};

for (const entry of entries) {
  if (!entry.name) continue;

  let originalName = entry.name;
  // Apply dictionary rename if present
  if (nameMap[originalName]) {
    entry.name = nameMap[originalName];
  }

  // Special handling for Nidoran with gender symbols
  if (entry.num === 29) {
    entry.name = 'Nidoran-F';
  } else if (entry.num === 32) {
    entry.name = 'Nidoran-M';
  }

  const id = toID(entry.name);
  if (!id) continue;

  // Determine base species (portion before first hyphen) for forms
  // Special case: Nidoran-F and Nidoran-M are separate species, not forms
  // Special case: Minior forms all share the same base species
  // Special case: Floette forms all share the same base species
  let baseSpecies;
  if (entry.name === 'Nidoran-F' || entry.name === 'Nidoran-M') {
    baseSpecies = entry.name; // Treat as their own base species
  } else if (entry.name.startsWith('Minior')) {
    baseSpecies = 'Minior'; // All Minior forms share base species
  } else if (entry.name.startsWith('Floette')) {
    baseSpecies = 'Floette'; // All Floette forms share base species
  } else {
    baseSpecies = entry.name.includes('-') ? entry.name.split('-')[0] : entry.name;
  }
  
  // Record base species num if this entry looks like the base (exact match and not previously recorded)
  if (!entry.name.includes('-') || entry.name === 'Nidoran-F' || entry.name === 'Nidoran-M') {
    if (entry.num) baseNums[baseSpecies] = entry.num;
  }
  
  // Special case: Minior forms all use dex number 774
  if (entry.name.startsWith('Minior')) {
    baseNums['Minior'] = 774;
  }
  
  // Special case: Floette forms all use dex number 670
  if (entry.name.startsWith('Floette')) {
    baseNums['Floette'] = 670;
  }

  // Convert gender field
  let genderData = {};
  if (entry.gender !== undefined) {
    const genderValue = entry.gender;
    if (genderValue === 255) {
      genderData = { gender: 'N' }; // Genderless
    } else if (genderValue === 0) {
      genderData = { gender: 'M' }; // Male only
    } else if (genderValue === 254) {
      genderData = { gender: 'F' }; // Female only
    } else {
      // Calculate ratio and round to nearest 0.5
      const femaleRatio = genderValue / 254;
      const maleRatio = 1 - femaleRatio;
      genderData = {
        genderRatio: {
          M: Math.round(maleRatio * 2) / 2,
          F: Math.round(femaleRatio * 2) / 2
        }
      };
    }
  }

  // Convert egggroup to eggGroups array
  let eggGroups = [];
  if (entry.egggroup) {
    eggGroups = Array.isArray(entry.egggroup) ? entry.egggroup : [entry.egggroup];
    eggGroups = eggGroups.filter(g => g && g !== '---');
  }

  // Normalize num for forms to base species num if available
  const normalizedNum = baseNums[baseSpecies] !== undefined ? baseNums[baseSpecies] : (entry.num || 0);

  pokedex[id] = {
    num: normalizedNum,
    name: entry.name,
    types: entry.types || [],
    abilities: entry.abilities || {},
    baseStats: entry.baseStats || { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
    heightm: entry.heightm || 0,
    weightkg: entry.weightkg || 0,
    eggGroups: eggGroups,
    ...genderData
  };

  // Store TM and tutor arrays temporarily for later merge into learnsets
  if (entry.tms && entry.tms.length > 0) {
    pokedex[id]._tempTMs = entry.tms;
  }
  if (entry.tutors && entry.tutors.length > 0) {
    pokedex[id]._tempTutors = entry.tutors;
  }

  convertedCount++;
}

console.log(`✓ Converted ${convertedCount} Pokémon entries\n`);

// ============================================
// STEP 1B: Attach formes structures & requiredItems for mega forms
// ============================================
console.log('STEP 1B: Building formes metadata...');
// First gather all names per base species
const formesMap = {}; // baseSpecies -> Set(form names including base)
for (const key of Object.keys(pokedex)) {
  const data = pokedex[key];
  const name = data.name;
  const base = name.includes('-') ? name.split('-')[0] : name;
  if (!formesMap[base]) formesMap[base] = new Set();
  formesMap[base].add(base); // ensure base present
  if (name !== base) formesMap[base].add(name);
}

// Apply mega forms discovered from MegaEvolutions.txt (may include forms not in entries yet)
for (const base of Object.keys(megaBaseToForms)) {
  if (!formesMap[base]) formesMap[base] = new Set([base]);
  for (const formName of megaBaseToForms[base]) {
    formesMap[base].add(formName);
    // If form not yet in pokedex (no stats in dump), create minimal placeholder
    const formID = toID(formName);
    if (!pokedex[formID]) {
      pokedex[formID] = {
        num: pokedex[toID(base)] ? pokedex[toID(base)].num : 0,
        name: formName,
        types: pokedex[toID(base)] ? pokedex[toID(base)].types : [],
        abilities: pokedex[toID(base)] ? pokedex[toID(base)].abilities : {},
        baseStats: pokedex[toID(base)] ? pokedex[toID(base)].baseStats : { hp:0, atk:0, def:0, spa:0, spd:0, spe:0 },
        heightm: pokedex[toID(base)] ? pokedex[toID(base)].heightm : 0,
        weightkg: pokedex[toID(base)] ? pokedex[toID(base)].weightkg : 0,
        eggGroups: pokedex[toID(base)] ? pokedex[toID(base)].eggGroups : [],
      };
    }
  }
}

// Now enrich each entry
for (const key of Object.keys(pokedex)) {
  const entry = pokedex[key];
  const name = entry.name;
  const base = name.includes('-') ? name.split('-')[0] : name;
  const allFormes = Array.from(formesMap[base]);
  if (allFormes.length > 1) {
    entry.formes = allFormes;
    if (name !== base) {
      // This is a form
      entry.baseSpecies = base;
      entry.forme = name.substring(base.length + 1); // part after first hyphen
      if (megaFormItems[name]) {
        entry.requiredItems = megaFormItems[name];
      }
    }
  } else {
    // Single species – ensure no stale form fields
    delete entry.formes;
    delete entry.baseSpecies;
    delete entry.forme;
    delete entry.requiredItems;
  }
}
console.log('✓ Formes metadata attached\n');

// ============================================
// STEP 2: Import Evolutions.txt
// ============================================
console.log('STEP 2: Importing Evolutions.txt to pokedex.json...');

const evolutionsPath = path.join(__dirname, '..', 'data', 'rawtxt', 'Evolutions.txt');
let evolutionsRaw;
try {
  evolutionsRaw = fs.readFileSync(evolutionsPath, 'utf8');
} catch (err) {
  console.error('Failed to read Evolutions.txt:', err.message);
  process.exit(1);
}

const lines = evolutionsRaw.split(/\r?\n/);
let currentPokemon = null;
let evoCount = 0;

function parseEvolutionLine(line, nameMap) {
  const evolutions = [];
  const parts = line.split(',').map(p => p.trim()).filter(p => p);

  for (const part of parts) {
    const evo = { target: '' };

    // Level Up
    if (part.includes('Level Up') && part.includes('into')) {
      const levelMatch = part.match(/at level (\d+)/i);
      const targetMatch = part.match(/into (.+)/i);
      if (targetMatch) {
        let targetName = targetMatch[1].trim();
        // Normalize dash to space for dictionary lookup (Evolutions use "Raticate-1" but Dictionary has "Raticate 1")
        const normalizedName = targetName.replace(/-(\d+)$/, ' $1');
        // Apply dictionary mapping to target
        if (nameMap[normalizedName]) {
          console.log(`  Evolution target mapped: "${targetName}" (normalized: "${normalizedName}") -> "${nameMap[normalizedName]}"`);
          targetName = nameMap[normalizedName];
        }
        evo.target = toID(targetName);
        if (levelMatch) evo.level = parseInt(levelMatch[1], 10);

        // Check for conditions
        if (part.includes('at Morning')) evo.condition = 'Morning';
        if (part.includes('at Night')) evo.condition = 'Night';
        if (part.includes('Female')) evo.condition = 'Female';
        if (part.includes('Male')) evo.condition = 'Male';
        if (part.match(/Attack\s*(<|>|=)\s*Defense/i)) {
          const condMatch = part.match(/(Attack\s*[<>=]\s*Defense)/i);
          if (condMatch) evo.condition = condMatch[1];
        }

        evolutions.push(evo);
      }
    }
    // Used Item
    else if (part.includes('Used Item') && part.includes('into')) {
      const itemMatch = part.match(/\[([^\]]+)\]/);
      const targetMatch = part.match(/into (.+)/i);
      if (targetMatch) {
        let targetName = targetMatch[1].trim();
        // Normalize dash to space for dictionary lookup (Evolutions use "Raticate-1" but Dictionary has "Raticate 1")
        const normalizedName = targetName.replace(/-(\d+)$/, ' $1');
        // Apply dictionary mapping to target
        if (nameMap[normalizedName]) {
          console.log(`  Evolution target mapped: "${targetName}" (normalized: "${normalizedName}") -> "${nameMap[normalizedName]}"`);
          targetName = nameMap[normalizedName];
        }
        evo.target = toID(targetName);
        if (itemMatch) evo.item = itemMatch[1];
        evolutions.push(evo);
      }
    }
    // Level Up with Move
    else if (part.includes('Level Up with Move') && part.includes('into')) {
      const moveMatch = part.match(/\[([^\]]+)\]/);
      const targetMatch = part.match(/into (.+)/i);
      if (targetMatch) {
        let targetName = targetMatch[1].trim();
        // Normalize dash to space for dictionary lookup
        const normalizedName = targetName.replace(/-(\d+)$/, ' $1');
        // Apply dictionary mapping to target
        if (nameMap[normalizedName]) {
          targetName = nameMap[normalizedName];
        }
        evo.target = toID(targetName);
        if (moveMatch) evo.condition = `knowing ${moveMatch[1]}`;
        evolutions.push(evo);
      }
    }
    // Level Up with Party
    else if (part.includes('Level Up with Party') && part.includes('into')) {
      const partyMatch = part.match(/\[([^\]]+)\]/);
      const targetMatch = part.match(/into (.+)/i);
      if (targetMatch) {
        let targetName = targetMatch[1].trim();
        // Normalize dash to space for dictionary lookup
        const normalizedName = targetName.replace(/-(\d+)$/, ' $1');
        // Apply dictionary mapping to target
        if (nameMap[normalizedName]) {
          targetName = nameMap[normalizedName];
        }
        evo.target = toID(targetName);
        if (partyMatch) evo.condition = `with ${partyMatch[1]} in party`;
        evolutions.push(evo);
      }
    }
  }

  return evolutions;
}

for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();

  // Check for separator
  if (line.startsWith('|======')) {
    // Process previous Pokemon if exists
    if (currentPokemon) {
      currentPokemon = null;
    }
    continue;
  }

  // Empty line
  if (!line) {
    if (currentPokemon) {
      // Pokemon with no evolutions - reset
      currentPokemon = null;
    }
    continue;
  }

  // If we don't have a current Pokemon, this line is the Pokemon name
  if (!currentPokemon) {
    // The raw line might be "Rattata" or "Rattata 1" etc.
    // Apply dictionary rename to match the renamed entry in pokedex
    let pokemonName = line;
    if (nameMap[line]) {
      pokemonName = nameMap[line];
    }
    const id = toID(pokemonName);
    if (pokedex[id]) {
      currentPokemon = id;
    } else {
      // If not found, log for debugging but don't error
      // console.warn(`Evolution entry for "${line}" (mapped to "${pokemonName}") not found in pokedex`);
    }
    continue;
  }

  // This line contains evolution data for currentPokemon
  const parsedEvos = parseEvolutionLine(line, nameMap);
  
  // Filter out invalid targets
  const validEvos = parsedEvos.filter(evo => {
    if (!pokedex[evo.target]) {
      return false;
    }
    return true;
  });
  
  if (validEvos.length > 0) {
    if (!pokedex[currentPokemon].evos) {
      pokedex[currentPokemon].evos = [];
    }
    pokedex[currentPokemon].evos.push(...validEvos);
    evoCount += validEvos.length;
  }
}

console.log(`✓ Added ${evoCount} evolution entries\n`);

// Write pokedex
fs.writeFileSync(pokedexPath, JSON.stringify(pokedex, null, 2));
console.log(`✓ Wrote pokedex.json (${Object.keys(pokedex).length} Pokémon)\n`);

// ============================================
// STEP 3: Import LevelUpMoves.txt
// ============================================
console.log('STEP 3: Importing LevelUpMoves.txt to learnsets.json...');

const levelUpMovesPath = path.join(__dirname, '..', 'data', 'rawtxt', 'LevelUpMoves.txt');
const learnsetsPath = path.join(__dirname, '..', 'data', 'learnsets.json');

let levelUpRaw;
try {
  levelUpRaw = fs.readFileSync(levelUpMovesPath, 'utf8');
} catch (err) {
  console.error('Failed to read LevelUpMoves.txt:', err.message);
  process.exit(1);
}

const learnsets = {};
const moveLines = levelUpRaw.split(/\r?\n/);
let currentMon = null;
let moveCount = 0;

for (const line of moveLines) {
  const trimmed = line.trim();

  if (trimmed.startsWith('------')) {
    currentMon = null;
    continue;
  }

  if (!trimmed) continue;

  if (!currentMon) {
    const id = toID(trimmed);
    if (pokedex[id]) {
      currentMon = id;
      learnsets[id] = [];
    }
    continue;
  }

  // Parse moves: "1 - Tackle, 3 - Growl, ..."
  const moveParts = trimmed.split(',').map(p => p.trim()).filter(p => p);
  for (const part of moveParts) {
    const match = part.match(/^(\d+)\s*-\s*(.+)$/);
    if (match) {
      const level = parseInt(match[1], 10);
      const moveName = match[2].trim();
      learnsets[currentMon].push({
        move: moveName,
        how: 'lvl',
        level: level
      });
      moveCount++;
    }
  }
}

console.log(`✓ Added ${moveCount} level-up moves\n`);

// ============================================
// STEP 4: Merge TM and Tutor moves
// ============================================
console.log('STEP 4: Merging TM and Tutor moves from pokedex to learnsets...');

let tmCount = 0;
let tutorCount = 0;

for (const [id, data] of Object.entries(pokedex)) {
  if (!learnsets[id]) {
    learnsets[id] = [];
  }

  // Add TMs
  if (data._tempTMs && data._tempTMs.length > 0) {
    for (const move of data._tempTMs) {
      if (!learnsets[id].some(m => m.move === move && m.how === 'tm')) {
        learnsets[id].push({ move, how: 'tm' });
        tmCount++;
      }
    }
    delete data._tempTMs; // Clean up temp field
  }

  // Add Tutors
  if (data._tempTutors && data._tempTutors.length > 0) {
    for (const move of data._tempTutors) {
      if (!learnsets[id].some(m => m.move === move && m.how === 'tutor')) {
        learnsets[id].push({ move, how: 'tutor' });
        tutorCount++;
      }
    }
    delete data._tempTutors; // Clean up temp field
  }
}

console.log(`✓ Added ${tmCount} TM moves`);
console.log(`✓ Added ${tutorCount} Tutor moves\n`);

// Write learnsets
fs.writeFileSync(learnsetsPath, JSON.stringify(learnsets, null, 2));
console.log(`✓ Wrote learnsets.json (${Object.keys(learnsets).length} Pokémon)\n`);

// ============================================
// STEP 5: Final cleanup - rewrite pokedex without temp fields
// ============================================
console.log('STEP 5: Final cleanup...');
fs.writeFileSync(pokedexPath, JSON.stringify(pokedex, null, 2));
console.log(`✓ Cleaned up pokedex.json\n`);

// ============================================
// Summary
// ============================================
console.log('========================================');
console.log('IMPORT COMPLETE!');
console.log('========================================');
console.log(`Pokémon imported: ${Object.keys(pokedex).length}`);
console.log(`Evolutions added: ${evoCount}`);
console.log(`Level-up moves: ${moveCount}`);
console.log(`TM moves: ${tmCount}`);
console.log(`Tutor moves: ${tutorCount}`);
console.log(`Total learnset entries: ${Object.keys(learnsets).length}`);
console.log('========================================\n');
