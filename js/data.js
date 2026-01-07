// Data is already loaded by bootstrap.js and attached to window
// Get references to the data objects from window
const BattlePokedex = window.BattlePokedex;
const BattleMovedex = window.BattleMovedex;
const BattleItems = window.BattleItems;
const BattleAbilities = window.BattleAbilities;
const BattleTypeChart = window.BattleTypeChart;
const Learnsets = window.Learnsets;
const Icons = window.Icons;
const Config = window.Config;
const BaseGameStats = window.BaseGameStats;
const ItemPokemonLinks = window.ItemPokemonLinks;
const Trainers = window.Trainers;
const TrainerNotes = window.TrainerNotes;
const TrainerSprites = window.TrainerSprites;
const TrainerSpriteLinks = window.TrainerSpriteLinks;
const BattlePokedexEdit = window.BattlePokedexEdit;
const LearnsetsEdit = window.LearnsetsEdit;

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

for (let key in BattlePokedex) {
  for (let evo of BattlePokedex[key].evos ?? []) {
    let target = getID(BattlePokedex, evo.target);
    if (target) target.prevo = toID(key);
  }
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
  // Return everything except the last word (which is usually the trainer's personal name)
  // Handle special cases like "Team Skull Grunt"
  if (parts.length === 1) return parts[0];
  if (parts.length === 2) return parts[0];
  // For 3+ words, check if it's a known multi-word class
  const multiWordClasses = ["Team Skull Grunt", "Aether Employee", "Rainbow Rocket Grunt", "Rising Star", "Ace Trainer", "Z-Ace Trainer", "Black Belt", "Z-Black Belt", "Office Worker", "Police Officer", "Young Athlete", "Trial Guide", "Z-Trial Guide", "Ultra Forest", "Masked Royal", "Youngster Amulet"];
  for (let cls of multiWordClasses) {
    if (trainerName.startsWith(cls)) return cls;
  }
  // Default: return first word
  return parts[0];
};

// Helper function to build trainer sprite background CSS from URL
const buildTrainerSpriteBackgroundFromUrl = (url, includeSize = true) => {
  const base = `background:transparent url(${url}) no-repeat scroll right 32px top 0`;
  return includeSize ? `${base}; background-size:auto;` : base;
};

window.getTrainerIcon = (trainerClassOrName, checkPersonalName) => {
  // First, try to get the trainer class (everything except last word)
  let classId = toID(trainerClassOrName);
  
  if (checkPersonalName && trainerClassOrName) {
    const parts = trainerClassOrName.trim().split(/\s+/);
    if (parts.length >= 2) {
      // First check trainer class (e.g., "Youngster" from "Youngster Kevin")
      classId = toID(getTrainerClass(trainerClassOrName));
      
      // Check if we have a sprite link for this class
      if (TrainerSpriteLinks[classId]) {
        return buildTrainerSpriteBackgroundFromUrl(TrainerSpriteLinks[classId]);
      }
      
      // If no class match, check personal name (last word) - e.g., "Hau", "Gladion", "Olivia"
      const personalNameId = toID(parts[parts.length - 1]);
      if (TrainerSpriteLinks[personalNameId]) {
        return buildTrainerSpriteBackgroundFromUrl(TrainerSpriteLinks[personalNameId]);
      }
      
      // No match found, return empty
      return '';
    }
  }
  
  // Check if we have a sprite link for the class/name
  if (TrainerSpriteLinks[classId]) {
    return buildTrainerSpriteBackgroundFromUrl(TrainerSpriteLinks[classId]);
  }
  
  // No image found, return empty
  return '';
};

// Returns only the background image/position for use in compact thumbnails
window.getTrainerBackground = (trainerClassOrName, checkPersonalName) => {
  // First, try to get the trainer class (everything except last word)
  let classId = toID(trainerClassOrName);
  
  if (checkPersonalName && trainerClassOrName) {
    const parts = trainerClassOrName.trim().split(/\s+/);
    if (parts.length >= 2) {
      // First check trainer class (e.g., "Youngster" from "Youngster Kevin")
      classId = toID(getTrainerClass(trainerClassOrName));
      
      // Check if we have a sprite link for this class
      if (TrainerSpriteLinks[classId]) {
        return buildTrainerSpriteBackgroundFromUrl(TrainerSpriteLinks[classId], false);
      }
      
      // If no class match, check personal name (last word) - e.g., "Hau", "Gladion", "Olivia"
      const personalNameId = toID(parts[parts.length - 1]);
      if (TrainerSpriteLinks[personalNameId]) {
        return buildTrainerSpriteBackgroundFromUrl(TrainerSpriteLinks[personalNameId], false);
      }
      
      // No match found, return empty
      return '';
    }
  }
  
  // Check if we have a sprite link for the class/name
  if (TrainerSpriteLinks[classId]) {
    return buildTrainerSpriteBackgroundFromUrl(TrainerSpriteLinks[classId], false);
  }
  
  // No image found, return empty
  return '';
};
