// Parse data/rawtxt/Trainers.txt into data/trainers.json
// Output is an array sorted by numeric id:
// [{ id:"002", name:"Lass Isabella", trainerClass:"lass", personalName:"Isabella", location:"Route 2", desc:"...", routeNumber:6, prizeMoney:528, team:[{name, level, item, nature, ability, moves:[]}, ...] }]

const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, '..', 'data', 'rawtxt', 'Trainers.txt');
const OUT = path.join(__dirname, '..', 'data', 'trainers.json');

const toID = (text) => {
  if (text && text.id) text = text.id;
  if (typeof text !== 'string' && typeof text !== 'number') return '';
  return ('' + text).toLowerCase().replace(/[^a-z0-9]+/g, '');
};

function parse() {
  const text = fs.readFileSync(SRC, 'utf8');
  const lines = text.split(/\r?\n/);
  const normalizeMetaText = (value) => {
    const out = (value || '').trim();
    if (!out || /^\(?none\)?$/i.test(out)) return '';
    return out;
  };

  const trainers = [];
  let i = 0;
  while (i < lines.length) {
    // Skip empties until a trainer id line
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
    const rawLabel = idNameMatch[2].trim();

    let trainerClass = '';
    let personalName = '';

    const parenMatch = rawLabel.match(/^\(([^)]+)\)\s*(.*)$/);
    if (parenMatch) {
      trainerClass = parenMatch[1].trim();
      personalName = parenMatch[2].trim();
    } else {
      const tokens = rawLabel.split(/\s+/).filter(Boolean);
      if (tokens.length === 1) {
        trainerClass = tokens[0];
      } else if (tokens.length === 2 && /trainer$/i.test(rawLabel)) {
        // Two-word label ending with "Trainer" -> treat whole thing as class (no personal name)
        trainerClass = rawLabel;
      } else {
        personalName = tokens.pop() || '';
        trainerClass = tokens.join(' ');
      }
    }

    const name = trainerClass && personalName ? `${trainerClass} ${personalName}` : (trainerClass || personalName);
    i++;

    // Metadata lines before team
    let location = '';
    let desc = '';
    let routeNumber = 0;
    let prizeMoney = 0;
    while (i < lines.length) {
      const metaLine = lines[i].trim();
      if (!metaLine || metaLine.includes('(Lv.')) break;

      let match = metaLine.match(/^Location:\s*(.*)$/i);
      if (match) {
        location = normalizeMetaText(match[1]);
        i++;
        continue;
      }
      match = metaLine.match(/^Desc:\s*(.*)$/i);
      if (match) {
        desc = normalizeMetaText(match[1]);
        i++;
        continue;
      }
      match = metaLine.match(/^Route #:\s*([+-]?\d+)/i);
      if (match) {
        routeNumber = parseInt(match[1], 10) || 0;
        i++;
        continue;
      }
      match = metaLine.match(/^Prize Money:\s*\$\s*([0-9,]+)/i);
      if (match) {
        prizeMoney = parseInt(match[1].replace(/,/g, ''), 10) || 0;
        i++;
        continue;
      }
      // Unknown metadata line, skip defensively
      i++;
    }

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

    // Consume blank line separators if present
    while (i < lines.length && !lines[i].trim()) i++;

    const isPlaceholder = team.length === 1 && team[0] &&
      toID(team[0].name) === 'yungoos' &&
      (team[0].level || 0) === 5 &&
      (team[0].moves?.length || 0) === 0;

    if (isPlaceholder) continue;

    trainers.push({ id: idStr, name, trainerClass: toID(trainerClass), personalName, location, desc, routeNumber, prizeMoney, team });
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
