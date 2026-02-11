// Test that all JSON data files are valid and can be loaded
const fs = require('fs');
const path = require('path');

console.log('Testing data files...\n');

const dataFiles = [
  'locations.json',
  'battle-tags.json',
  'shop-tables.json'
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
