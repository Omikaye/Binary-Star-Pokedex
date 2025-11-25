// Data initialization module
// This file assumes bootstrap.js has already loaded JSON data into window globals.
// It sets up helper functions and performs additional initialization.

// Use window-provided data (from bootstrap.js) with fallbacks
const BattlePokedex = window.BattlePokedex || {};
const BattleMovedex = window.BattleMovedex || {};
const BattleItems = window.BattleItems || {};
const BattleAbilities = window.BattleAbilities || {};
const BattleTypeChart = window.BattleTypeChart || {};
const Learnsets = window.Learnsets || {};
const Icons = window.Icons || { pokemon: {}, items: {} };
const Config = window.Config || { baseurl: '/Binary-Star-Pokedex/' };
const BaseGameStats = window.BaseGameStats || {};
const ItemPokemonLinks = window.ItemPokemonLinks || {};

// Ensure ResourcePrefix is set
if (!window.ResourcePrefix) {
  window.ResourcePrefix = (Config.baseurl || '/Binary-Star-Pokedex/') + 'images/';
}
const ResourcePrefix = window.ResourcePrefix;

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
  return obj[window.toID(text)];
};

for (let data of [BattlePokedex, BattleMovedex, BattleItems, BattleAbilities, BattleTypeChart]) {
  for (let key in data) {
    data[key].id = key;
  }
}

for (let key in BattlePokedex) {
  for (let evo of BattlePokedex[key].evos ?? []) {
    let target = getID(BattlePokedex, evo.target);
    if (target) target.prevo = toID(key);
  }
}
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
  let [left, top] = Icons.pokemon[toID(pokemon)] ?? [0, 0];
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
  if (!learnset || learnset.length == 0) {
    learnset = Learnsets[toID(BattlePokedex[pokemonId]?.baseSpecies)];
  }
  return learnset ?? [];
};

window.canLearn = (pokemonId, moveId) => {
  const moveIdNorm = toID(moveId);
  return getLearnset(pokemonId).some((n) => toID(n.move) === moveIdNorm);
};
