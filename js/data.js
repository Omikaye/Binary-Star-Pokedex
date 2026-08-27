import NewPokedexData from "../data/Pokedex.json";
import { NameDictionary } from "./name-dictionary.js";
import RawBattleMovedex from "../data/moves.json";
import BattleItems from "../data/items.json";
import BattleAbilities from "../data/abilities.json";
import BattleTypeChart from "../data/typechart.json";
import Icons from "../data/icons.json";
import Config from "../data/config.json";
import BaseGameStats from "../data/basegame.json";
import ItemPokemonLinks from "../data/item-pokemon-links.json";
import Trainers from "../data/trainers.json";
import TrainerNotes from "../data/trainer-notes.json";
import StaticEncounters from "../data/static-encounters.json";
import LocationsJson from "../data/locations.json";
import TrainerSprites from "../data/trainer-sprites.json";
import TrainerSpriteLinks from "../data/trainer-sprite-links.json";
import BattleTags from "../data/battle-tags.json";
import ShopTablesJson from "../data/shop-tables.json";
import BaseGameLearnsets from "../data/BaseGameLearnsets.json";
import PartySpriteFiles from "../data/party-sprite-files.json";

// ---------------------------------------------------------------------------
// Build all pokedex globals from the new consolidated Pokedex.json
// ---------------------------------------------------------------------------

function _toIDRaw(text) {
  if (typeof text !== 'string' && typeof text !== 'number') return '';
  return ('' + text).toLowerCase().replace(/[^a-z0-9]+/g, '');
}

function _coerceMoveText(value) {
  if (typeof value === 'string' || typeof value === 'number') return ('' + value).trim();
  if (!value || typeof value !== 'object') return '';
  return (
    value.move ||
    value.Move ||
    value.name ||
    value.Name ||
    value.moveName ||
    value.MoveName ||
    ''
  ).trim();
}

function _coerceMoveList(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.map(_coerceMoveText).filter(Boolean);
  if (typeof value === 'string') return value.split(/[\n,]/).map(s => s.trim()).filter(Boolean);
  if (typeof value === 'object') return Object.values(value).map(_coerceMoveText).filter(Boolean);
  return [];
}

function _parseLevelUpMoveEntry(value) {
  if (typeof value === 'string') {
    const m = value.match(/^(\d+)\s*-\s*(.+)$/);
    if (m) return { move: _toIDRaw(m[2].trim()), how: 'lvl', level: parseInt(m[1], 10) };
    const move = _coerceMoveText(value);
    if (move) return { move: _toIDRaw(move), how: 'lvl', level: 1 };
    return null;
  }
  if (!value || typeof value !== 'object') return null;
  const move = _coerceMoveText(value);
  if (!move) return null;
  const level = Number(
    value.level ??
    value.Level ??
    value.lvl ??
    value.Lvl ??
    value.learnLevel ??
    value.LearnLevel ??
    1
  );
  return { move: _toIDRaw(move), how: 'lvl', level: Number.isFinite(level) ? level : 1 };
}

function _normalizeMoveFlags(flags) {
  const normalized = {};
  if (!flags || typeof flags !== 'object') return normalized;
  const aliases = {
    makescontact: 'contact',
    ignoresubstitute: 'bypasssub',
    biting: 'bite',
    megalauncher: 'pulse',
  };
  for (const key in flags) {
    if (!flags[key]) continue;
    const normalizedKey = aliases[_toIDRaw(key)] || _toIDRaw(key);
    if (normalizedKey) normalized[normalizedKey] = 1;
  }
  return normalized;
}

