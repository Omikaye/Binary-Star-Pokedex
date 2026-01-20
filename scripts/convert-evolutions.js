const fs = require('fs');
const path = require('path');
const Dictionary = require('../path/to/Dictionary.cs'); // Adjust the path as necessary

// Read Evolutions.txt
const evolutionsData = fs.readFileSync(path.join(__dirname, '../data/Evolutions.txt'), 'utf-8');

// Prepare to store evolutions
const evolutions = {};

// Process each line in Evolutions.txt
const lines = evolutionsData.split('\n');
lines.forEach(line => {
    const parts = line.split('\t'); // Assuming TSV format
    if (parts.length < 4) return; // Check for minimum data
    const sourceName = parts[0].trim();
    const targetName = parts[1].trim();
    const level = parseInt(parts[2].trim());
    const item = parts[3].trim();
    const condition = parts[4] ? parts[4].trim() : '';

    // Map source and target names using Dictionary
    const sourceId = Dictionary[sourceName] || sourceName;
    const targetId = Dictionary[targetName] || targetName;

    // Initialize the evolutions array for the source
    if (!evolutions[sourceId]) {
        evolutions[sourceId] = [];
    }

    // Add evolution details
evolutions[sourceId].push({ target: targetId, level: level, item: item, condition: condition });
});

// Write output to evolutions.json
const outputPath = path.join(__dirname, '../data/evolutions.json');
fs.writeFileSync(outputPath, JSON.stringify(evolutions, null, 4));
console.log('Evolutions data has been written to data/evolutions.json');
