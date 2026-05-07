import BattlePokedex from "../data/pokedex.json";
import BattleMovedex from "../data/moves.json";
import BattleItems from "../data/items.json";
import BattleAbilities from "../data/abilities.json";
import BattleTypeChart from "../data/typechart.json";
import Learnsets from "../data/learnsets.json";
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
import BattleEvolutions from "../data/evolutions.json";
import MegaEvolutions from "../data/mega-evolutions.json";
import BattleTags from "../data/battle-tags.json";
import ShopTablesJson from "../data/shop-tables.json";
// Import editable data copies for the Pokeedit feature
import BattlePokedexEdit from "../data/pokedex-edit.json";
import LearnsetsEdit from "../data/learnsets-edit.json";
import BaseGameLearnsets from "../data/BaseGameLearnsets.json";
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


window.getPokemonIcon = (pokemon) => {
  // Allow display-name translations (e.g., "Diglett 1" -> "Diglett-Alola")
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
