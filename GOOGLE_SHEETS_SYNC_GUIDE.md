# Google Sheets Sync Guide

This guide explains how to sync data from Google Sheets to the Binary Star Pokedex.

## Quick Start

The **"Sync Google Sheets Locations"** workflow now syncs all three data types in one go:
1. Battle locations (from BattleLocations sheet)
2. Shop tables (from ShopLocations sheet)
3. Item locations (from ItemLocations sheet)

### Running the Workflow

1. Go to https://github.com/Omikaye/Binary-Star-Pokedex/actions
2. Click **"Sync Google Sheets Locations"** in the left sidebar
3. Click **"Run workflow"** button (top right)
4. Click **"Run workflow"** to start

The workflow will:
- Fetch data from all three Google Sheets
- Update `data/locations.json` and `data/shop-tables.json`
- Commit and push the changes automatically

## Google Sheets Format

### BattleLocations Sheet (GID: 0)

**Format**: Column-based
- Each column represents one location
- First cell: Location name
- Subsequent cells: Location properties (encounters, trainers, etc.)

### ShopLocations Sheet (GID: 1527137776)

**Edit link**: https://docs.google.com/spreadsheets/d/1x21QTXNVGAvrQsiDCGzF-m09ASGW8ofgxjoqcLmQYkE/edit?gid=1527137776#gid=1527137776

**Format**: Table-based (NEW! Updated to support this format)

Each shop/location is represented as a table:

```
Route 1
Item          Cost
Move Deleter  Free
Smoke Ball    $1,120
Cleanse Tag   $770
Sticky Barb   $1,800

Route 2
Item          Price
Potion        $200
Super Potion  $700
```

**Format rules**:
- Table name (e.g., "Route 1") is alone in first cell, other cells empty
- Next row has headers: "Item" and "Cost" (or "Price")
- Following rows contain item data
- Blank row separates tables

The sync script also supports the **legacy column-based format** for backwards compatibility:

```
Pokémart Basic      | Boutique Hau'oli
Poké Ball - $200    | Silk Scarf - $1000
Potion - $200       | Muscle Band - $1000
```

### ItemLocations Sheet (GID: 1958269454)

**Edit link**: https://docs.google.com/spreadsheets/d/1x21QTXNVGAvrQsiDCGzF-m09ASGW8ofgxjoqcLmQYkE/edit?gid=1958269454#gid=1958269454

**Format**: Table-based

Each location is represented as a table:

```
Route 1
Item             Num   Method
Poké Ball        10    From Kukui after the capture tutorial
Potion           5     From Kukui after the capture tutorial

Iki Town
Item             Num   Method
Town Map         1     From Hau
Potion           3     From Mom
```

**Format rules**:
- Table name (location name) is alone in first cell
- Next row has headers: "Item", "Num"/"Quantity", "Method"/"Obtain"
- Following rows contain item data
- Blank row separates tables

## Data Files

### data/locations.json

Contains location data including:
- Location ID and name
- Encounters (wild Pokémon)
- Trainers and battles
- Items found at the location
- Shop table references (via `shopTables` array)

Example:
```json
{
  "id": "route1",
  "name": "Route 1",
  "shopTables": ["Route 1"],
  "items": [
    {
      "item": "Poké Ball",
      "quantity": 10,
      "obtain": "From Kukui after the capture tutorial"
    }
  ]
}
```

### data/shop-tables.json

Contains shop data with items and prices:

```json
{
  "shopTables": {
    "Route 1": {
      "name": "Route 1",
      "items": [
        {
          "item": "Move Deleter",
          "price": "Free"
        },
        {
          "item": "Smoke Ball",
          "price": "$1,120"
        }
      ]
    }
  }
}
```

## Manual Sync (Local Development)

You can also run the sync scripts locally:

### Sync all data
```bash
npm run sync-sheets-locations
npm run sync-sheets-shop-tables
npm run sync-item-locations -- 1958269454
```

### Sync individual data types
```bash
# Locations only
npm run sync-sheets-locations

# Shop tables only
npm run sync-sheets-shop-tables

# Item locations only (requires GID)
npm run sync-item-locations -- 1958269454
```

## Testing

Test the parsing logic without network access:

```bash
# Test shop tables parsing (tests both column and table formats)
npm run test-shop-tables-parsing

# Test item locations parsing
npm run test-item-locations-parsing

# Test battle/location parsing
npm run test-battle-parsing
```

## Troubleshooting

### Workflow fails with "Sheet appears to be empty"

**Cause**: The Google Sheet is not publicly accessible or the GID is incorrect.

**Solution**:
1. Open the Google Sheet
2. Click "Share" → "Anyone with the link can view"
3. Verify the GID in the sheet URL matches the one in the script

### Shop tables not showing on location pages

**Cause**: Mismatch between `shopTables` in `locations.json` and shop table names in `shop-tables.json`.

**Solution**:
1. Check the `shopTables` array in the location (e.g., `["Route 1"]`)
2. Ensure a matching shop table exists in `shop-tables.json` with the same name
3. Shop table names are case-sensitive

### Items not appearing after sync

**Cause**: Location ID mismatch between the table name and location ID.

**Solution**:
1. The table name in ItemLocations sheet should match the location name (e.g., "Route 1")
2. The sync script converts this to an ID (e.g., "route1")
3. Ensure the location exists in `locations.json` with the matching ID

## Sheet Permissions

All sheets must be publicly accessible:
- File → Share → Anyone with the link can view
- The sheets are read-only; the sync scripts only fetch CSV exports

## Architecture

The sync process:
1. **Fetch**: Download CSV export from Google Sheets
2. **Parse**: Parse CSV and extract data using format-specific parsers
3. **Transform**: Convert to JSON format used by the application
4. **Merge**: Merge new data with existing data (for item locations)
5. **Write**: Save updated JSON files
6. **Commit**: GitHub Actions commits and pushes changes

## Related Files

- `.github/workflows/sync-google-sheets-locations.yml` - GitHub Actions workflow
- `scripts/sync-google-sheets-locations.js` - Locations sync script
- `scripts/sync-google-sheets-shop-tables.js` - Shop tables sync script
- `scripts/sync-google-sheets-item-locations.js` - Item locations sync script
- `scripts/test-*.js` - Test scripts for local validation
- `data/locations.json` - Location data
- `data/shop-tables.json` - Shop data

## What Changed?

### Previous Behavior
- Two separate workflows: one for locations, one for item locations
- Item locations workflow required manual GID input each time
- Shop tables sync only supported column-based format
- Shop tables were not synced as part of the workflow

### New Behavior
- **Single unified workflow** syncs all three data types
- Item locations GID is hardcoded (1958269454)
- Shop tables sync **supports both table-based and column-based formats**
- Shop tables are now synced automatically with locations and items

### Benefits
- **Easier to use**: One click to sync all data
- **More flexible**: Table-based format is easier to read and edit in Google Sheets
- **More reliable**: All syncs happen together, reducing chance of inconsistent data
- **Better organized**: Shop data per location (table-based) is clearer than columns