function _normalizeMoveEntry(id, move) {
  const name = move?.name || move?.Name || id;
  const normalized = {
    ...move,
    id,
    name,
    num: move?.num ?? move?.Num ?? 0,
    flags: _normalizeMoveFlags(move?.flags ?? move?.Flags),
    category: move?.category ?? move?.Category ?? 'Status',
    basePower: move?.basePower ?? move?.BasePower ?? 0,
    accuracy: move?.accuracy ?? move?.Accuracy ?? true,
    type: move?.type ?? move?.Type ?? 'Normal',
    target: move?.target ?? move?.Target ?? 'normal',
    pp: move?.pp ?? move?.PP ?? 0,
    priority: move?.priority ?? move?.Priority ?? 0,
    desc: move?.desc ?? move?.Desc ?? '',
    shortDesc: move?.shortDesc ?? move?.ShortDesc ?? move?.desc ?? move?.Desc ?? '',
    zMovePower: move?.zMovePower ?? move?.ZMovePower,
    zMoveEffect: move?.zMoveEffect ?? move?.ZMoveEffect,
    zMoveBoost: move?.zMoveBoost ?? move?.ZMoveBoost,
    isZ: move?.isZ ?? move?.IsZ,
    isMax: move?.isMax ?? move?.IsMax,
    gmaxPower: move?.gmaxPower ?? move?.GMaxPower,
    noPPBoosts: move?.noPPBoosts ?? move?.NoPPBoosts ?? false,
    isNonstandard: move?.isNonstandard ?? move?.IsNonstandard,
  };
  return normalized;
}

/**
 * Given a display name like "Venusaur 1", return the canonical hyphenated name
 * ("Venusaur-Mega") if it's in the NameDictionary, otherwise return as-is.
 */
function _canonicalName(displayName) {
  return NameDictionary[displayName] || displayName;
}

/**
 * Parse an evolution method string (the part after "TargetName: ") into an
 * object compatible with getEvoMethod().
 * Examples:
 *   "Level Up [Level 22]"               -> {level: 22}
 *   "Level Up Female [Level 22]"        -> {level: 22, condition: "Female"}
 *   "Level Up with Friendship [Level 45]" -> {level: 45, condition: "friendship"}
 *   "Level Up (Attack < Defense) [Level 21]" -> {level: 21, condition: "Attack < Defense"}
 *   "Level Up (@) at Morning [Level 25]"    -> {level: 25, condition: "at Morning"}
 *   "Used Item [Fire Stone]"            -> {item: "Fire Stone"}
 *   "Used Item [Electirizer, Level 37]" -> {item: "Electirizer", level: 37}
 */
function _parseEvoMethod(methodStr) {
  const evo = {};

  // Extract level from "[Level N]"
  const lvlMatch = methodStr.match(/\[Level\s+(\d+)\]/);
  if (lvlMatch) evo.level = parseInt(lvlMatch[1], 10);

  if (methodStr.startsWith('Used Item')) {
    const bracketMatch = methodStr.match(/\[([^\]]+)\]/);
    if (bracketMatch) {
      const parts = bracketMatch[1].split(',').map(s => s.trim());
      const itemPart = parts.find(p => !/^Level\s+\d+$/.test(p));
      if (itemPart) evo.item = itemPart;
    }
    return evo;
  }

  if (methodStr.startsWith('Level Up')) {
    // Parenthesised condition: "Level Up (condition) [Level N]"
    const parenMatch = methodStr.match(/^Level Up\s+\(([^)]+)\)/);
    if (parenMatch) {
      const cond = parenMatch[1];
      if (cond !== '@') {
        evo.condition = cond;
      } else {
        // "Level Up (@) <suffix> [Level N]" – extract the suffix
        const suffixMatch = methodStr.match(/^Level Up\s+\(@\)\s+(.+?)\s*\[Level/);
        if (suffixMatch) evo.condition = suffixMatch[1].trim();
      }
      return evo;
    }

    // Keyword conditions without parens
    if (/^Level Up\s+Female/.test(methodStr)) { evo.condition = 'Female'; return evo; }
    if (/^Level Up\s+Male/.test(methodStr))   { evo.condition = 'Male';   return evo; }
    if (/^Level Up\s+with Friendship/.test(methodStr)) { evo.condition = 'friendship'; return evo; }
  }

  return evo;
}

/**
 * Parse a full evolution entry string like "Ivysaur: Level Up [Level 22]"
 * and return {target, ...evoData} or null on parse failure.
 */
function _parseEvolution(evoStr, localToID) {
  const colonIdx = evoStr.indexOf(':');
  if (colonIdx === -1) return null;
  const rawTarget = evoStr.slice(0, colonIdx).trim();
  const method    = evoStr.slice(colonIdx + 1).trim();
  const canonical = _canonicalName(rawTarget);
  const target    = localToID(canonical);
  if (!target) return null;
  return Object.assign({ target }, _parseEvoMethod(method));
}

/**
 * Parse a mega-evolution entry string like "Venusaur 1 (Venusaurite)"
 * and return {forme, item}.
 */
