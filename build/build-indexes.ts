/*
 * build-indexes.ts
 * 
 * NOTE: Most data generation from @pkmn libraries has been DISABLED
 * to prevent overwriting local custom data.
 * 
 * Disabled sections:
 * - pokedex.json (use scripts/import-all.js instead)
 * - learnsets.json (use scripts/import-all.js instead)
 * - moves.json (use scripts/import-moves.js instead)
 * - items.json (use scripts/parse-items.js instead)
 * - abilities.json (disabled - no local import available)
 * - typechart.json (disabled - no local import available)
 * - Image downloads (disabled - use existing local files only)
 * 
 * This script now only generates icon coordinate metadata.
 */

import * as fs from "fs";
import * as path from "path";

import { ModdedDex, Dex, Learnset, Data as DexData, ModData, SpeciesName } from "@pkmn/dex";
import { Sprites, Icons } from "@pkmn/img";
import { Generation, Generations } from "@pkmn/data";
import { buffer } from "stream/consumers";

const BASE_GEN = 9;

async function main() {
  let data: ModData | undefined = JSON.parse(fs.readFileSync("./build/mod-data.json").toString());
  if (Object.keys(data).length == 0) data = undefined;
  let dex = new ModdedDex(`gen${BASE_GEN}`, data);

  function nationalDexExists(d: DexData) {
    if (Generations.DEFAULT_EXISTS(d)) return true;
    if ("isNonstandard" in d) {
      return d.isNonstandard == "Past";
    }
    return false;
  }

  function getLatestLearnset(learnsetData: Learnset) {
    for (let i = BASE_GEN; i > 0; --i) {
      let genLearnset = { ...learnsetData.learnset };
      for (let moveId in genLearnset) {
        genLearnset[moveId] = genLearnset[moveId].filter((m) => Number(m[0]) == i);
        if (genLearnset[moveId].length == 0) delete genLearnset[moveId];
      }
      if (Object.keys(genLearnset).length > 0) {
        return genLearnset;
      }
    }
    return {};
  }

  let generation = new Generation(dex, nationalDexExists);

  const rootDir = path.resolve(__dirname, "..");
  process.chdir(rootDir);

  function toID(text: any): string {
    if (text?.id) text = text.id;
    if (typeof text !== "string" && typeof text !== "number") return "";
    return ("" + text).toLowerCase().replace(/[^a-z0-9]+/g, "");
  }

  const allSpecies = Object.fromEntries(
    [...generation.species].sort((a, b) => a.num - b.num || a.name.localeCompare(b.name)).map((s) => [s.id, s] as const)
  );
  const allMoves = Object.fromEntries([...generation.moves].map((m) => [m.id, m]));
  const allAbilities = Object.fromEntries([...generation.abilities].map((a) => [a.id, a]));
  const allTypes = Object.fromEntries([...generation.types].map((m) => [m.id, m]));
  const allItems = Object.fromEntries([...generation.items].map((m) => [m.id, m]));

  /*********************************************************
   * Build pokedex.json - DISABLED (use scripts/import-all.js instead)
   * This section pulls from @pkmn/dex which overrides local Pokemon data
   *********************************************************/
  /*
  let dexjs = {};

  for (let species in allSpecies) {
    let entry = allSpecies[species];
    let dexEntry = {
      name: entry.name,
      num: entry.num,
      types: entry.types,
      abilities: entry.abilities,
      eggGroups: entry.eggGroups,

      evos: undefined,

      baseSpecies: entry.baseSpecies,
      forme: entry.forme,
      formes: entry.formes ?? allSpecies[toID(entry.baseSpecies)]?.formes,
      requiredItem: entry.requiredItem,
      cosmeticFormes: entry.cosmeticFormes?.map((s) => s.slice(entry.name.length + 1)),

      genderRatio: entry.genderRatio,
      weightkg: entry.weightkg,
      baseStats: entry.baseStats,
    };

    if (entry.evos) {
      dexEntry.evos = entry.evos.map((evo) => {
        let evolved = allSpecies[toID(evo)];
        return { target: evo, condition: evolved.evoCondition, level: evolved.evoLevel, item: evolved.evoItem };
      });
    }

    if (dexEntry.formes) {
      dexEntry.formes = dexEntry.formes.filter((f) => toID(f) in allSpecies);
      if (dexEntry.formes.length <= 1) {
        delete dexEntry.formes;
      }
    }
    if (dexEntry.forme == "") delete dexEntry.forme;
    if (dexEntry.baseSpecies == dexEntry.name) delete dexEntry.baseSpecies;
    dexjs[species] = dexEntry;
  }
  fs.writeFileSync("data/pokedex.json", JSON.stringify(dexjs, undefined, 2));
  */

  /*********************************************************
   * Build learnsets.json - DISABLED (use scripts/import-all.js instead)
   * This section pulls from @pkmn/dex which overrides local learnset data
   *********************************************************/
  /*
  {
    let learnsets = {};
    for (let species in allSpecies) {
      let learnsetData = { ...(await generation.learnsets.get(species)) };
      if (!learnsetData) continue;

      let learnset = [];
      let latestLearnset = getLatestLearnset(learnsetData);
      for (let moveId in latestLearnset) {
        for (let entry of latestLearnset[moveId]) {
          switch (entry[1]) {
            case "L":
              learnset.push({
                move: moveId,
                how: "lvl",
                level: +entry.slice(2),
              });
              break;
            case "M":
              learnset.push({ move: moveId, how: "tm" });
              break;
            case "T":
              learnset.push({ move: moveId, how: "tutor" });
              break;
            case "E":
              learnset.push({ move: moveId, how: "egg" });
              break;
          }
        }
        learnset.sort((a, b) => {
          const order = ["lvl", "tm", "tutor", "egg"];
          if (a.how != b.how) return order.indexOf(a.how) - order.indexOf(b.how);
          if (a.how == "lvl" && a.level != b.level) return a.level - b.level;
          return a.move.localeCompare(b.move);
        });
      }
      learnsets[species] = learnset;
    }
    fs.writeFileSync("data/learnsets.json", JSON.stringify(learnsets, undefined, 2));
  }
  */

  /*********************************************************
   * Build moves.js - DISABLED (use scripts/import-moves.js instead)
   * This section pulls from @pkmn/dex which overrides local move data
   *********************************************************/

  /*
  {
    let moves = {};
    for (let moveId in allMoves) {
      let move = allMoves[moveId];
      moves[moveId] = {
        name: move.name,
        num: move.num,
        type: move.type,
        flags: move.flags,
        basePower: move.basePower,
        accuracy: move.accuracy,
        category: move.category,
        desc: move.desc,
        shortDesc: move.shortDesc,
        pp: move.pp,
        priority: move.priority,
        target: move.target,
      };
    }
    fs.writeFileSync("data/moves.json", JSON.stringify(moves, undefined, 2));
  }
  */

  /*********************************************************
   * Build items.json - DISABLED (use scripts/parse-items.js instead)
   * This section pulls from @pkmn/dex which overrides local item data
   *********************************************************/

  /*
  {
    let items = {};
    for (let itemId in allItems) {
      let item = allItems[itemId];
      items[itemId] = {
        name: item.name,
        num: item.num,
        desc: item.desc,
        shortDesc: item.shortDesc,
      };
    }
    fs.writeFileSync("data/items.json", JSON.stringify(items, undefined, 2));
  }
  */

  /*********************************************************
   * Build abilities.json - DISABLED
   * This section pulls from @pkmn/dex which overrides local ability data
   * Note: No local ability import script exists yet
   *********************************************************/

  /*
  {
    let abilities = {};
    for (let abilityId in allAbilities) {
      let ability = allAbilities[abilityId];
      abilities[abilityId] = {
        name: ability.name,
        num: ability.num,
        desc: ability.desc,
        shortDesc: ability.shortDesc,
      };
    }
    fs.writeFileSync("data/abilities.json", JSON.stringify(abilities, undefined, 2));
  }
  */

  /*********************************************************
   * Build typechart.json - DISABLED
   * This section pulls from @pkmn/dex which overrides local type chart
   * Note: No local type chart import script exists yet
   *********************************************************/

  /*
  {
    let types = {};
    for (let typeId in allTypes) {
      let type = allTypes[typeId];
      types[typeId] = {
        name: type.name,
        category: type.category,
        effectiveness: type.effectiveness,
      };
    }
    fs.writeFileSync("data/typechart.json", JSON.stringify(types, undefined, 2));
  }
  */

  /*
  ** Icon generation disabled - depends on allSpecies/allItems from @pkmn/dex
  ** Use scripts/update-item-icons.js instead for icon coordinate updates
  **/
  /*
  {
    let icons: {
      pokemon: { [id: string]: [number, number] };
      items: { [id: string]: [number, number] };
    } = {
      pokemon: {},
      items: {},
    };

    // Image downloads disabled - only use locally cached images
    async function downloadFile(path: fs.PathLike, url: string) {
      // Skipped - no online downloads
    }

    async function downloadSpecies(id: string, path: fs.PathLike) {
      // Skipped - no online downloads, rely on existing local files
    }

    // Skip downloading sprite sheets - use existing files
    {
      let path = "images/sprites/pokemonicons-sheet.png";
      if (!fs.existsSync(path)) {
        console.log(`Warning: ${path} not found locally`);
      }
    }

    {
      let path = "images/sprites/itemicons-sheet.png";
      if (!fs.existsSync(path)) {
        console.log(`Warning: ${path} not found locally`);
      }
    }

    let responses = [];
    for (let id in allSpecies) {

      let path = `images/sprites/gen5/${id}.png`;
      // Skip downloading - only use existing local files
      if (fs.existsSync(path)) {
        let icon = Icons.getPokemon(id);
        icons.pokemon[id] = [+icon.left, +icon.top];
      }

      for (let forme of allSpecies[id].cosmeticFormes ?? []) {
        let icon = Icons.getPokemon(forme);
        icons.pokemon[toID(forme)] = [icon.left, icon.top]
        
      }
    }
    // Promise.all skipped - no background downloads

    icons.pokemon["egg"] = [-40, -2580];

    for (let id in allItems) {
      let icon = Icons.getItem(id);

      icons.items[id] = [+icon.left, +icon.top];
    }
    fs.writeFileSync("data/icons.json", JSON.stringify(icons, undefined, 2));
  }
  */
}

main();
