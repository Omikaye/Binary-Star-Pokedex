// Test that all JSON data files are valid and can be loaded
const fs = require('fs');
const path = require('path');

console.log('Testing data files...\n');

const dataFiles = [
  'locations.json',
  'battle-tags.json',
  'shop-tables.json',
  'trainers.json',
  'StaticEncounters.json'
];

let allValid = true;

for (const file of dataFiles) {
  const filePath = path.join(__dirname, '..', 'data', file);
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const parsed = JSON.parse(content);
    console.log(`✓ ${file} is valid JSON`);
    
    // Additional validation for specific files
    if (file === 'locations.json') {
      const locations = parsed.locations || [];
      console.log(`  - Contains ${locations.length} locations`);
      
      // Check for new fields
      const hasNewFields = locations.some(loc => 
        loc.battles !== undefined || 
        loc.shopTables !== undefined
      );
      
      if (hasNewFields) {
        console.log('  - ✓ New fields (battles, shopTables) present');
        
        // Show sample battles
        for (const loc of locations) {
          if (loc.battles && loc.battles.length > 0) {
            console.log(`  - Location "${loc.name}" has ${loc.battles.length} battle(s):`);
            for (const battle of loc.battles) {
              console.log(`    - ID: ${battle.id}, Tag: ${battle.tag}, Notes: ${battle.notes || 'none'}`);
            }
          }
          if (loc.shopTables && loc.shopTables.length > 0) {
            console.log(`  - Location "${loc.name}" has shop tables: ${loc.shopTables.join(', ')}`);
          }
        }
      } else {
        console.log('  - ⚠ Warning: No locations have new fields yet');
      }
    }
    
    if (file === 'battle-tags.json') {
      const tags = Object.keys(parsed);
      console.log(`  - Contains ${tags.length} tag definitions: ${tags.join(', ')}`);
      
      // Verify each tag has required fields
      for (const tag of tags) {
        const config = parsed[tag];
        if (!config.color || !config.backgroundColor || !config.description) {
          console.error(`  - ✗ Tag "${tag}" is missing required fields`);
          allValid = false;
        }
      }
    }
    
    if (file === 'shop-tables.json') {
      const shopTables = parsed.shopTables || {};
      const tableNames = Object.keys(shopTables);
      console.log(`  - Contains ${tableNames.length} shop table(s): ${tableNames.join(', ')}`);
    }

    if (file === 'trainers.json') {
      const updatedFormat = !Array.isArray(parsed) && Array.isArray(parsed.Trainers);
      const trainers = Array.isArray(parsed) ? parsed : (parsed.Trainers || []);
      console.log(`  - Contains ${trainers.length} trainer record(s)`);
      if (updatedFormat) {
        const requiredTrainerFields = ['TrainerName', 'TrainerClass', 'TrainerID', 'Money', 'AIFlags', 'Pokemon'];
        const invalidTrainers = trainers.filter(trainer =>
          requiredTrainerFields.some(field => !Object.prototype.hasOwnProperty.call(trainer, field)) ||
          !Array.isArray(trainer.AIFlags) ||
          !Array.isArray(trainer.Pokemon)
        );
        if (invalidTrainers.length) {
          console.error(`  - ✗ ${invalidTrainers.length} trainer(s) missing required fields or arrays`);
          allValid = false;
        } else {
          console.log('  - ✓ Updated trainer fields (name, class, ID, money, AI flags, Pokémon) present');
        }

        const requiredPokemonFields = ['Species', 'Form', 'Level', 'HPType', 'IsShiny', 'IVs', 'Moves'];
        const invalidPokemon = trainers.flatMap(trainer => Array.isArray(trainer.Pokemon) ? trainer.Pokemon : []).filter(pokemon =>
          requiredPokemonFields.some(field => !Object.prototype.hasOwnProperty.call(pokemon, field))
        );
        if (invalidPokemon.length) {
          console.error(`  - ✗ ${invalidPokemon.length} Pokémon missing required fields`);
          allValid = false;
        } else {
          console.log('  - ✓ Updated Pokémon fields (species, form, level, Hidden Power type, shiny, IVs, moves) present');
        }
      } else {
        const missingMetadata = trainers.filter(trainer =>
          !Object.prototype.hasOwnProperty.call(trainer, 'location') ||
          !Object.prototype.hasOwnProperty.call(trainer, 'desc') ||
          !Object.prototype.hasOwnProperty.call(trainer, 'routeNumber') ||
          !Object.prototype.hasOwnProperty.call(trainer, 'prizeMoney')
        );
        if (missingMetadata.length) {
          console.error(`  - ✗ ${missingMetadata.length} trainer(s) missing required metadata fields`);
          allValid = false;
        } else {
          console.log('  - ✓ Trainer metadata fields (location, desc, routeNumber, prizeMoney) present');
        }
      }

      const placeholderTrainers = trainers.filter(trainer => {
        if (!trainer) return false;
        const team = updatedFormat ? trainer.Pokemon : trainer.team;
        if (!Array.isArray(team) || team.length !== 1) return false;
        const mon = team[0];
        return mon &&
          String(updatedFormat ? mon.Species : mon.name || '').toLowerCase() === 'yungoos' &&
          Number((updatedFormat ? mon.Level : mon.level) || 0) === 5 &&
          (!Array.isArray(updatedFormat ? mon.Moves : mon.moves) || (updatedFormat ? mon.Moves : mon.moves).length === 0);
      });
      if (placeholderTrainers.length) {
        console.error(`  - ✗ ${placeholderTrainers.length} placeholder trainer(s) were not filtered`);
        allValid = false;
      } else {
        console.log('  - ✓ Placeholder trainers are filtered out');
      }
    }

    if (file === 'StaticEncounters.json') {
      const categories = ['Gifts', 'Trades', 'Encounters'];
      const invalidCategories = categories.filter(category => !Array.isArray(parsed[category]));
      if (invalidCategories.length) {
        console.error(`  - ✗ Missing static encounter categories: ${invalidCategories.join(', ')}`);
        allValid = false;
      } else {
        console.log(`  - Contains ${categories.map(category => `${parsed[category].length} ${category.toLowerCase()}`).join(', ')}`);
      }
      const invalidEntries = categories.flatMap(category =>
        Array.isArray(parsed[category]) ? parsed[category].filter(entry =>
          !entry || !entry.Species || entry.Level == null
        ) : []
      );
      if (invalidEntries.length) {
        console.error(`  - ✗ ${invalidEntries.length} static encounter(s) missing species or level`);
        allValid = false;
      } else if (!invalidCategories.length) {
        console.log('  - ✓ Static encounter species and level fields present');
      }
    }
    
  } catch (error) {
    console.error(`✗ ${file} has an error:`);
    console.error(`  ${error.message}`);
    allValid = false;
  }
}

console.log('\n--- Test Summary ---');
if (allValid) {
  console.log('✓ All data files are valid and properly formatted!');
  process.exit(0);
} else {
  console.error('✗ Some data files have errors');
  process.exit(1);
}