function _parseMegaEvo(megaStr) {
  const m = megaStr.match(/^(.+?)\s+\(([^)]+)\)$/);
  if (!m) return null;
  return { forme: m[1].trim(), item: m[2].trim() };
}

// Build the four globals from NewPokedexData (array of entries)
const BattleMovedex    = Object.fromEntries(
  Object.entries(RawBattleMovedex || {}).map(([id, move]) => [id, _normalizeMoveEntry(id, move)])
);
const BattlePokedex    = {};
const BattleEvolutions = {};
const MegaEvolutions   = {};
const Learnsets        = {};

for (const entry of NewPokedexData) {
  const displayName  = entry.PokemonName;
  const canonical    = _canonicalName(displayName);
  const id           = _toIDRaw(canonical);

  // --- BattlePokedex entry ---
  const baseStats = {
    hp:  entry.Stats.HP,
    atk: entry.Stats.Atk,
    def: entry.Stats.Def,
    spa: entry.Stats.SpA,
    spd: entry.Stats.SpD,
    spe: entry.Stats.Speed,
  };

  const abilitiesArr = entry.Abilities;
  const abilities = {};
  if (abilitiesArr[0]) abilities['0'] = abilitiesArr[0];
  if (abilitiesArr[1]) abilities['1'] = abilitiesArr[1];
  if (abilitiesArr[2]) abilities['H'] = abilitiesArr[2];

  const pokedexEntry = {
    num:       entry.PokemonID,
    name:      canonical,
    types:     entry.Types,
    abilities,
    baseStats,
    expgroup:  entry.ExpGroup,
    heightm:   entry.Height,
    weightkg:  entry.Weight,
    catchrate: entry.CatchRate,
    eggGroups: entry.EggGroups,
    color:     entry.Color,
    expYield:  entry.ExpYield,
  };

  if (entry.ZMove && entry.ZMove.ZMove && entry.ZMove.ZMove !== 'None') {
    pokedexEntry.zmove = {
      zMove: entry.ZMove.ZMove,
      zCrystal: entry.ZMove.ZCrystal,
      baseMove: entry.ZMove.BaseMove,
    };
  }

  // Derive baseSpecies / forme for forms with hyphenated canonical names
  if (canonical !== displayName && canonical.includes('-')) {
    const dashIdx = canonical.indexOf('-');
    pokedexEntry.baseSpecies = canonical.slice(0, dashIdx);
    pokedexEntry.forme       = canonical.slice(dashIdx + 1);
  }

  BattlePokedex[id] = pokedexEntry;

  // --- BattleEvolutions ---
  const evos = (entry.Evolutions || [])
    .map(s => _parseEvolution(s, _toIDRaw))
    .filter(Boolean);
  if (evos.length > 0) BattleEvolutions[id] = evos;

  // --- MegaEvolutions ---
  const megas = (entry.MegaEvolutions || [])
    .map(_parseMegaEvo)
    .filter(Boolean);
  if (megas.length > 0) MegaEvolutions[id] = megas;

  // --- Learnsets ---
  const learnset = [];

  for (const moveEntry of (Array.isArray(entry.LevelUpMoves) ? entry.LevelUpMoves : _coerceMoveList(entry.LevelUpMoves))) {
    const parsed = _parseLevelUpMoveEntry(moveEntry);
    if (parsed) learnset.push(parsed);
  }

  for (const name of _coerceMoveList(entry.TMs)) {
    learnset.push({ move: _toIDRaw(name), how: 'tm' });
  }

  for (const tutorField of [entry.SpecialTutors, entry.BeachTutors, entry.MoveTutors, entry.TutorMoves]) {
    for (const name of _coerceMoveList(tutorField)) {
      learnset.push({ move: _toIDRaw(name), how: 'tutor' });
    }
  }

  Learnsets[id] = learnset;
}

// Editable copies – no separate edit files exist; initialise as empty so the
// Pokeedit feature degrades gracefully rather than crashing on import.
const BattlePokedexEdit = {};
const LearnsetsEdit     = {};
// ...existing code...
import './compat.js'; // ensure legacy helpers are available early
// ...existing code...
window.Config = Config;
window.ResourcePrefix = window.Config.baseurl + "images/";

