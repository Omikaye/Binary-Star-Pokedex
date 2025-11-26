// Parse data/rawtxt/Trainers.txt into data/trainers.json
// Output is an array sorted by numeric id: [{ id:"002", name:"Lass Isabella", prizeMoney:528, team:[{name, level, item, nature, ability, moves:[]}, ...] }]

const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, '..', 'data', 'rawtxt', 'Trainers.txt');
const OUT = path.join(__dirname, '..', 'data', 'trainers.json');

function parse() {
  const text = fs.readFileSync(SRC, 'utf8');
  const lines = text.split(/\r?\n/);

  const trainers = [];
  let i = 0;
  while (i < lines.length) {
    // Skip empties until a Prize line
    while (i < lines.length && !/^Prize Money:/i.test(lines[i].trim())) {
      i++;
    }
    if (i >= lines.length) break;

    // Prize Money line
    const prizeLine = lines[i].trim();
    const prizeMatch = prizeLine.match(/^Prize Money:\s*\$\s*(\d+)/i);
    let prizeMoney = 0;
    if (prizeMatch) prizeMoney = parseInt(prizeMatch[1], 10) || 0;
    i++;

    // Next non-empty should be the ID + name line
    while (i < lines.length && !lines[i].trim()) i++;
    if (i >= lines.length) break;
    const idNameLine = lines[i].trim();
    const idNameMatch = idNameLine.match(/^(\d{1,3})\s*-\s*(.+)$/);
    if (!idNameMatch) {
      // If unexpected, skip to next
      i++;
      continue;
    }
    const idStr = idNameMatch[1].padStart(3, '0');
    const name = idNameMatch[2].trim();
    i++;

    // Collect team lines until a blank line or EOF
    const team = [];
    while (i < lines.length) {
      const raw = lines[i];
      const line = raw.trim();
      if (!line) break; // blank line ends trainer
      // A valid mon line contains (Lv.
      if (!line.includes('(Lv.')) {
        // Some malformed or separator line; end on safety
        break;
      }

      const mon = {};
      // Name: before first " (Lv." (keep any trailing form numbers like " 1")
      const lvIdx = line.indexOf('(Lv.');
      mon.name = line.substring(0, lvIdx).trim().replace(/\s+$/,'');

      // Level
      const lvlMatch = line.match(/\(Lv\.\s*(\d+)\)/i);
      if (lvlMatch) mon.level = parseInt(lvlMatch[1], 10);

      // Item after @ up to first [
      const itemMatch = line.match(/@([^\[]+)/);
      if (itemMatch) {
        mon.item = itemMatch[1].trim();
        if (/^no item$/i.test(mon.item)) mon.item = null;
      }

      // Nature inside []
      const natureMatch = line.match(/\[([^\]]+)\]/);
      if (natureMatch) mon.nature = natureMatch[1].trim();

      // Ability inside {}
      const abilityMatch = line.match(/\{([^}]+)\}/);
      if (abilityMatch) mon.ability = abilityMatch[1].trim();

      // Moves inside <>
      const movesMatch = line.match(/<([^>]+)>/);
      if (movesMatch) {
        mon.moves = movesMatch[1]
          .split('/')
          .map(s => s.trim())
          .filter(m => m && m !== '(None)');
      } else {
        mon.moves = [];
      }

      team.push(mon);
      i++;
    }

    // Consume the blank line separator if present
    if (i < lines.length && !lines[i].trim()) i++;

    trainers.push({ id: idStr, name, prizeMoney, team });
  }

  // Sort by numeric id
  trainers.sort((a, b) => parseInt(a.id, 10) - parseInt(b.id, 10));
  return trainers;
}

function main() {
  try {
    const trainers = parse();
    fs.writeFileSync(OUT, JSON.stringify(trainers, null, 2));
    console.log(`✓ Wrote trainers.json (${trainers.length} trainers)`);
  } catch (e) {
    console.error('Trainer import failed:', e.message);
    process.exit(1);
  }
}

if (require.main === module) main();
