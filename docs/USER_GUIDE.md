# Google Sheets Integration - User Guide

## What Was Built

Your Binary Star Pokédex now has Google Sheets integration! You can manage location data in a Google Spreadsheet and sync it to your site with a single click.

## What You Need To Do

### Step 1: Make Your Google Sheet Public

Your sheet at: https://docs.google.com/spreadsheets/d/1x21QTXNVGAvrQsiDCGzF-m09ASGW8ofgxjoqcLmQYkE/edit?gid=0#gid=0

**Must be publicly accessible** for the sync to work:

1. Open your Google Sheet
2. Click **Share** (top right)
3. Click **Change to anyone with the link**
4. Set to **Viewer** (not Editor)
5. Click **Done**

### Step 2: Format Your Sheet

The sheet should have:
- **Column A**: Field labels/descriptions
- **Columns B, C, D, etc.**: Each column is one location

#### Required Row:
- **Name** (in Column A) - with location names in subsequent columns

#### Optional Rows (add as needed):
- Notes
- Grass Encounters
- Cave Encounters
- Water Encounters
- Fishing Encounters
- Static Pokemon
- Trainers
- Boss Trainers
- Gifts/Trades
- Shops
- Items

See `docs/GOOGLE_SHEETS_TEMPLATE.md` for a complete example table you can copy.

### Step 3: Run the Sync

1. Go to: https://github.com/Omikaye/Binary-Star-Pokedex/actions
2. Click **Sync Google Sheets Locations** (left sidebar)
3. Click **Run workflow** (top right)
4. Click the green **Run workflow** button
5. Wait ~30-60 seconds for completion

### Step 4: Verify Results

After the workflow completes:
- Check your repo for a new commit: "Update locations.json from Google Sheets"
- View `data/locations.json` to see the converted data
- Visit your Pokédex site → Locations tab to see the new data

## Format Examples

### Encounters
```
Grass Encounters: (Levels 3-5): Pikachu (30%), Rattata (20%, SOS: Raticate)
Water Encounters: (Levels 10-15): Magikarp (100%)
```

### Items
```
Items: Potion x5 - From Mom, Poké Ball - Hidden in grass, Rare Candy x2 - Behind rock
```

### Shops
```
Shops: Potion - $200, Revive - $1500, Poké Ball - $200
```

### Trainers
```
Trainers: 001, 002, 003
Boss Trainers: 010
```

### Static Pokemon
```
Static Pokemon: Meowth, Eevee, Pikachu
```

## Testing Without Publishing

To test your data locally before publishing:

1. Make sure Node.js is installed
2. Clone your repository
3. Run: `npm install`
4. Run: `npm run sync-sheets-locations`
5. Check `data/locations.json`

## Troubleshooting

### "Sheet appears to be empty or inaccessible"

**Solution:** Make sure your sheet is set to "Anyone with the link can view"

Test by opening this URL in an incognito window:
```
https://docs.google.com/spreadsheets/d/1x21QTXNVGAvrQsiDCGzF-m09ASGW8ofgxjoqcLmQYkE/export?format=csv&gid=0
```

You should see CSV data download. If you get an error, the sheet isn't public.

### "No locations were converted"

**Possible causes:**
- Column A doesn't have a "Name" row
- Location names aren't filled in columns B, C, D, etc.
- The sheet tab isn't named "BattleLocations" or gid isn't 0

**Solution:** Check your sheet structure matches the template

### Workflow Permission Error

**Solution:** Go to Settings → Actions → General → Workflow permissions → Enable "Read and write permissions"

## Documentation

Full documentation is available:
- **Quick Start**: `docs/SETUP_GOOGLE_SHEETS.md`
- **Template & Examples**: `docs/GOOGLE_SHEETS_TEMPLATE.md`
- **Complete Guide**: `docs/GOOGLE_SHEETS_INTEGRATION.md`

## Need a Different Sheet?

The integration is currently configured for:
- Sheet ID: `1x21QTXNVGAvrQsiDCGzF-m09ASGW8ofgxjoqcLmQYkE`
- Sheet GID: `0` (BattleLocations tab)

To use a different sheet:
1. Edit `scripts/sync-google-sheets-locations.js`
2. Update `SHEET_ID` and `SHEET_GID` constants
3. Commit and push the change

## Next Steps

After you have this working:
1. You can add automatic daily syncs by modifying the workflow
2. You can add multiple sheet tabs for different data types
3. You can extend the parser to support custom field types

Enjoy your Google Sheets-powered Pokédex! 🎉
