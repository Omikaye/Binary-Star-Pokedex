const fs = require('fs');

// Read the pokedex
const pokedexPath = './data/pokedex.json';
const pokedex = JSON.parse(fs.readFileSync(pokedexPath, 'utf8'));

let removedCount = 0;
let totalEvos = 0;

// Iterate through all Pokémon
for (const [id, pokemon] of Object.entries(pokedex)) {
  if (pokemon.evos && Array.isArray(pokemon.evos)) {
    const originalLength = pokemon.evos.length;
    totalEvos += originalLength;
    
    // Filter out evolutions where the target doesn't exist in pokedex
    pokemon.evos = pokemon.evos.filter(evo => {
      if (!pokedex[evo.target]) {
        console.log(`Removing invalid evolution: ${id} -> ${evo.target}`);
        removedCount++;
        return false;
      }
      return true;
    });
    
    // If no evolutions remain, delete the evos field
    if (pokemon.evos.length === 0) {
      delete pokemon.evos;
    }
  }
}

// Write back
fs.writeFileSync(pokedexPath, JSON.stringify(pokedex, null, 2));

console.log(`\nCleaned pokedex.json:`);
console.log(`Total evolution entries: ${totalEvos}`);
console.log(`Removed invalid targets: ${removedCount}`);
console.log(`Valid evolutions remaining: ${totalEvos - removedCount}`);