window.BattlePokedex = BattlePokedex;
window.BattleMovedex = BattleMovedex;
window.BattleItems = BattleItems;
window.BattleAbilities = BattleAbilities;
window.BattleTypeChart = BattleTypeChart;
window.Learnsets = Learnsets;
window.BaseGameStats = BaseGameStats;
window.ItemPokemonLinks = ItemPokemonLinks;
window.Trainers = Trainers;
window.TrainerNotes = TrainerNotes;
window.StaticEncounters = StaticEncounters;
window.Locations = LocationsJson.locations || [];
window.TrainerSprites = TrainerSprites;
window.TrainerSpriteLinks = TrainerSpriteLinks;
window.BattleEvolutions = BattleEvolutions;
window.MegaEvolutions = MegaEvolutions;
window.BattleTags = BattleTags;
window.ShopTables = ShopTablesJson.shopTables || {};
// Expose editable data copies
window.BattlePokedexEdit = BattlePokedexEdit;
window.LearnsetsEdit = LearnsetsEdit;
window.BaseGameLearnsets = BaseGameLearnsets;

// Build reverse mapping: coordinate -> icon index for debugging
window.ItemIconIndices = {};
const BORDER = 1;
const PITCH = 33;
const COLUMNS = 28;
for (let itemId in Icons.items) {
  const [x, y] = Icons.items[itemId];
  // Reverse calculate: x = -(1 + col*33), y = -(1 + row*33)
  const col = Math.round((-x - BORDER) / PITCH);
  const row = Math.round((-y - BORDER) / PITCH);
  const iconIndex = row * COLUMNS + col + 1; // 1-based
  ItemIconIndices[itemId] = iconIndex;
}

window.toID = (text) => {
  if (text?.id) {
    text = text.id;
  } else if (text?.userid) {
    text = text.userid;
  }
  if (typeof text !== "string" && typeof text !== "number") return "";
  return ("" + text).toLowerCase().replace(/[^a-z0-9]+/g, "");
};

window.getID = (obj, text) => {
  return obj[toID(text)];
};

for (let data of [BattlePokedex, BattleMovedex, BattleItems, BattleAbilities, BattleTypeChart]) {
  for (let key in data) {
    data[key].id = key;
  }
}

// Also set IDs for editable pokedex
for (let key in BattlePokedexEdit) {
  BattlePokedexEdit[key].id = key;
}

// Set up prevo relationships for editable pokedex
for (let key in BattlePokedexEdit) {
  for (let evo of BattlePokedexEdit[key].evos ?? []) {
    let target = BattlePokedexEdit[toID(evo.target)];
    if (target) target.prevo = toID(key);
  }
}
// ...existing code...
// Compatibility helpers for legacy UI code (safe, idempotent)
if (typeof window.escapeHTML !== 'function') {
  window.escapeHTML = function (s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c];
    });
  };
}
// Add other tiny helpers here if a crash shows another missing global
// ...existing code...
window.BattleStatNames = {
  hp: "HP",
  atk: "Atk",
  def: "Def",
  spa: "SpA",
  spd: "SpD",
  spe: "Spe",
};

window.getItemIcon = (item) => {
  let [left, top] = Icons.items[toID(item)] ?? [0, 0];
  return `background:transparent url(${ResourcePrefix}sprites/itemicons-sheet.png) no-repeat scroll ${left}px ${top}px`;
};

window.getTypeIcon = (type) => {
  type = getID(BattleTypeChart, type).name;
  if (!type) type = "None";
  var sanitizedType = type.replace(/\?/g, "%3f");
  return `<img src="${ResourcePrefix}sprites/types/${sanitizedType}.png" alt="${type}" height="14" width="32" class="pixelated" />`;
};


