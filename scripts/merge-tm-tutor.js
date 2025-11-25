#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const pdxPath = path.join(repoRoot, 'data', 'pokedex.json');
const learnsetsPath = path.join(repoRoot, 'data', 'learnsets.json');

function toID(text) {
  if (text === undefined || text === null) return '';
  return String(text).toLowerCase().replace(/[^a-z0-9]+/g, '');
}

function extractList(val) {
  if (!val) return [];
  if (Array.isArray(val)) return val.slice();
  if (typeof val === 'object') return Object.values(val).flatMap(v => Array.isArray(v) ? v : [v]);
  return [val];
}

function collectMovesForKey(entry, keys) {
  for (const k of keys) {
    if (!entry[k]) continue;
    const raw = entry[k];
    const arr = extractList(raw).filter(Boolean).map(x => String(x).trim());
    if (arr.length) return arr;
  }
  return [];
}

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
  if (!fs.existsSync(learnsetsPath)) {
    console.error('learnsets.json not found at', learnsetsPath);
    process.exit(1);
  }

  const pokedex = JSON.parse(fs.readFileSync(pdxPath, 'utf8'));
  const learnsets = JSON.parse(fs.readFileSync(learnsetsPath, 'utf8'));

  const tmKeys = ['tm', 'tms', 'tmMoves', 'tmhm', 'tmhmMoves'];
  const tutorKeys = ['tutor', 'tutors', 'tutorMoves', 'tutor_list'];

  let tmAdded = 0;
  let tutorAdded = 0;
  let pokeCount = 0;

  for (const pid of Object.keys(pokedex)) {
    pokeCount++;
    const entry = pokedex[pid] || {};

    const tms = collectMovesForKey(entry, tmKeys).map(m => String(m));
    const tutors = collectMovesForKey(entry, tutorKeys).map(m => String(m));

    if (!tms.length && !tutors.length) continue;

    if (!learnsets[pid]) learnsets[pid] = [];

    // helper to check duplicates
    const exists = (moveId, how) => learnsets[pid].some(l => l.move === moveId && l.how === how);

    // append level-up moves should remain first; we'll append tm/tutor at end
    for (const raw of tms) {
      const moveId = toID(raw);
      if (!moveId) continue;
      if (exists(moveId, 'tm')) continue;
      learnsets[pid].push({move: moveId, how: 'tm'});
      tmAdded++;
    }

    for (const raw of tutors) {
      const moveId = toID(raw);
      if (!moveId) continue;
      if (exists(moveId, 'tutor')) continue;
      learnsets[pid].push({move: moveId, how: 'tutor'});
      tutorAdded++;
    }
  }

  ensureBackup(learnsetsPath);

  fs.writeFileSync(learnsetsPath, JSON.stringify(learnsets, null, 2), 'utf8');
  console.log(`Processed ${pokeCount} pokémon entries.`);
  console.log(`TM moves added: ${tmAdded}`);
  console.log(`Tutor moves added: ${tutorAdded}`);
  console.log('Updated learnsets saved to', learnsetsPath);
  console.log('If you want different casing for the `how` field, edit the script accordingly.');
}

main();
