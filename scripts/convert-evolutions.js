const fs = require('fs');
const path = require('path');

// Helper function to convert text to ID format
const toID = (text) => String(text || '').toLowerCase().replace(/[^a-z0-9]+/g, '');

// Load Dictionary for name mappings
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

// Read Evolutions.txt
const evolutionsPath = path.join(__dirname, '..', 'data', 'rawtxt', 'Evolutions.txt');
let evolutionsRaw;
try {
  evolutionsRaw = fs.readFileSync(evolutionsPath, 'utf8');
} catch (err) {
  console.error('Failed to read Evolutions.txt:', err.message);
  process.exit(1);
}

const evolutions = {};
const lines = evolutionsRaw.split(/\r?\n/);
let currentPokemon = null;

function parseEvolutionLine(line, nameMap) {
  const evolutionsList = [];
  const parts = line.split(',').map(p => p.trim()).filter(p => p);

  for (const part of parts) {
    const evo = { target: '' };
    
    // Remove (@) markers that appear in some evolution data
    const cleanPart = part.replace(/\(\@\)/g, '').trim();

    // Check specific evolution types FIRST before general "Level Up"
    
    // Level Up with Friendship
    if (cleanPart.includes('Level Up with Friendship') && cleanPart.includes('into')) {
      const targetMatch = cleanPart.match(/into (.+)/i);
      if (targetMatch) {
        let targetName = targetMatch[1].trim();
        const normalizedName = targetName.replace(/-(\d+)$/, ' $1');
        if (nameMap[normalizedName]) {
          targetName = nameMap[normalizedName];
        }
        evo.target = toID(targetName);
        evo.condition = 'friendship';
        evolutionsList.push(evo);
      }
    }
    // Level Up with Move
    else if (cleanPart.includes('Level Up with Move') && cleanPart.includes('into')) {
      const moveMatch = cleanPart.match(/\[([^\]]+)\]/);
      const targetMatch = cleanPart.match(/into (.+)/i);
      if (targetMatch) {
        let targetName = targetMatch[1].trim();
        const normalizedName = targetName.replace(/-(\d+)$/, ' $1');
        if (nameMap[normalizedName]) {
          targetName = nameMap[normalizedName];
        }
        evo.target = toID(targetName);
        if (moveMatch) evo.condition = `knowing ${moveMatch[1]}`;
        evolutionsList.push(evo);
      }
    }
    // Level Up with Party
    else if (cleanPart.includes('Level Up with Party') && cleanPart.includes('into')) {
      const partyMatch = cleanPart.match(/\[([^\]]+)\]/);
      const targetMatch = cleanPart.match(/into (.+)/i);
      if (targetMatch) {
        let targetName = targetMatch[1].trim();
        const normalizedName = targetName.replace(/-(\d+)$/, ' $1');
        if (nameMap[normalizedName]) {
          targetName = nameMap[normalizedName];
        }
        evo.target = toID(targetName);
        if (partyMatch) evo.condition = `with ${partyMatch[1]} in party`;
        evolutionsList.push(evo);
      }
    }
    // General Level Up (with level number)
    else if (cleanPart.includes('Level Up') && cleanPart.includes('into')) {
      const levelMatch = cleanPart.match(/at level (\d+)/i);
      const targetMatch = cleanPart.match(/into (.+)/i);
      if (targetMatch) {
        let targetName = targetMatch[1].trim();
        // Normalize dash-number to space-number for dictionary lookup
        const normalizedName = targetName.replace(/-(\d+)$/, ' $1');
        // Apply dictionary mapping to target
        if (nameMap[normalizedName]) {
          targetName = nameMap[normalizedName];
        }
        evo.target = toID(targetName);
        if (levelMatch) evo.level = parseInt(levelMatch[1], 10);

        // Check for conditions
        if (cleanPart.includes('at Morning')) evo.condition = 'Morning';
        if (cleanPart.includes('at Night')) evo.condition = 'Night';
        if (cleanPart.includes('Female')) evo.condition = 'Female';
        if (cleanPart.includes('Male')) evo.condition = 'Male';
        if (cleanPart.match(/Attack\s*(<|>|=)\s*Defense/i)) {
          const condMatch = cleanPart.match(/(Attack\s*[<>=]\s*Defense)/i);
          if (condMatch) evo.condition = condMatch[1];
        }

        evolutionsList.push(evo);
      }
    }
    // Used Item
    else if (cleanPart.includes('Used Item') && cleanPart.includes('into')) {
      const itemMatch = cleanPart.match(/\[([^\]]+)\]/);
      const targetMatch = cleanPart.match(/into (.+)/i);
      if (targetMatch) {
        let targetName = targetMatch[1].trim();
        // Normalize dash-number to space-number for dictionary lookup
        const normalizedName = targetName.replace(/-(\d+)$/, ' $1');
        // Apply dictionary mapping to target
        if (nameMap[normalizedName]) {
          targetName = nameMap[normalizedName];
        }
        evo.target = toID(targetName);
        if (itemMatch) evo.item = itemMatch[1];
        evolutionsList.push(evo);
      }
    }
  }

  return evolutionsList;
}

for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();

  // Check for separator
  if (line.startsWith('|======')) {
    if (currentPokemon) {
      currentPokemon = null;
    }
    continue;
  }

  // Empty line
  if (!line) {
    if (currentPokemon) {
      currentPokemon = null;
    }
    continue;
  }

  // If we don't have a current Pokemon, this line is the Pokemon name
  if (!currentPokemon) {
    let pokemonName = line;
    if (nameMap[line]) {
      pokemonName = nameMap[line];
    }
    const id = toID(pokemonName);
    currentPokemon = id;
    continue;
  }

  // This line contains evolution data for currentPokemon
  const parsedEvos = parseEvolutionLine(line, nameMap);
  
  if (parsedEvos.length > 0) {
    if (!evolutions[currentPokemon]) {
      evolutions[currentPokemon] = [];
    }
    evolutions[currentPokemon].push(...parsedEvos);
  }
}

// Write output to evolutions.json
const outputPath = path.join(__dirname, '../data/evolutions.json');
fs.writeFileSync(outputPath, JSON.stringify(evolutions, null, 2));
console.log(`✓ Wrote evolutions.json with ${Object.keys(evolutions).length} Pokemon`);
console.log('Evolutions data has been written to data/evolutions.json');