function _getPartySpriteFilename(pokemon) {
  let pokemonId = '';
  let pokemonName = '';
  let pokemonNum = 0;
  let isForm = false;

  if (pokemon && typeof pokemon === 'object') {
    pokemonName = pokemon.name || '';
    pokemonId = toID(pokemon.id || pokemonName);
    pokemonNum = Number(pokemon.num) || 0;
    isForm = !!(pokemon.forme && pokemon.name !== pokemon.baseSpecies);
  } else {
    const rawName = '' + pokemon;
    const translated = typeof window.translateDisplayName === 'function' ? window.translateDisplayName(rawName) : rawName;
    pokemonId = toID(translated);
    pokemonName = translated;
    const template = BattlePokedex[pokemonId];
    if (template) {
      pokemonName = template.name || pokemonName;
      pokemonNum = Number(template.num) || 0;
      isForm = !!(template.forme && template.name !== template.baseSpecies);
    }
  }

  if (PartySpriteFiles[pokemonId]) return PartySpriteFiles[pokemonId];

  const nameId = toID(pokemonName);
  if (PartySpriteFiles[nameId]) return PartySpriteFiles[nameId];

  if (!isForm && pokemonNum >= 1 && pokemonNum <= 1025) {
    const padded = String(pokemonNum).padStart(4, '0');
    if (PartySpriteFiles[padded]) return PartySpriteFiles[padded];
    return `${padded}.png`;
  }
  return '';
}

window.getPokemonIcon = (pokemon) => {
  const spriteFilename = _getPartySpriteFilename(pokemon);
  if (spriteFilename) {
    return `background:transparent url(${ResourcePrefix}sprites/Gen8and9Sprites/${encodeURIComponent(spriteFilename).replace(/%2F/g, "/")}) no-repeat scroll 0 0`;
  }
  // Fallback to the legacy icon sheet when needed.
  const translated = typeof window.translateDisplayName === 'function' ? window.translateDisplayName(pokemon) : pokemon;
  let [left, top] = Icons.pokemon[toID(translated)] ?? [0, 0];
  return `background:transparent url(${ResourcePrefix}sprites/pokemonicons-sheet.png?v14) no-repeat scroll ${left}px ${top}px`;
};

window.getCategoryIcon = (category) => {
  var categoryID = toID(category);
  var sanitizedCategory = "";
  switch (categoryID) {
    case "physical":
    case "special":
    case "status":
      sanitizedCategory = categoryID.charAt(0).toUpperCase() + categoryID.slice(1);
      break;
    default:
      sanitizedCategory = "undefined";
      break;
  }

  return (
    '<img src="' +
    ResourcePrefix +
    "sprites/categories/" +
    sanitizedCategory +
    '.png" alt="' +
    sanitizedCategory +
    '" height="14" width="32" class="pixelated" />'
  );
};

window.escapeHTML = (str, jsEscapeToo) => {
  str = String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  if (jsEscapeToo) str = str.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
  return str;
};

window.getLearnset = (pokemonId) => {
  let learnset = Learnsets[pokemonId];
  // If this form doesn't have its own learnset (undefined, not empty array), try the base species
  if (learnset === undefined) {
    const pokemon = BattlePokedex[pokemonId];
    if (pokemon?.baseSpecies) {
      learnset = Learnsets[toID(pokemon.baseSpecies)];
    }
  }
  return learnset ?? [];
};

window.hasTmOrTutorMoves = (pokemonId) => {
  return window.getLearnset(pokemonId).some(learn => learn && (learn.how === 'tm' || learn.how === 'tutor'));
};

window.canLearn = (pokemonId, moveId) => {
  const moveIdNorm = toID(moveId);
  return getLearnset(pokemonId).some((n) => toID(n.move) === moveIdNorm);
};

window.getLearnsetEdit = (pokemonId) => {
  let learnset = LearnsetsEdit[pokemonId];
  // If this form doesn't have its own learnset (undefined, not empty array), try the base species
  if (learnset === undefined) {
    const pokemon = BattlePokedexEdit[pokemonId];
    if (pokemon?.baseSpecies) {
      learnset = LearnsetsEdit[toID(pokemon.baseSpecies)];
    }
  }
  return learnset ?? [];
};

window.canLearnEdit = (pokemonId, moveId) => {
  const moveIdNorm = toID(moveId);
  return getLearnsetEdit(pokemonId).some((n) => toID(n.move) === moveIdNorm);
};

