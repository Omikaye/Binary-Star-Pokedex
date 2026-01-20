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

// Parse MegaEvolutions.txt
const megaPath = path.join(__dirname, '..', 'data', 'rawtxt', 'MegaEvolutions.txt');
const megaEvolutions = {};

try {
  const megaRaw = fs.readFileSync(megaPath, 'utf8');
  const megaLines = megaRaw.split(/\r?\n/);
  let currentBase = null;
  
  for (let i = 0; i < megaLines.length; i++) {
    const line = megaLines[i].trim();
    if (!line || line === '======') continue;
    
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
        
        // Apply dictionary mapping to the form name
        const finalFormName = nameMap[formKey] || formKey;
        
        // Use the parsed base species from the file header instead of inferring it from the forme name.
        // This avoids incorrect associations when the forme name doesn't start with the base species.
        const baseSpeciesId = toID(currentBase);
        
        if (!megaEvolutions[baseSpeciesId]) {
          megaEvolutions[baseSpeciesId] = [];
        }
        
        megaEvolutions[baseSpeciesId].push({
          forme: finalFormName,
          item: item
        });
      }
    }
  }
  
  console.log(`✓ Parsed ${Object.keys(megaEvolutions).length} base species with mega evolutions`);
} catch (e) {
  console.error('Failed to read MegaEvolutions.txt:', e.message);
  process.exit(1);
}

// Write output to mega-evolutions.json
const outputPath = path.join(__dirname, '../data/mega-evolutions.json');
fs.writeFileSync(outputPath, JSON.stringify(megaEvolutions, null, 2));
console.log(`✓ Wrote mega-evolutions.json with ${Object.keys(megaEvolutions).length} Pokemon`);
console.log('Mega evolutions data has been written to data/mega-evolutions.json');
