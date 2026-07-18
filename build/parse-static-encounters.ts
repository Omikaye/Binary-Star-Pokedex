import * as fs from 'fs';
import * as path from 'path';

interface StaticEncounter {
  id: string;
  name: string;
  level: number;
  item: string | null;
  location: string;
  description: string;
  nature: string;
  ability: string;
  abilitySlot: number;
  moves: string[];
  aura: {
    effect: string;
    boost?: string;
  };
  sos: {
    primary: string | null;
    secondary: string | null;
  };
}

function normalizeMetaText(value: string): string {
  const out = (value || '').trim();
  if (!out || /^\(?none\)?$/i.test(out)) return '';
  return out;
}

function parseStaticEncounters(filePath: string): StaticEncounter[] {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  const encounters: StaticEncounter[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i].trim();
    
    // Skip empty lines
    if (!line) {
      i++;
      continue;
    }

    // Parse ID and name line (e.g., "S001 - Rattata" or "001 - Rattata")
    const idMatch = line.match(/^S?(\d+)\s*-\s*(.+)$/i);
    if (!idMatch) {
      i++;
      continue;
    }

    const id = 'S' + idMatch[1].padStart(3, '0');
    i++;

    // Parse Pokemon line (next non-empty line)
    while (i < lines.length && !lines[i].trim()) i++;
    if (i >= lines.length) break;

    const pokemonLine = lines[i].trim();
    
    // Match: PokemonName (Lv. XX) @Item [Nature] {Ability (Slot)} <Moves>
    // Use non-greedy matching to handle item names with special characters
    const pokemonMatch = pokemonLine.match(
      /^(.+?)\s*\(Lv\.\s*(\d+)\)\s*@(.+?)\s*\[(.+?)\]\s*\{(.+?)\}\s*<(.*)>$/
    );

    if (!pokemonMatch) {
      i++;
      continue;
    }

    const pokemon = pokemonMatch[1].trim();
    const level = parseInt(pokemonMatch[2]);
    let item = pokemonMatch[3].trim();
    item = item === '(None)' ? null : item;
    const nature = pokemonMatch[4].trim();

    // Parse ability - handle both "Ability (Slot)" and special format like "8"
    const abilityPart = pokemonMatch[5].trim();
    const abilityMatch = abilityPart.match(/^(.+?)\s*\((\d+)\)$/);
    let ability: string;
    let abilitySlot: number;
    
    if (abilityMatch) {
      ability = abilityMatch[1].trim();
      abilitySlot = parseInt(abilityMatch[2]);
    } else if (/^\d+$/.test(abilityPart)) {
      // Handle numeric-only ability slots (like "8")
      ability = 'Unknown';
      abilitySlot = parseInt(abilityPart);
    } else {
      ability = abilityPart;
      abilitySlot = 1;
    }

    // Parse moves - filter out (None)
    const movesStr = pokemonMatch[6];
    const moves = movesStr
      .split('/')
      .map((m) => m.trim())
      .filter((m) => m && m !== '(None)');

    // Parse Aura line (next non-empty line)
    i++;
    while (i < lines.length && !lines[i].trim()) i++;
    if (i >= lines.length) break;

    const auraLine = lines[i].trim();
    const auraMatch = auraLine.match(
      /^Aura:\s*(.+?)\s*\(SOS:\s*(.+?),\s*(.+?)\)$/
    );

    let auraEffect = '';
    let auraBoost = '';
    let sosIds: [string | null, string | null] = [null, null];

    if (auraMatch) {
      const auraPart = auraMatch[1];
      const auraRegex = /^(.+?)\s*\(([^)]+)\)$/;
      const auraParse = auraPart.match(auraRegex);

      if (auraParse) {
        auraEffect = auraParse[1].trim();
        auraBoost = auraParse[2].trim();
      } else {
        auraEffect = auraPart;
      }

      let sos1 = auraMatch[2].trim();
      let sos2 = auraMatch[3].trim();

      sosIds = [
        sos1 && sos1 !== 'None' ? 'S' + sos1 : null,
        sos2 && sos2 !== 'None' ? 'S' + sos2 : null,
      ];
    }

    i++;
    let location = '';
    let description = '';
    while (i < lines.length) {
      const metaLine = lines[i].trim();
      if (!metaLine) break;

      let match = metaLine.match(/^Location:\s*(.*)$/i);
      if (match) {
        location = normalizeMetaText(match[1]);
        i++;
        continue;
      }
      match = metaLine.match(/^(?:Description|Desc):\s*(.*)$/i);
      if (match) {
        description = normalizeMetaText(match[1]);
        i++;
        continue;
      }
      if (/^S?\d+\s*-\s*.+$/i.test(metaLine)) break;
      i++;
    }

    encounters.push({
      id,
      name: pokemon,
      level,
      item,
      location,
      description,
      nature,
      ability,
      abilitySlot,
      moves,
      aura: {
        effect: auraEffect,
        ...(auraBoost && { boost: auraBoost }),
      },
      sos: {
        primary: sosIds[0],
        secondary: sosIds[1],
      },
    });
  }

  return encounters;
}

function main() {
  const inputPath = path.resolve(__dirname, '../data/rawtxt/StaticEncounters.txt');
  const outputPath = path.resolve(__dirname, '../data/static-encounters.json');

  const encounters = parseStaticEncounters(inputPath);

  // Create object indexed by id
  const encountersObj: { [key: string]: StaticEncounter } = {};
  encounters.forEach((enc) => {
    encountersObj[enc.id] = enc;
  });

  fs.writeFileSync(outputPath, JSON.stringify(encountersObj, null, 2));
  console.log(`✓ Generated static-encounters.json with ${encounters.length} entries`);
}

main();
