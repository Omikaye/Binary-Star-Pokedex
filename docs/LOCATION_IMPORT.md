# Location Import Enhancements

This document describes the enhancements made to the Google Sheets location import system to support battles, battle tags, shop tables, and location notes.

## Overview

The location import system has been enhanced to parse additional fields from the Google Sheets BattleLocations page:

1. **Location Notes** - Descriptive notes about each location
2. **Shop Tables** - References to shop tables defined in the ShopLocations page
3. **Battles** - Structured battle information with IDs, tags, and notes

## Google Sheets Format

### BattleLocations Sheet

Each column represents a location. The rows should be structured as follows:

| Field Description | Location 1 | Location 2 | Location 3 |
|-------------------|------------|------------|------------|
| Name | Route 1 | Hau'oli City | Melemele Meadow |
| Location Notes | Starting route description... | Main city description... | Meadow description... |
| Shops | Pokémart Basic | Pokémart Basic, Boutique Hau'oli | |
| Battle 1 | S154 - Static - Alolan Rattata Tutorial | 491 - Story - Hau battle 1 Rowlet Chosen | S023 - Static - Caterpie encounter |
| Battle 2 | | 492 - Story - Hau battle 2 Litten Chosen | 501 - Optional - Youngster on path |
| Battle 3 | | | 502 - Optional - Lass near flowers |

#### Battle Format

Battles are defined in the format: `ID - Tag - Notes`

- **ID**: The battle identifier (can be numeric like `491` or alphanumeric like `S023`)
  - Numeric IDs (e.g., `491`) reference trainers from the trainers data
  - Alphanumeric IDs starting with letters (e.g., `S023`) reference static encounters
- **Tag**: A category tag for the battle (e.g., `Story`, `Optional`, `Boss`, `Static`)
- **Notes**: Additional descriptive text about the battle (e.g., `Hau battle 1 - Rowlet Chosen`)
  - The notes field can contain any text and special characters as needed

#### Location Notes

The "Location Notes" field provides a description that will be displayed:
- Under the location name on the location search page
- At the top of the location detail page

#### Shops

The "Shops" field contains comma-separated shop table names that reference tables in the ShopLocations sheet.

### ShopLocations Sheet

Each column represents a shop table. The format is:

| Shop Name | Shop Name 2 | Shop Name 3 |
|-----------|-------------|-------------|
| Poké Ball - $200 | Silk Scarf - $1000 | X Attack - $500 |
| Potion - $200 | Muscle Band - $1000 | X Defense - $550 |
| Antidote - $200 | Wise Glasses - $1000 | X Speed - $350 |

- First row: Shop table name
- Subsequent rows: Items in the format `Item Name - Price`

## Battle Tags

Battle tags are defined in `data/battle-tags.json`. Each tag has:

- **color**: Text color for the tag badge
- **backgroundColor**: Background color for the tag badge
- **description**: Tooltip text shown on hover

### Default Tags

The following tags are pre-configured:

1. **Story** (Green) - Required story battles that must be completed to progress
2. **Optional** (Blue) - Optional trainer battles that can be skipped
3. **Boss** (Purple) - Important boss battles against significant trainers or Kahunas
4. **Rematch** (Orange) - Post-game rematches with previously encountered trainers
5. **Static** (Red) - Static encounters with wild Pokémon
6. **Legendary** (Gold) - Legendary or Mythical Pokémon encounters
7. **Trial** (Cyan) - Island Trial challenges
8. **Totem** (Pink) - Totem Pokémon battles during trials

### Adding Custom Tags

To add a new tag, edit `data/battle-tags.json`:

```json
{
  "YourTagName": {
    "color": "#HEXCOLOR",
    "backgroundColor": "#HEXCOLOR",
    "description": "Description shown on hover"
  }
}
```

## Data Files

### data/locations.json

Location objects now include:

```json
{
  "id": "route1",
  "name": "Route 1",
  "notes": "Location description...",
  "encounters": [...],
  "shopTables": ["Pokemart Basic"],
  "battles": [
    {
      "id": "S154",
      "tag": "Static",
      "notes": "Alolan Rattata Tutorial"
    }
  ],
  ...
}
```

### data/battle-tags.json

Defines tag styling and descriptions:

```json
{
  "Story": {
    "color": "#4CAF50",
    "backgroundColor": "#E8F5E9",
    "description": "Required story battle..."
  }
}
```

### data/shop-tables.json

Defines shop inventories:

```json
{
  "shopTables": {
    "Pokemart Basic": {
      "name": "Pokemart Basic",
      "items": [
        { "item": "Poké Ball", "price": "$200" },
        { "item": "Potion", "price": "$200" }
      ]
    }
  }
}
```

## Syncing from Google Sheets

### Sync Locations

```bash
npm run sync-sheets-locations
```

This will fetch the BattleLocations sheet and update `data/locations.json`.

### Sync Shop Tables

```bash
npm run sync-sheets-shop-tables
```

This will fetch the ShopLocations sheet and update `data/shop-tables.json`.

## Testing

Run the test scripts to verify parsing logic:

```bash
# Test battle parsing
npm run test-battle-parsing

# Test shop tables parsing
npm run test-shop-tables-parsing

# Test all data files
npm run test-data-files
```

## UI Display

### Location Search Page

- Location name is shown as a clickable link
- Location notes appear underneath the name in lighter text with a gray background

### Location Detail Page

#### Battles Section

Battles are displayed with:
- A colored tag badge with the battle category
- The battle name (trainer or static encounter)
- Battle notes in lighter gray text

Hovering over a tag shows its description tooltip.

#### Shop Tables Section

Each shop table is displayed in its own section with:
- Shop table name as the heading
- A table showing item icons, names, and prices
- Links to item detail pages (where applicable)

## Notes

- Battle IDs starting with letters (e.g., S023, S154) are treated as static encounters
- Numeric battle IDs (e.g., 491, 650) are treated as trainer battles
- Shop table references in locations must match the exact shop table names in ShopLocations
- Empty cells in the Google Sheets are ignored during parsing
- Make sure the Google Sheets are publicly accessible (Anyone with link can view)

## Migration from Old Format

The old trainer/boss trainer fields are still supported for backward compatibility:
- `trainers` array - legacy trainer IDs
- `bossTrainers` array - legacy boss trainer IDs
- `shops` array - legacy inline shop items (format: `{item, price}`)

New locations should use the `battles` array and `shopTables` array instead.
