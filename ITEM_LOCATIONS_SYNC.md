# How to Sync Item Locations for Ten Carat Beach

## Quick Instructions

The location pages are now fixed and working! To add item locations to "Ten Carat Beach" and other locations:

### Option 1: Using GitHub Actions (Recommended)

1. Go to https://github.com/Omikaye/Binary-Star-Pokedex/actions
2. Click **"Sync Item Locations from Google Sheets"** in the left sidebar
3. Click **"Run workflow"** button (top right)
4. Enter the GID: `1958269454` (from the ItemLocations sheet)
5. Click **"Run workflow"**

The workflow will automatically:
- Fetch the item data from the Google Sheets ItemLocations tab
- Parse the "Ten Carat Beach" table and any other location tables
- Update the items in `data/locations.json`
- Commit and push the changes

### Option 2: Locally

```bash
npm install
npm run sync-item-locations -- 1958269454
```

## What Was Fixed

### 1. ✅ Location Crash Fixed
**Problem**: Locations other than "Ten Carat Beach" crashed when loading due to:
- `window.StaticEncounters` is an object, not an array (was using `.find()` on it)

**Solution**: Changed to use direct object lookup: `staticEncounters[battleID]`

### 2. ✅ Trainer Names Display Fixed
**Problem**: Trainer IDs like "1", "25", "26" didn't match the 3-digit format in trainers.json ("001", "025", "026")

**Solution**: Pad all trainer IDs to 3 digits using `battleID.padStart(3, '0')` before lookup

### Results:
- ✅ All locations now load without crashing (Route 1, Iki Town, Ten Carat Beach)
- ✅ Trainer names display correctly:
  - Trainer 001 → "Lass Madison"
  - Trainer 025 → "Youngster Jimmy"
  - Trainer 026 → "Youngster Kevin"
  - Trainer 512 → "Swim Gal Natasha"
- ✅ Static encounters display correctly (S152 → "Yungoos", S154 → "Rattata 1")

## About Item Locations

Item locations are stored in the Google Sheets "ItemLocations" tab. The sheet uses a table-based format where each location has its own table with:
- Location name as the table header
- Column headers: Item, Num, Method
- Data rows with items found at that location

Once you sync the sheet, items will appear in the Items section of each location page with icons, quantities, and how to obtain them.

## Testing

After syncing, visit the locations to verify items are displayed:
- http://localhost:1234/Binary-Star-Pokedex/locations/tencaratbeach
- http://localhost:1234/Binary-Star-Pokedex/locations/route1
- http://localhost:1234/Binary-Star-Pokedex/locations/ikitown

Items should appear in an orange "Items" section with:
- Item icon
- Item name (linked if it exists in the item database)
- Quantity
- How to obtain

## Related Documentation

For more details, see:
- `docs/ITEM_LOCATIONS_INTEGRATION.md` - Full integration documentation
- `scripts/test-item-locations-parsing.js` - Test the parser locally
