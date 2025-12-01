// Convert data/rawtxt/Moves.txt into data/moves.json
// Keeps only fields the UI uses: name, num, type, category, basePower, accuracy, pp, priority, target, flags, desc, zMovePower, zMoveEffect, isZ

const fs = require('fs');
const path = require('path');

function toID(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '');
}

const MOVES_TXT = path.join(__dirname, '..', 'data', 'rawtxt', 'Moves.txt');
const OUT_JSON = path.join(__dirname, '..', 'data', 'moves.json');

function parseMovesTxt(src) {
  const lines = src.split(/\r?\n/);
  const moves = {};

  let cur = null;
  let readingDesc = false;
  let descBuf = [];

  function flushCurrent() {
    if (!cur) return;
    if (readingDesc) {
      cur.desc = descBuf.join(' ').trim();
      readingDesc = false;
      descBuf = [];
    }
    // Defaults
    if (cur.name) {
      const id = toID(cur.name);
      // Ensure minimal required fields
      if (cur.accuracy === undefined) cur.accuracy = 100;
      if (cur.priority === undefined) cur.priority = 0;
      if (!cur.target) cur.target = 'normal';
      // Provide empty shortDesc placeholder for manual editing later
      if (cur.shortDesc === undefined) cur.shortDesc = "";
      moves[id] = cur;
    }
    cur = null;
  }

  function mapTargeting(text) {
    // Map human-readable Targeting to simplified PS-like targets for UI
    const t = text.toLowerCase();
    // Distinguish between hitting only foes vs everyone except the user
    if (t.includes('all foes')) return 'allAdjacentFoes';
    if (t.includes("everyone but user")) return 'allAdjacent';
    if (t.includes("user's field") || t.includes('users field')) return 'allySide';
    if (t.includes('all allies')) return 'allyTeam';
    if (t === 'self') return 'self';
    if (t.includes('single adjacent ally')) return 'adjacentAlly';
    return 'normal';
  }

  const flagMap = {
    makescontact: 'contact',
    protect: 'protect',
    mirror: 'mirror',
    reflectable: 'reflectable',
    snatch: 'snatch',
    ballistic: 'bullet',
    pulse: 'pulse',
    bite: 'bite',
    punch: 'punch',
    defrost: 'defrost',
    sound: 'sound',
    powder: 'powder',
    ignoresubstitute: 'bypasssub',
    slicing: 'slicing',
    wind: 'wind',
  };

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    const line = raw.trim();

    if (!line) {
      // blank line ends a block (and description)
      flushCurrent();
      continue;
    }

    // Description block handling
    if (readingDesc) {
      // Next move begins with ID: ...
      if (/^ID:\s*/i.test(line)) {
        flushCurrent();
        // fallthrough to treat as new block header on next loop
      } else {
        descBuf.push(line);
        continue;
      }
    }

    // New block if we encounter ID
    let m;
    if ((m = line.match(/^ID:\s*(\d+)/i))) {
      flushCurrent();
      cur = { num: parseInt(m[1], 10), flags: {} };
      continue;
    }

    if (!cur) continue; // skip anything until an ID appears

    if ((m = line.match(/^Name:\s*(.+)$/i))) {
      let moveName = m[1].trim();
      // Remove (P) and (S) suffixes from Z-Move names
      moveName = moveName.replace(/\s*\(P\)\s*$/, '').replace(/\s*\(S\)\s*$/, '');
      cur.name = moveName;
      continue;
    }
    if ((m = line.match(/^Category:\s*(.+)$/i))) {
      cur.category = m[1].trim();
      continue;
    }
    if ((m = line.match(/^Power:\s*(\-?\d+)/i))) {
      cur.basePower = parseInt(m[1], 10);
      continue;
    }
    if ((m = line.match(/^Accuracy:\s*(\-?\d+)/i))) {
      cur.accuracy = parseInt(m[1], 10);
      continue;
    }
    if ((m = line.match(/^Type:\s*(.+)$/i))) {
      cur.type = m[1].trim();
      continue;
    }
    if ((m = line.match(/^Targeting:\s*(.+)$/i))) {
      cur.target = mapTargeting(m[1].trim());
      continue;
    }
    if ((m = line.match(/^Base PP:\s*(\d+)/i))) {
      cur.pp = parseInt(m[1], 10);
      // Heuristic: Base PP 1 indicates Z-Move entry
      if (cur.pp === 1) cur.isZ = true;
      continue;
    }
    if ((m = line.match(/^Priority:\s*(\-?\d+)/i))) {
      cur.priority = parseInt(m[1], 10);
      continue;
    }
    if ((m = line.match(/^Z-Power:\s*(\d+)/i))) {
      cur.zMovePower = parseInt(m[1], 10);
      continue;
    }
    if ((m = line.match(/^Z-Effect:\s*(.+)$/i))) {
      const val = m[1].trim();
      if (val && val.toLowerCase() !== 'none') cur.zMoveEffect = val;
      continue;
    }
    if ((m = line.match(/^Flags:\s*(.+)$/i))) {
      const parts = m[1].split(',').map(s => s.trim()).filter(Boolean);
      for (const p of parts) {
        const key = toID(p);
        const mapped = flagMap[key] || key; // keep unknowns in case future UI reads them
        cur.flags[mapped] = 1;
      }
      continue;
    }
    if (/^Description:\s*$/i.test(line)) {
      readingDesc = true;
      descBuf = [];
      continue;
    }

    // Other fields (Inflict, Stat Change, Recoil, Hits, etc.) are currently ignored for UI
  }

  // Final flush in case file doesn't end with a blank line
  flushCurrent();

  return moves;
}

function main() {
  let src;
  try {
    src = fs.readFileSync(MOVES_TXT, 'utf8');
  } catch (e) {
    console.error('Failed to read Moves.txt:', e.message);
    process.exit(1);
  }

  const moves = parseMovesTxt(src);
  const json = JSON.stringify(moves, null, 2);

  try {
    fs.writeFileSync(OUT_JSON, json);
  } catch (e) {
    console.error('Failed to write moves.json:', e.message);
    process.exit(1);
  }

  console.log(`✓ Wrote moves.json (${Object.keys(moves).length} moves)`);
}

if (require.main === module) {
  main();
}
