const fs = require('fs');
const path = require('path');

function toID(text) {
    if (!text) return '';
    return ('' + text).toLowerCase().replace(/[^a-z0-9]+/g, '');
}

// Read and parse the Dictionary.cs file
function parseDictionary() {
    const dictPath = path.join(__dirname, '../data/rawtxt/Dictionary.cs');
    const dictContent = fs.readFileSync(dictPath, 'utf8');
    const nameMap = {};
    
    // Parse each line like: { "Rattata 1", "Rattata-Alola" },
    const regex = /\{\s*"([^"]+)"\s*,\s*"([^"]+)"\s*\}/g;
    let match;
    while ((match = regex.exec(dictContent)) !== null) {
        nameMap[match[1]] = match[2];
    }
    
    return nameMap;
}

console.log('Reading Dictionary.cs...');
const nameMap = parseDictionary();
console.log(`Loaded ${Object.keys(nameMap).length} name mappings from Dictionary`);

console.log('Reading BaseGameStats.txt...');
const baseGameData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/rawtxt/BaseGameStats.txt'), 'utf8'));

const baseGameStats = {};

for (const entry of baseGameData) {
    if (!entry.name || entry.name === '---') continue;
    
    // Check if this name needs to be mapped via Dictionary
    let finalName = entry.name;
    if (nameMap[entry.name]) {
        finalName = nameMap[entry.name];
    }
    
    const id = toID(finalName);
    
    baseGameStats[id] = {
        baseStats: entry.baseStats,
        weightkg: entry.weightkg
    };
}

console.log(`Processed ${Object.keys(baseGameStats).length} Pokémon base game stats`);

// Write to basegame.json
const outputPath = path.join(__dirname, '../data/basegame.json');
fs.writeFileSync(outputPath, JSON.stringify(baseGameStats, null, 2));

console.log(`Base game stats written to ${outputPath}`);
