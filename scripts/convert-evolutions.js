#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const pdxPath = path.join(repoRoot, 'data', 'pokedex.json');
const evoPath = path.join(repoRoot, 'data', 'rawtxt', 'Evolutions.txt');

function toID(text) {
  if (text === undefined || text === null) return '';
  return String(text).toLowerCase().replace(/[^a-z0-9]+/g, '');
}

function ensureBackup(filePath) {
  try {
    const bakPath = filePath + '.bak';
    if (!fs.existsSync(bakPath)) {
      fs.copyFileSync(filePath, bakPath);
      console.log('Backup created:', bakPath);
    }
  } catch (e) {
    console.warn('Could not create backup for', filePath, e.message);
  }
}

function parseEvolutionLine(line) {
  // Parse evolution entries like:
  // "Level Up at level 22 into Ivysaur, "
  // "Used Item [Kanto Badge] into Raichu, "
  // "Level Up Female at level 14 into Silcoon, "
  // "Level Up (Attack < Defense) at level 25 into Hitmonchan, "
  
  const evos = [];
  const parts = line.split(',').map(s => s.trim()).filter(Boolean);
  
  for (const part of parts) {
    const evo = {};
    
    // Extract target (the pokemon name after "into")
    const intoMatch = part.match(/into\s+([^,]+)/i);
    if (!intoMatch) continue;
    
    evo.target = toID(intoMatch[1].trim());
    if (!evo.target) continue;
    
    // Check for level-up evolution
    const levelMatch = part.match(/level\s+(\d+)/i);
    if (levelMatch) {
      evo.level = parseInt(levelMatch[1], 10);
    }
    
    // Check for item evolution
    const itemMatch = part.match(/\[([^\]]+)\]/);
    if (itemMatch) {
      evo.item = itemMatch[1].trim();
    }
    
    // Check for trade evolution
    if (/trade/i.test(part)) {
      evo.condition = 'trade';
    }
    
    // Check for friendship evolution
    if (/friendship/i.test(part)) {
      evo.condition = 'friendship';
    }
    
    // Check for move-based evolution
    const moveMatch = part.match(/with\s+move\s+\[([^\]]+)\]/i);
    if (moveMatch) {
      evo.condition = `knows ${moveMatch[1].trim()}`;
    }
    
    // Check for party-based evolution
    const partyMatch = part.match(/with\s+party\s+\[([^\]]+)\]/i);
    if (partyMatch) {
      evo.condition = `with ${partyMatch[1].trim()} in party`;
    }
    
    // Check for time-of-day evolution
    if (/morning/i.test(part)) {
      evo.condition = (evo.condition ? evo.condition + ', morning' : 'morning');
    }
    if (/night/i.test(part)) {
      evo.condition = (evo.condition ? evo.condition + ', night' : 'night');
    }
    
    // Check for gender-specific evolution
    if (/female/i.test(part) && !/level\s+female/i.test(part)) {
      evo.condition = (evo.condition ? evo.condition + ', female only' : 'female only');
    }
    if (/male/i.test(part) && !/level\s+male/i.test(part)) {
      evo.condition = (evo.condition ? evo.condition + ', male only' : 'male only');
    }
    
    // Check for stat-based evolution (Tyrogue)
    const statMatch = part.match(/\(([^)]+)\)/);
    if (statMatch && /attack|defense/i.test(statMatch[1])) {
      evo.condition = statMatch[1].trim();
    }
    
    evos.push(evo);
  }
  
  return evos;
}

function main() {
  if (!fs.existsSync(pdxPath)) {
    console.error('pokedex.json not found at', pdxPath);
    process.exit(1);
  }
  if (!fs.existsSync(evoPath)) {
    console.error('Evolutions.txt not found at', evoPath);
    process.exit(1);
  }

  const pokedex = JSON.parse(fs.readFileSync(pdxPath, 'utf8'));
  const evoText = fs.readFileSync(evoPath, 'utf8');
  
  // Split by lines and process sequentially
  const lines = evoText.split('\n');
  
  let processedCount = 0;
  let skippedCount = 0;
  let totalEvos = 0;
  
  let currentPokemon = null;
  let currentEvolutionLines = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Skip separator lines and empty lines
    if (line.startsWith('|======')) {
      // Process accumulated data FIRST, then reset
      if (currentPokemon && currentEvolutionLines.length > 0) {
        const pokemonId = toID(currentPokemon);
        
        if (pokemonId && pokedex[pokemonId]) {
          const evos = [];
          for (const evoLine of currentEvolutionLines) {
            const parsedEvos = parseEvolutionLine(evoLine);
            // Filter out evolutions to pokemon that don't exist in the pokedex
            for (const evo of parsedEvos) {
              if (pokedex[evo.target]) {
                evos.push(evo);
              }
            }
          }
          
          if (evos.length > 0) {
            pokedex[pokemonId].evos = evos;
            totalEvos += evos.length;
            processedCount++;
          }
        } else if (pokemonId) {
          skippedCount++;
        }
      }
      
      // NOW reset for next pokemon
      currentPokemon = null;
      currentEvolutionLines = [];
      continue;
    }
    
    // Empty line handling: if we have a currentPokemon but no evolution lines yet,
    // this means the pokemon doesn't evolve - reset and continue
    if (line === '') {
      if (currentPokemon && currentEvolutionLines.length === 0) {
        // Pokemon doesn't evolve - just reset
        currentPokemon = null;
      }
      continue;
    }
    
    // If we don't have a current pokemon, this line is the pokemon name
    if (!currentPokemon) {
      currentPokemon = line;
    } else {
      // This is an evolution line
      currentEvolutionLines.push(line);
    }
  }
  
  // Process the last entry if any
  if (currentPokemon && currentEvolutionLines.length > 0) {
    const pokemonId = toID(currentPokemon);
    
    if (pokemonId && pokedex[pokemonId]) {
      const evos = [];
      for (const evoLine of currentEvolutionLines) {
        const parsedEvos = parseEvolutionLine(evoLine);
        for (const evo of parsedEvos) {
          if (pokedex[evo.target]) {
            evos.push(evo);
          }
        }
      }
      
      if (evos.length > 0) {
        pokedex[pokemonId].evos = evos;
        totalEvos += evos.length;
        processedCount++;
      }
    } else if (pokemonId) {
      skippedCount++;
    }
  }
  
  ensureBackup(pdxPath);
  fs.writeFileSync(pdxPath, JSON.stringify(pokedex, null, 2), 'utf8');
  
  console.log(`Processed ${processedCount} Pokémon with evolution data.`);
  console.log(`Total evolution entries added: ${totalEvos}`);
  console.log(`Skipped ${skippedCount} entries (not found in pokedex).`);
  console.log('Updated pokedex.json saved.');
}

main();
