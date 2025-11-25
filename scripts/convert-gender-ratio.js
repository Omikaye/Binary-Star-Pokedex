#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const pdxPath = path.join(repoRoot, 'data', 'pokedex.json');

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

function main() {
  if (!fs.existsSync(pdxPath)) {
    console.error('pokedex.json not found at', pdxPath);
    process.exit(1);
  }

  const data = JSON.parse(fs.readFileSync(pdxPath, 'utf8'));

  let converted = 0;
  let skipped = 0;

  for (const id in data) {
    const entry = data[id];
    
    if (entry.gender === undefined) {
      skipped++;
      continue;
    }

    const genderValue = entry.gender;
    delete entry.gender;

    if (genderValue === 255) {
      // Genderless
      entry.gender = 'N';
      converted++;
    } else if (genderValue === 0) {
      // Always male
      entry.gender = 'M';
      converted++;
    } else if (genderValue === 254) {
      // Always female
      entry.gender = 'F';
      converted++;
    } else {
      // Mixed ratio: genderValue is the threshold (out of 255) for female
      // Female ratio = genderValue / 255
      // Male ratio = (255 - genderValue) / 255
      const femaleRatio = genderValue / 255;
      const maleRatio = (255 - genderValue) / 255;
      
      // Round to nearest 0.5
      const roundToHalf = (num) => Math.round(num * 2) / 2;
      
      entry.genderRatio = {
        M: roundToHalf(maleRatio),
        F: roundToHalf(femaleRatio)
      };
      converted++;
    }
  }

  ensureBackup(pdxPath);
  fs.writeFileSync(pdxPath, JSON.stringify(data, null, 2), 'utf8');
  
  console.log(`Converted ${converted} gender entries.`);
  console.log(`Skipped ${skipped} entries (no gender field).`);
  console.log('Updated pokedex.json saved.');
}

main();
