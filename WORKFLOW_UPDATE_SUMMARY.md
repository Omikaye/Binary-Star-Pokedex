# Summary of Changes: Unified Google Sheets Sync Workflow

## What Was Changed

I've updated the Google Sheets synchronization system to address your requirements:

### 1. ✅ Fixed "Sync Item Locations" Workflow Error
**Problem**: The workflow required manual GID input each time and was failing.

**Solution**: The GID (1958269454) is now hardcoded in the unified workflow, eliminating the need for manual input.

### 2. ✅ Combined Workflows into One
**Problem**: You had to run two separate workflows to sync locations and items.

**Solution**: The **"Sync Google Sheets Locations"** workflow now runs all three syncs in one click:
- BattleLocations (location data)
- ShopLocations (shop tables)
- ItemLocations (item data)

### 3. ✅ Added Table-Based Format Support for ShopLocations
**Problem**: The ShopLocations sheet format you described (table-based with Item/Cost columns) was not supported.

**Solution**: Updated the shop tables sync script to support BOTH formats:

**NEW Table-Based Format** (matches your example):
```
Route 1
Item          Cost
Move Deleter  Free
Smoke Ball    $1,120
Cleanse Tag   $770
```

**Legacy Column-Based Format** (still supported):
```
Pokémart Basic      | Boutique Hau'oli
Poké Ball - $200    | Silk Scarf - $1000
Potion - $200       | Muscle Band - $1000
```

The script automatically detects which format you're using!

## How to Use

### Running the Unified Workflow

1. Go to: https://github.com/Omikaye/Binary-Star-Pokedex/actions
2. Click: **"Sync Google Sheets Locations"**
3. Click: **"Run workflow"** (top right)
4. Click: **"Run workflow"** to start

That's it! The workflow will:
- ✅ Sync battle locations from BattleLocations sheet
- ✅ Sync shop tables from ShopLocations sheet (GID: 1527137776)
- ✅ Sync item locations from ItemLocations sheet (GID: 1958269454)
- ✅ Commit all changes with a single commit

### Your Google Sheets Format

Based on your problem statement, you can now use this format in your **ShopLocations** sheet:

```
Route 1
Item	         Cost
Move Deleter	Free
Smoke Ball	$1,120
Cleanse Tag	$770
Sticky Barb	$1,800
Lagging Tail	$2,220
Quick Claw	$2,000
Binding Band	$3,300
Zoom Lens	$2,040
Audinite	$41,000

(blank row)

Route 2
Item	         Cost
Potion	        $200
Super Potion	$700
...
```

**Important**: 
- Each table starts with the location/shop name alone in the first cell
- Next row has headers: "Item" and "Cost" (or "Price")
- Following rows contain item data
- Blank rows separate tables
- Tables are 2 columns wide with 1 column separator between tables (as you mentioned)

### ItemLocations Sheet

Your **ItemLocations** sheet should use this format:

```
Route 1
Item	         Num	Method
Poké Ball	10	From Kukui
Potion	        5	From Kukui

(blank row)

Ten Carat Beach
Item	         Num	Method
X Attack	1	Hidden item
...
```

## Files Changed

1. **`.github/workflows/sync-google-sheets-locations.yml`**
   - Updated to run all three sync scripts
   - Hardcoded ItemLocations GID (1958269454)
   - Commits both `locations.json` and `shop-tables.json`

2. **`scripts/sync-google-sheets-shop-tables.js`**
   - Added `parseTableBasedShopTables()` function
   - Auto-detects format (table-based vs column-based)
   - Supports your requested table format

3. **`scripts/test-shop-tables-parsing.js`**
   - Tests both formats
   - Validates the parsing logic

4. **`GOOGLE_SHEETS_SYNC_GUIDE.md`** (NEW)
   - Comprehensive guide for using the sync system
   - Format specifications
   - Troubleshooting tips

5. **`README.md`**
   - Updated to reflect unified workflow
   - Links to new guide

## Testing

All parsing tests pass:

✅ **Column-based format** (legacy):
```bash
npm run test-shop-tables-parsing
# ✓ All tests passed!
```

✅ **Table-based format** (new):
```bash
npm run test-shop-tables-parsing
# ✓ All tests passed!
```

✅ **Item locations**:
```bash
npm run test-item-locations-parsing
# ✓ All tests passed!
```

## Answering Your Questions

> "Each of these sheets contains tables, is it possible to read the data from each table using the table headers and names?"

**Answer**: YES! The updated sync script now reads table-based data using:
- Table names (e.g., "Route 1") to identify each table
- Column headers ("Item", "Cost"/"Price") to identify data columns
- Blank rows to separate tables

> "If not and there are issues with the current format the data is in, I will format it in a more readable name. Please suggest if the current method is not appropriate."

**Answer**: Your format is PERFECT and now fully supported! The table-based format you described is:
- ✅ Easy to read and edit
- ✅ Clearly organized by location
- ✅ Flexible (supports "Cost", "Price", "Free", etc.)
- ✅ Compatible with the new sync script

You can use the format exactly as you described in your problem statement.

## What's Next?

1. **Format your ShopLocations sheet** using the table-based format
2. **Run the unified workflow** to sync all data
3. **Verify** the data appears correctly on your site

If you encounter any issues, check the [GOOGLE_SHEETS_SYNC_GUIDE.md](GOOGLE_SHEETS_SYNC_GUIDE.md) for troubleshooting tips.

## Benefits

✅ **Single workflow** - One click syncs everything  
✅ **Table-based format** - Easier to read and edit in Google Sheets  
✅ **No manual input** - GIDs are hardcoded  
✅ **Flexible** - Supports both old and new formats  
✅ **Well-tested** - All parsing tests pass  
✅ **Documented** - Comprehensive guide included
