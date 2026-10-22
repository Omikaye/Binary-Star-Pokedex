import assert from 'node:assert';
import fs from 'node:fs';
import { splitExportEncounterPokemon, parseShopInfo } from '../js/location-export-parsing.mjs';

const mons = splitExportEncounterPokemon('Yungoos [10%], Rattata 1 [10%] (Rattata), Pikipek');
assert.deepStrictEqual(mons[0], { name: 'Yungoos', chance: 10, sos: [] });
assert.deepStrictEqual(mons[1], { name: 'Rattata 1', chance: 10, sos: ['Rattata'] });
assert.strictEqual(mons[2].chance, null);

const items = JSON.parse(fs.readFileSync(new URL('../data/items.json', import.meta.url)));
const shop = parseShopInfo('Poké Doll, Ultra Ball, Ultra Ball, Not An Item', items);
assert.deepStrictEqual(shop.map(i => i.item), ['Poké Doll', 'Ultra Ball', 'Not An Item']);
assert.strictEqual(shop[1].price, '$1,200');
assert.strictEqual(shop[2].price, '');
console.log('✓ location export parsing tests passed');
