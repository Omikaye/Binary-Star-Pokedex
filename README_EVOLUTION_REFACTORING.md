# Evolution Handling Refactoring

This document describes the changes made to separate evolution data from pokedex.json.

## Overview

Evolution data has been moved from being embedded in `pokedex.json` to separate dedicated files:
- `data/evolutions.json` - Regular evolution data
- `data/mega-evolutions.json` - Mega evolution data

## Data Files

### evolutions.json (383 Pokemon)
Maps Pokemon IDs to their evolution data:
```json
{
  "rattata": [
    { "target": "raticate", "level": 25 },
    { "target": "raticatealola", "item": "Alolan Sack" }
  ]
}
```

### mega-evolutions.json (58 Pokemon)
Maps base Pokemon IDs to mega evolution forms:
```json
{
  "charizard": [
    { "forme": "Charizard-Mega-X", "item": "Charizardite X" },
    { "forme": "Charizard-Mega-Y", "item": "Charizardite Y" }
  ]
}
```

## Scripts

### Generate Evolution Data
```bash
npm run convert-evolutions        # Creates data/evolutions.json
npm run convert-mega-evolutions   # Creates data/mega-evolutions.json
```

### Generate Pokedex (Without Evolutions)
```bash
npm run import-all                # Creates pokedex.json and learnsets.json
```

### Generate Learnsets Only
```bash
npm run convert-levelup           # Creates learnsets.json
```

## Evolution Methods Supported

- **Level**: `{ target: "id", level: 25 }`
- **Item**: `{ target: "id", item: "Item Name" }`
- **Friendship**: `{ target: "id", condition: "friendship" }`
- **Move**: `{ target: "id", condition: "knowing Move Name" }`
- **Party**: `{ target: "id", condition: "with Pokemon Name in party" }`
- **Conditional**: Morning, Night, Gender, Attack/Defense stats

## UI Changes

The Pokemon detail page now:
1. Loads evolution data from `BattleEvolutions` global
2. Builds pre-evolution list via reverse lookup
3. Displays complete evolution tree with all branches
4. Shows mega evolutions with required items

## Data Integrity

- ✅ All 958 Pokemon in pokedex.json have NO evos field
- ✅ All 383 evolution entries have proper methods
- ✅ All 58 mega evolution entries complete
- ✅ Build succeeds without errors

## For Developers

When adding new Pokemon or evolutions:

1. Update raw data files in `data/rawtxt/`
2. Run evolution scripts: `npm run convert-evolutions` and `npm run convert-mega-evolutions`
3. Run import: `npm run import-all`
4. Build: `npm run dist`

The UI will automatically use the new evolution data without code changes.
