// Validate data/locations.json structure
const fs = require('fs');
const path = require('path');

const LOCATIONS_JSON = path.join(__dirname, '..', 'data', 'locations.json');

try {
  const raw = fs.readFileSync(LOCATIONS_JSON, 'utf8');
  let data;
  try {
    data = JSON.parse(raw);
  } catch (parseError) {
    console.error('ERROR: data/locations.json is not valid JSON:', parseError.message);
    process.exit(1);
  }

  if (!data.locations || !Array.isArray(data.locations)) {
    console.error('ERROR: data/locations.json is missing a top-level "locations" array');
    process.exit(1);
  }

  console.log('OK: data/locations.json contains', data.locations.length, 'locations');
} catch (err) {
  console.error('ERROR: Could not read data/locations.json:', err.message);
  process.exit(1);
}
