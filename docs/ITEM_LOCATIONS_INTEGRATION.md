# ItemLocations Sheet Integration

## Overview

This integration extends the Google Sheets sync to support the **ItemLocations** sheet, which uses a different format with multiple tables in one sheet. Each table represents one location and contains items found at that location.

## Sheet Format

The ItemLocations sheet uses a **table-based format** where:

1. **Table Name**: A single cell containing the location name
2. **Header Row**: Column headers (Item, Num, Method)
3. **Data Rows**: Items found at that location
4. **Blank Row**: Separates tables (optional)
5. Repeat for next location

### Example

```
Route 1
Item          | Num | Method
Poké Ball     | 10  | From Kukui after the capture tutorial
Potion        | 5   | From Kukui after the capture tutorial
Miracle Medicine | 1  | North of the grass patch next to the Trainer Tips sign

Iki Town
Item          | Num | Method
Town Map      | 1   | From Hau
Potion        | 3   | From Mom

Route 2
Item          | Num | Method
Revive        | 1   | On ground
Rare Candy    | 2   | Behind rock
```

## Column Headers

The parser is flexible with column names. It recognizes:

- **Item column**: Any column containing "item" (case-insensitive)
- **Quantity column**: Any column containing "num", "quantity", or "qty"
- **Method column**: Any column containing "method", "obtain", or "how"

So these all work:
- `Item, Num, Method`
- `Item, Quantity, How to Obtain`
- `Item Name, Qty, Obtain Method`

## Setup

### 1. Find the Sheet GID

1. Open your Google Sheet
2. Click on the **ItemLocations** tab
3. Look at the URL: `...edit#gid=XXXXXXX`
4. The number after `gid=` is the GID you need

### 2. Make the Sheet Public

Same as with BattleLocations:

1. Click **Share** (top right)
2. Click **Change to anyone with the link**
3. Set to **Viewer**
4. Click **Done**

## Usage

### Via GitHub Actions (Recommended)

1. Go to: https://github.com/Omikaye/Binary-Star-Pokedex/actions
2. Click **Sync Item Locations from Google Sheets** (left sidebar)
3. Click **Run workflow** (top right)
4. Enter the **GID** of your ItemLocations sheet tab
5. Click **Run workflow**

The workflow will:
- Fetch the ItemLocations sheet
- Parse all location tables
- Merge the items into existing `locations.json`
- Commit and push the changes

### Locally

```bash
# Install dependencies
npm install

# Run sync (provide the GID as an argument)
npm run sync-item-locations -- <GID>

# Example
npm run sync-item-locations -- 123456789
```

### Testing

Test the parsing logic without affecting data:

```bash
npm run test-item-locations-parsing
```

## How It Works

1. **Fetches** the ItemLocations sheet as CSV
2. **Parses** the table-based format:
   - Identifies location names (table headers)
   - Finds header rows (Item, Num, Method)
   - Extracts item data rows
3. **Merges** items into existing locations in `locations.json`
4. **Preserves** other location data (encounters, trainers, notes, etc.)

## Important Notes

### Merging Behavior

- ⚠️ **Replaces** the `items` array for each location with data from the sheet
- ✅ **Preserves** all other location data (encounters, trainers, shops, notes, etc.)
- ✅ Locations not in ItemLocations sheet keep their existing items

### Location Matching

Locations are matched by ID (normalized name). For example:
- "Route 1" → `route1`
- "Iki Town" → `ikitown`
- "Route 2 - North" → `route2north`

The location must already exist in `locations.json` (created via the main BattleLocations sync).

### Workflow Order

**Recommended workflow:**

1. First sync BattleLocations (creates/updates location structure)
2. Then sync ItemLocations (updates just the items for each location)

Or use both together:
```bash
npm run sync-sheets-locations  # Main location data
npm run sync-item-locations -- <GID>  # Item data
```

## Troubleshooting

### "locations.json not found"

**Solution:** Run the main location sync first:
```bash
npm run sync-sheets-locations
```

### "No location tables were found"

**Possible causes:**
- Sheet is empty
- GID is incorrect
- Format doesn't match expected structure

**Solution:** 
1. Verify the GID is for the ItemLocations tab
2. Check that tables follow the format (Location name, then headers, then data)
3. Ensure headers contain "Item", "Num"/"Quantity", and "Method"/"Obtain"

### Items not updating for a location

**Possible causes:**
- Location name in sheet doesn't match location in locations.json
- Location doesn't exist in locations.json yet

**Solution:**
1. Check location name matches (case-insensitive, but exact match after normalization)
2. Run BattleLocations sync first to create the location

### Sheet appears empty or inaccessible

Same as BattleLocations - ensure the sheet is publicly viewable.

## Example Output

After syncing, locations.json will have updated items:

```json
{
  "locations": [
    {
      "id": "route1",
      "name": "Route 1",
      "notes": "Starting route",
      "encounters": [...],
      "items": [
        {
          "item": "Poké Ball",
          "quantity": 10,
          "obtain": "From Kukui after the capture tutorial"
        },
        {
          "item": "Potion",
          "quantity": 5,
          "obtain": "From Kukui after the capture tutorial"
        }
      ],
      ...
    }
  ]
}
```

## Related Files

- **Script**: `scripts/sync-google-sheets-item-locations.js`
- **Test**: `scripts/test-item-locations-parsing.js`
- **Workflow**: `.github/workflows/sync-item-locations.yml`
- **Output**: `data/locations.json` (merged with existing data)

## Advanced: Automating Both Syncs

You could create a combined workflow that syncs both sheets:

```yaml
- name: Sync main locations
  run: npm run sync-sheets-locations

- name: Sync item locations
  run: npm run sync-item-locations -- ${{ inputs.item_locations_gid }}
```

This ensures items are always in sync with the overall location data.
