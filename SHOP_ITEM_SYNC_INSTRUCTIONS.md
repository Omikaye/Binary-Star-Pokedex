# Shop and Item Locations Sync Instructions

The display code for shops and items is already working correctly. You just need to sync the data from Google Sheets.

## Current Status

✅ **Location pages display shops** from `shop-tables.json`
✅ **Location pages display items** from `locations.json`  
❌ **Shop data needs to be synced** from Google Sheets
❌ **Item data needs to be synced** from Google Sheets

## How to Fix

### 1. Fix Shop Name Mismatch

**Problem**: Route 1 references `"Pokemart"` but shop-tables.json has `"Pokemart Basic"`

**Solution A** (Recommended): Update shop-tables.json to have exactly "Pokemart"
```bash
# First, ensure the Google Sheets ShopLocations tab has a column named exactly "Pokemart"
# Then run the sync:
npm run sync-shop-tables
```

**Solution B**: Update locations.json to reference "Pokemart Basic"
```json
{
  "id": "route1",
  "name": "Route 1",
  "shopTables": ["Pokemart Basic"]  // Changed from "Pokemart"
}
```

### 2. Sync Item Locations

Run the item locations sync with the GID from the problem statement:

```bash
npm run sync-item-locations -- 1958269454
```

This will:
- Read the "ItemLocations" sheet (GID 1958269454)
- Find tables named "Route 1", "Ten Carat Beach", "Iki Town"
- Merge items into the corresponding location in `data/locations.json`

## Expected Result

After syncing, visiting Route 1 should show:

### Pokemart Section
- Poké Ball - $200
- Potion - $200
- Antidote - $200
- Paralyze Heal - $200
- Awakening - $100

### Items Section
- (Items from the "Route 1" table in ItemLocations sheet)
- Each item with icon, quantity, and how to obtain

## Verification

1. Visit http://localhost:1234/Binary-Star-Pokedex/locations/route1
2. Check that "Pokemart" section shows items (not "Shop data not available")
3. Check that "Items" section shows items from the sheet
4. Repeat for Ten Carat Beach and Iki Town

## Technical Details

### Shop Tables Format
- **File**: `data/shop-tables.json`
- **Structure**: `{ "shopTables": { "TableName": { "name": "...", "items": [...] } } }`
- **Referenced by**: `locations.json` → `shopTables: ["TableName"]`

### Item Locations Format
- **File**: `data/locations.json`
- **Structure**: Each location has `items: [{ item, quantity, obtain }]`
- **Populated by**: `scripts/sync-google-sheets-item-locations.js`

### Google Sheets Structure

**ShopLocations Tab** (Column-based):
```
| Pokemart       | Boutique       |
|----------------|----------------|
| Poké Ball - $200 | Silk Scarf - $1000 |
| Potion - $200  | Muscle Band - $1000 |
```

**ItemLocations Tab** (Table-based):
```
Route 1

Item          | Num | Method
------------- | --- | ------
Potion        | 1   | Found on ground
Antidote      | 1   | Given by NPC

Ten Carat Beach

Item          | Num | Method
------------- | --- | ------
X Attack      | 1   | Hidden item
```

## Scripts Available

- `npm run sync-shop-tables` - Sync shop data from ShopLocations sheet
- `npm run sync-item-locations -- <GID>` - Sync item data from ItemLocations sheet
- `npm run test-shop-tables-parsing` - Test shop table parsing locally
- `npm run test-item-locations-parsing` - Test item locations parsing locally
