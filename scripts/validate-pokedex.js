const fs = require('fs');
const path = require('path');

const toID = (text) => String(text || '').toLowerCase().replace(/[^a-z0-9]+/g, '');

const pokedexPath = path.join(__dirname, '..', 'data', 'pokedex.json');
const learnsetsPath = path.join(__dirname, '..', 'data', 'learnsets.json');

if (!fs.existsSync(pokedexPath)) {
  console.error('Missing pokedex.json at', pokedexPath);
  process.exit(1);
}

const pokedex = JSON.parse(fs.readFileSync(pokedexPath, 'utf8'));
let learnsets = {};
if (fs.existsSync(learnsetsPath)) {
  try { learnsets = JSON.parse(fs.readFileSync(learnsetsPath, 'utf8')); } catch (e) {
    console.warn('Could not parse learnsets.json:', e.message);
  }
} else {
  console.warn('learnsets.json not found; move checks will be skipped.');
}

const REQUIRED_FIELDS = ['num','name','types','abilities','baseStats'];
const BASE_STATS_FIELDS = ['hp','atk','def','spa','spd','spe'];

let errorCount = 0;
let warnCount = 0;

function report(id, level, msg) {
  if (level === 'ERROR') errorCount++; else warnCount++;
  console.log(`${level}: ${id}: ${msg}`);
}

for (const [id, data] of Object.entries(pokedex)) {
  // Basic required fields
  for (const field of REQUIRED_FIELDS) {
    if (!(field in data)) report(id,'ERROR',`Missing required field '${field}'`);
  }

  if (typeof data.num !== 'number') report(id,'ERROR','num should be number');
  if (typeof data.name !== 'string') report(id,'ERROR','name should be string');

  if (!Array.isArray(data.types) || data.types.length === 0) report(id,'ERROR','types should be non-empty array');
  else if (!data.types.every(t => typeof t === 'string')) report(id,'ERROR','types elements must be strings');

  if (typeof data.abilities !== 'object' || Array.isArray(data.abilities)) report(id,'ERROR','abilities should be object');

  if (typeof data.baseStats !== 'object' || Array.isArray(data.baseStats)) report(id,'ERROR','baseStats should be object');
  else {
    for (const stat of BASE_STATS_FIELDS) {
      if (typeof data.baseStats[stat] !== 'number') report(id,'ERROR',`baseStats.${stat} should be number`);
    }
  }

  // Height / weight (optional but recommended)
  if (data.heightm !== undefined && typeof data.heightm !== 'number') report(id,'WARN','heightm should be number');
  if (data.weightkg !== undefined && typeof data.weightkg !== 'number') report(id,'WARN','weightkg should be number');

  // Gender ratio or gender
  if (!('genderRatio' in data) && !('gender' in data)) {
    report(id,'WARN','Missing genderRatio or gender');
  } else if ('genderRatio' in data) {
    const gr = data.genderRatio;
    if (typeof gr !== 'object') report(id,'ERROR','genderRatio should be object');
    else {
      if (typeof gr.M !== 'number' || typeof gr.F !== 'number') report(id,'ERROR','genderRatio M/F should be numbers');
      if (gr.M + gr.F > 1.001 || gr.M + gr.F < -0.001) report(id,'WARN','genderRatio M+F should sum to ~1');
    }
  } else if ('gender' in data) {
    if (!['M','F','N'].includes(data.gender)) report(id,'ERROR','gender should be M/F/N');
  }

  // Egg groups
  if (data.eggGroups) {
    if (!Array.isArray(data.eggGroups)) report(id,'ERROR','eggGroups should be array');
    else if (!data.eggGroups.every(g => typeof g === 'string')) report(id,'ERROR','eggGroups elements must be strings');
  }

  // Evolutions
  if (data.evos) {
    if (!Array.isArray(data.evos)) report(id,'ERROR','evos should be array');
    else {
      for (const evo of data.evos) {
        if (!evo || typeof evo !== 'object') { report(id,'ERROR','evo entry should be object'); continue; }
        if (typeof evo.target !== 'string') report(id,'ERROR','evo.target missing or not string');
        if (!pokedex[evo.target]) report(id,'ERROR',`evo.target '${evo.target}' does not exist in pokedex`);
        if (evo.level !== undefined && typeof evo.level !== 'number') report(id,'ERROR','evo.level should be number');
        if (evo.item && typeof evo.item !== 'string') report(id,'ERROR','evo.item should be string');
        if (evo.condition && typeof evo.condition !== 'string') report(id,'ERROR','evo.condition should be string');
      }
    }
  }

  // Learnsets presence
  if (!learnsets[id]) {
    report(id,'WARN','No learnset entry found');
  } else if (!Array.isArray(learnsets[id])) {
    report(id,'ERROR','learnset entry should be array');
  } else {
    // Spot check a few entries
    for (const moveEntry of learnsets[id].slice(0,5)) {
      if (!moveEntry || typeof moveEntry !== 'object') { report(id,'ERROR','learnset move entry should be object'); break; }
      if (typeof moveEntry.move !== 'string') report(id,'ERROR','learnset move missing move string');
      if (typeof moveEntry.how !== 'string') report(id,'ERROR','learnset move missing how string');
      if (moveEntry.how === 'lvl' && typeof moveEntry.level !== 'number') report(id,'ERROR','level-up move missing numeric level');
    }
  }

  // Legacy leftover arrays (tms/tutors) should not remain
  if (data.tms) report(id,'WARN','Found legacy tms array; expected moves merged into learnsets.json');
  if (data.tutors) report(id,'WARN','Found legacy tutors array; expected moves merged into learnsets.json');
}

console.log('\nSummary:');
console.log(`Errors: ${errorCount}`);
console.log(`Warnings: ${warnCount}`);
if (errorCount > 0) {
  console.log('Validation failed.');
  process.exitCode = 2;
} else {
  console.log('Validation passed (with warnings if any).');
}
