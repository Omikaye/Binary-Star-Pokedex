/**
 * Generate item-pokemon relationships based on name mentions in descriptions
 * Output: data/item-pokemon-links.json
 */

const fs = require('fs');
const path = require('path');

// Load data files
const pokedexPath = path.join(__dirname, '../data/pokedex.json');
const itemsPath = path.join(__dirname, '../data/items.json');
const outputPath = path.join(__dirname, '../data/item-pokemon-links.json');

const pokedex = JSON.parse(fs.readFileSync(pokedexPath, 'utf8'));
const items = JSON.parse(fs.readFileSync(itemsPath, 'utf8'));

// Helper function to normalize IDs (same as toID in the frontend)
function toID(text) {
	if (!text) return '';
	return ('' + text).toLowerCase().replace(/[^a-z0-9]+/g, '');
}

// Generate relationships
const relationships = {
	// Map of pokemon ID -> array of item IDs that mention this pokemon
	pokemonToItems: {},
	// Map of item ID -> array of pokemon IDs mentioned in this item
	itemToPokemon: {}
};

// Track which pokemon base species we've seen to avoid duplicates
const processedSpecies = new Set();

// First pass: find all items that mention pokemon
for (const itemId in items) {
	const item = items[itemId];
	const itemDesc = (item.desc || item.shortDesc || '').toLowerCase();
	
	const mentionedPokemon = [];
	
	for (const pokemonId in pokedex) {
		const pokemon = pokedex[pokemonId];
		if (!pokemon || !pokemon.name || !pokemon.baseSpecies) continue;
		
		const pokemonName = pokemon.name.toLowerCase();
		const pokemonSpecies = pokemon.baseSpecies.toLowerCase();
		
		// Check if this pokemon's name appears in the item description
		// Use word boundary matching to avoid false matches
		const namePattern = new RegExp('\\b' + pokemonName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'i');
		const speciesPattern = new RegExp('\\b' + pokemonSpecies.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'i');
		
		if (namePattern.test(itemDesc) || speciesPattern.test(itemDesc)) {
			// Avoid duplicates - only add if we haven't seen this base species for this item
			const speciesKey = `${itemId}:${pokemon.baseSpecies}`;
			if (!processedSpecies.has(speciesKey)) {
				mentionedPokemon.push(pokemonId);
				processedSpecies.add(speciesKey);
				
				// Also populate the reverse mapping (pokemon -> items)
				if (!relationships.pokemonToItems[pokemonId]) {
					relationships.pokemonToItems[pokemonId] = [];
				}
				relationships.pokemonToItems[pokemonId].push(itemId);
			}
		}
	}
	
	if (mentionedPokemon.length > 0) {
		relationships.itemToPokemon[itemId] = mentionedPokemon;
	}
}

// Write to file
fs.writeFileSync(outputPath, JSON.stringify(relationships, null, 2));

console.log('Generated item-pokemon links:');
console.log(`- ${Object.keys(relationships.pokemonToItems).length} pokemon have related items`);
console.log(`- ${Object.keys(relationships.itemToPokemon).length} items have related pokemon`);
console.log(`Output: ${outputPath}`);
