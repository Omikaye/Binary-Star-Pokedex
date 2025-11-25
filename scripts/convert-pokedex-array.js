#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const pdxPath = path.join(repoRoot, 'data', 'pokedex.json');

function toID(text) {
  if (text === undefined || text === null) return '';
  return String(text).toLowerCase().replace(/[^a-z0-9]+/g, '');
}

function main() {
  if (!fs.existsSync(pdxPath)) {
    console.error('pokedex.json not found at', pdxPath);
    process.exit(1);
  }

  const raw = fs.readFileSync(pdxPath, 'utf8');
  let data = JSON.parse(raw);

  // Check if already an object
  if (!Array.isArray(data)) {
    console.log('pokedex.json is already in object format (not an array).');
    console.log('No conversion needed.');
    return;
  }

  console.log(`Converting array with ${data.length} entries to object format...`);

  // Create backup
  const bakPath = pdxPath + '.bak';
  if (!fs.existsSync(bakPath)) {
    fs.copyFileSync(pdxPath, bakPath);
    console.log('Backup created:', bakPath);
  }

  const pokedex = {};
  let converted = 0;
  let skipped = 0;

  for (const entry of data) {
    if (!entry.name) {
      skipped++;
      continue;
    }
    const id = toID(entry.name);
    if (!id) {
      skipped++;
      continue;
    }

    // Map egggroup to eggGroups (if needed)
    if (entry.egggroup && !entry.eggGroups) {
      entry.eggGroups = entry.egggroup;
      delete entry.egggroup;
    }

    // Convert gender numeric value to genderRatio object
    if (entry.gender !== undefined) {
      const genderValue = entry.gender;
      delete entry.gender;

      if (genderValue === 255) {
        // Genderless
        entry.gender = 'N';
      } else if (genderValue === 0) {
        // Always male
        entry.gender = 'M';
      } else if (genderValue === 254) {
        // Always female
        entry.gender = 'F';
      } else {
        // Mixed ratio: genderValue is the threshold (out of 255) for female
        // Female ratio = genderValue / 255
        // Male ratio = (255 - genderValue) / 255
        const femaleRatio = genderValue / 255;
        const maleRatio = (255 - genderValue) / 255;
        entry.genderRatio = {
          M: parseFloat(maleRatio.toFixed(3)),
          F: parseFloat(femaleRatio.toFixed(3))
        };
      }
    }

    pokedex[id] = entry;
    converted++;
  }

  fs.writeFileSync(pdxPath, JSON.stringify(pokedex, null, 2), 'utf8');
  console.log(`Converted ${converted} entries.`);
  console.log(`Skipped ${skipped} entries (missing name).`);
  console.log('Updated pokedex.json saved.');
}

main();
