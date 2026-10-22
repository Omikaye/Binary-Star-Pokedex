const toKey = text => String(text || '').toLowerCase().replace(/[^a-z0-9]+/g, '');

export function parseExportEncounterChance(entry) {
  const match = String(entry || '').match(/\[\s*(\d+(?:\.\d+)?)\s*%\s*\]/);
  return match ? Number(match[1]) : null;
}

export function splitExportEncounterPokemon(value) {
  const entries = [];
  let current = '';
  let parentheses = 0;
  for (const character of String(value || '')) {
    if (character === ',' && !parentheses) {
      if (current.trim()) entries.push(current.trim());
      current = '';
      continue;
    }
    if (character === '(') parentheses++;
    if (character === ')') parentheses = Math.max(0, parentheses - 1);
    current += character;
  }
  if (current.trim()) entries.push(current.trim());
  return entries.map(rawEntry => {
    const chance = parseExportEncounterChance(rawEntry);
    const entry = rawEntry.replace(/\s*\[[^\]]*%\s*\]\s*/g, ' ').trim();
    const sosMatch = entry.match(/^(.*?)\s*\(([^()]*)\)\s*$/);
    return {
      name: (sosMatch ? sosMatch[1] : entry).trim(),
      chance,
      sos: sosMatch ? sosMatch[2].split(/\s*,\s*/).filter(Boolean) : [],
    };
  }).filter(pokemon => pokemon.name);
}

export function formatShopPrice(price) {
  return typeof price === 'number' && isFinite(price) ? '$' + price.toLocaleString('en-US') : '';
}

// Splits a ShopInfo string into shop items (source order, duplicates removed) with prices from the item data.
export function parseShopInfo(shopInfo, items) {
  const seen = new Set();
  const shopItems = [];
  for (const rawName of String(shopInfo || '').split(',')) {
    const name = rawName.trim();
    if (!name || seen.has(name)) continue;
    seen.add(name);
    const itemData = (items || {})[toKey(name)];
    shopItems.push({ item: name, price: formatShopPrice(itemData && itemData.buyPrice) });
  }
  return shopItems;
}