window.getTrainerClass = (trainerName) => {
  // Extract trainer class from full name (e.g., "Lass Madison" -> "Lass")
  if (!trainerName) return "";
  const parts = trainerName.trim().split(/\s+/);
  
  // Single word - return as is
  if (parts.length === 1) return parts[0];
  
  // Multi-word trainer names - check if any prefix matches a known class
  // Handle special cases like "Team Skull Grunt", "Aether Employee", "Rainbow Rocket Grunt"
  const multiWordClasses = [
    "Team Skull Grunt", "Aether Employee", "Rainbow Rocket Grunt", "Rising Star", 
    "Ace Trainer", "Z-Ace Trainer", "Black Belt", "Z-Black Belt", "Office Worker", 
    "Police Officer", "Young Athlete", "Trial Guide", "Z-Trial Guide", "Ultra Forest", 
    "Masked Royal", "Youngster Amulet", "Youth Athlete", "Swim Gal", "Punk Guy", 
    "Punk Girl", "Skull Gang Grunt", "Athlete In-Training", "Up and Coming", 
    "Aether Foundation", "Aether Scientist", "Pokémon Rancher", "Pokémon Breeder"
  ];
  
  // Check if any multi-word class matches the beginning of trainerName
  for (let cls of multiWordClasses) {
    if (trainerName.toLowerCase().startsWith(cls.toLowerCase())) return cls;
  }
  
  // Default: return all but last word for 2+ word names (last word is personal name)
  if (parts.length >= 2) {
    return parts.slice(0, -1).join(" ");
  }
  
  return parts[0];
};

// Helper function to build trainer sprite background CSS from URL
const buildTrainerSpriteBackgroundFromUrl = (url, includeSize = true) => {
  const base = `background:transparent url(${url}) no-repeat scroll right 32px top 0`;
  return includeSize ? `${base}; background-size:auto;` : base;
};

// Resolve a trainer-sprite-links entry to a plain URL string.
// Handles both the legacy string format and the current { unique, class } object format.
const resolveTrainerSpriteEntry = (entry) => {
  if (!entry) return null;
  if (typeof entry === 'string') return entry;
  if (typeof entry === 'object') return entry.unique || entry.class || null;
  return null;
};

const getTrainerSpriteUrlById = (id) => {
  if (!id || !TrainerSpriteLinks) return null;
  return resolveTrainerSpriteEntry(TrainerSpriteLinks[toID(id)]);
};

const getTrainerSpriteUrlFromName = (trainerName, checkPersonalName = true) => {
  if (!trainerName || !TrainerSpriteLinks) return null;

  let url = getTrainerSpriteUrlById(trainerName);
  if (url) return url;

  if (!checkPersonalName) return null;

  const parts = trainerName.trim().split(/\s+/);
  if (parts.length >= 2) {
    const personalName = parts[parts.length - 1];
    url = getTrainerSpriteUrlById(personalName);
    if (url) return url;

    const className = (typeof window.getTrainerClass === 'function') ? window.getTrainerClass(trainerName) : '';
    url = getTrainerSpriteUrlById(className);
    if (url) return url;

    return getTrainerSpriteUrlById(parts.slice(0, -1).join(' '));
  }

  return null;
};

// Resolve a sprite URL for trainer objects/names.
// Priority: personalName unique sprite, then trainerClass, then parsed full-name fallbacks.
window.getTrainerSpriteUrl = (trainerOrName, checkPersonalName = true) => {
  if (!trainerOrName || !TrainerSpriteLinks) return null;

  if (typeof trainerOrName === 'object') {
    let url = null;
    if (trainerOrName.personalName) {
      url = getTrainerSpriteUrlById(trainerOrName.personalName);
    }
    if (!url && trainerOrName.trainerClass) {
      url = getTrainerSpriteUrlById(trainerOrName.trainerClass);
    }
    if (!url && trainerOrName.name) {
      url = getTrainerSpriteUrlFromName(trainerOrName.name, true);
    }
    return url;
  }

  return getTrainerSpriteUrlFromName(trainerOrName, checkPersonalName);
};

window.getTrainerIcon = (trainerOrName, checkPersonalName) => {
  if (!trainerOrName) return 'background:transparent';
  const url = window.getTrainerSpriteUrl(trainerOrName, !!checkPersonalName);
  if (url) return buildTrainerSpriteBackgroundFromUrl(url);
  return 'background:transparent';
};

// Returns only the background image/position for use in compact thumbnails
window.getTrainerBackground = (trainerOrName, checkPersonalName) => {
  if (!trainerOrName) return 'background:transparent';
  const url = window.getTrainerSpriteUrl(trainerOrName, !!checkPersonalName);
  if (url) return buildTrainerSpriteBackgroundFromUrl(url, false);
  return 'background:transparent';
};
