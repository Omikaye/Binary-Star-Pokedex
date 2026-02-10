# ItemLocations Sheet Integration - Quick Reference

## What It Does

Reads item data from the **ItemLocations** sheet tab in your Google Sheets document and updates the `items` array for each location in `locations.json`.

## Why This Format?

The table-based format is optimized for managing items:
- ✅ Visual clarity - each location is clearly separated
- ✅ Easy to edit - add/remove items in a simple table
- ✅ Flexible - can have different numbers of items per location
- ✅ Works alongside BattleLocations sync

## Format

```
Route 1
Item             | Num | Method
Poké Ball        | 10  | From Kukui after the capture tutorial
Potion           | 5   | From Kukui after the capture tutorial
Miracle Medicine | 1   | North of the grass patch

Iki Town
Item        | Num | Method
Town Map    | 1   | From Hau
Potion      | 3   | From Mom
```

**Key points:**
- Each location starts with its name (on its own row)
- Next row is the header: Item, Num, Method
- Following rows are the items
- Blank rows separate tables (optional but recommended)

## Column Names

The parser is flexible with column names:

| Concept | Accepted Names |
|---------|----------------|
| Item | "Item", "Item Name" |
| Quantity | "Num", "Quantity", "Qty", "Number" |
| How to Obtain | "Method", "Obtain", "How to Obtain", "How", "Where" |

## How to Use

### 1. Find Your Sheet's GID

1. Open your Google Sheet
2. Click on the **ItemLocations** tab
3. Look at the URL: `https://docs.google.com/spreadsheets/d/SHEET_ID/edit#gid=XXXXXXX`
4. The number after `gid=` is your GID (e.g., `123456789`)

### 2. Make Sheet Public

1. Click **Share** (top right)
2. **Change to anyone with the link**
3. Set to **Viewer**
4. Click **Done**

### 3. Run the Sync

**Via GitHub Actions:**
1. Go to: https://github.com/Omikaye/Binary-Star-Pokedex/actions
2. Click **Sync Item Locations from Google Sheets**
3. Click **Run workflow**
4. Enter your GID
5. Click **Run workflow**
6. Wait ~30 seconds

**Locally:**
```bash
npm run sync-item-locations -- 123456789
```
(Replace `123456789` with your actual GID)

## What Gets Updated

**ONLY the `items` array for each location.**

Everything else is preserved:
- ✅ Encounters
- ✅ Trainers
- ✅ Shops
- ✅ Notes
- ✅ Static Pokemon
- ✅ Gifts/Trades

Example - Route 1 before sync:
```json
{
  "id": "route1",
  "name": "Route 1",
  "encounters": [...],
  "items": [
    {"item": "Old Item", "quantity": 1, "obtain": "Old method"}
  ],
  "trainers": [...],
  ...
}
```

After sync with ItemLocations:
```json
{
  "id": "route1",
  "name": "Route 1",
  "encounters": [...],  // ✅ Preserved
  "items": [
    {"item": "Poké Ball", "quantity": 10, "obtain": "From Kukui"},
    {"item": "Potion", "quantity": 5, "obtain": "From Kukui"}
  ],  // ⚠️ Replaced with data from sheet
  "trainers": [...],  // ✅ Preserved
  ...
}
```

## Location Matching

Locations are matched by **normalized ID**:

| Sheet Name | Normalized ID | Matches Location |
|------------|---------------|------------------|
| Route 1 | `route1` | "Route 1" |
| Iki Town | `ikitown` | "Iki Town" |
| Route 2 - North | `route2north` | "Route 2 - North" |
| Ten Carat Hill | `tencarathill` | "Ten Carat Hill" |

**Important:** The location must already exist in `locations.json` (created via BattleLocations sync).

## Common Workflows

### Workflow 1: Update Everything
```bash
# First sync complete location data
npm run sync-sheets-locations

# Then sync just the items
npm run sync-item-locations -- <GID>
```

### Workflow 2: Update Only Items
```bash
# If locations already exist, just update items
npm run sync-item-locations -- <GID>
```

### Workflow 3: Both via GitHub Actions
1. Run "Sync Google Sheets Locations" workflow
2. Then run "Sync Item Locations" workflow with GID

## Troubleshooting

### Error: "locations.json not found"

**Fix:** Run the BattleLocations sync first:
```bash
npm run sync-sheets-locations
```

### Error: "No location tables were found"

**Possible causes:**
- Wrong GID (not pointing to ItemLocations tab)
- Sheet is empty
- Format doesn't match expected structure

**Fix:**
1. Verify you're using the ItemLocations tab's GID
2. Check that tables have location names and headers
3. Ensure headers contain "Item", "Num", and "Method"

### Items not updating for a location

**Possible causes:**
- Location name doesn't match (check exact spelling)
- Location doesn't exist in locations.json yet

**Fix:**
1. Check location name matches exactly (after normalization)
2. Run BattleLocations sync first to create the location
3. Check the console output for which locations were updated

### Sheet appears inaccessible

**Fix:** Make sure the sheet is set to "Anyone with the link can view"

Test by opening this URL in an incognito window:
```
https://docs.google.com/spreadsheets/d/SHEET_ID/export?format=csv&gid=YOUR_GID
```

You should see CSV data download.

## Tips

### Best Practices

1. **Use both syncs together:**
   - BattleLocations for structure (name, notes, encounters, trainers)
   - ItemLocations for item details

2. **Keep tables organized:**
   - Add blank rows between tables
   - Keep locations in alphabetical order
   - Use consistent formatting

3. **Test locally first:**
   ```bash
   npm run sync-item-locations -- <GID>
   git diff data/locations.json
   ```

4. **Version control:**
   - The workflow auto-commits changes
   - You can revert via git if needed

### Alternative: Use BattleLocations for Items Too

You can still use the BattleLocations sheet for items if you prefer:
- Add an "Items" row in Column A
- Format: `Potion x5 - From Mom, Poké Ball - Hidden`

**ItemLocations is just an alternative format** that some find easier for managing many items.

## Examples

### Example 1: Simple Items
```
Route 1
Item       | Num | Method
Potion     | 5   | From Kukui
Poké Ball  | 10  | From Kukui
```

### Example 2: Complex Descriptions
```
Hau'oli City
Item             | Num | Method
Town Map         | 1   | From Hau after first battle
Poke Finder      | 1   | From Professor Kukui in Pokemon Center
Trainer Passport | 1   | From Professor Kukui after choosing starter
```

### Example 3: Multiple Locations
```
Route 1
Item           | Num | Method
Potion         | 5   | From Mom
Miracle Seed   | 1   | Hidden behind house

Route 2
Item         | Num | Method
Revive       | 1   | On ground near sign
Rare Candy   | 2   | Behind rock (requires Tauros Charge)

Route 3
Item           | Num | Method
Super Potion   | 3   | From Pokemon Center clerk
Antidote       | 5   | From Nurse Joy
```

## See Also

- **Full Guide:** `docs/ITEM_LOCATIONS_INTEGRATION.md`
- **BattleLocations:** `docs/GOOGLE_SHEETS_INTEGRATION.md`
- **Main User Guide:** `docs/USER_GUIDE.md`
