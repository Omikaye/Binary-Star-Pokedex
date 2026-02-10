# Google Sheets Template for Binary Star Pokédex Locations

This file provides a template for setting up your Google Sheets document for location data.

## Sheet Structure

Copy this table structure to your "BattleLocations" sheet in Google Sheets:

| Field Description | Route 1 | Iki Town | Route 2 | Your Location 1 | Your Location 2 |
|-------------------|---------|----------|---------|-----------------|-----------------|
| Name | Route 1 | Iki Town | Route 2 | | |
| Notes | Starting route where you begin your journey | Your peaceful home town | The second route with tougher Pokemon | | |
| Grass Encounters | (Levels 3-5): Yungoos (10%), Rattata (20%, SOS: Raticate), Pikachu (5%) | | (Levels 4-6): Pidgey (40%), Spearow (30%) | | |
| Cave Encounters | | | | | |
| Water Encounters | | | (Levels 5-10): Magikarp (100%) | | |
| Fishing Encounters | | | | | |
| Static Pokemon | | Meowth, Eevee | | | |
| Trainers | 001, 002 | | 003, 004, 005 | | |
| Boss Trainers | | 010 | | | |
| Gifts/Trades | | Starter Pokemon from Professor | | | |
| Shops | Potion - $200, Poké Ball - $200 | | Super Potion - $700, Revive - $1500 | | |
| Items | Potion x5 - From Mom, Poké Ball - Hidden in grass | Town Map - From Hau | Revive - On ground, Rare Candy x2 - Behind rock | | |

## Field Descriptions (Column A)

Keep these field labels in Column A exactly as shown. The script matches these labels (case-insensitive, partial match):

### Required Fields
- **Name**: The location name (this is the only required field)

### Optional Fields
- **Notes**: Description or notes about the location
- **Grass Encounters**: Pokemon found in grass
- **Cave Encounters**: Pokemon found in caves
- **Water Encounters**: Pokemon found in water (surfing)
- **Fishing Encounters**: Pokemon found while fishing
- **Static Pokemon**: Static/guaranteed Pokemon encounters
- **Trainers**: Regular trainer IDs
- **Boss Trainers**: Important/boss trainer IDs
- **Gifts/Trades**: Text description of gifts or trades
- **Shops**: Items available for purchase
- **Items**: Items found in the location

You can add more encounter types by adding rows like "Beach Encounters", "Sky Encounters", etc.

## Format Guidelines

### Encounters
Format: `(Levels MIN-MAX): Pokemon1 (chance%), Pokemon2 (chance%, SOS: Pokemon3, Pokemon4)`

Examples:
- `(Levels 3-5): Pikachu (30%)` - Single Pokemon, 30% chance
- `(Levels 10): Snorlax (100%)` - Same min/max level
- `(Levels 5-8): Rattata (20%, SOS: Raticate)` - With SOS chain
- `(Levels 3-7): Pidgey (40%), Spearow (30%), Fearow (5%, SOS: Pidgeot, Staraptor)` - Multiple Pokemon

Leave blank if no encounters of that type.

### Static Pokemon
Format: Comma-separated list

Examples:
- `Meowth, Eevee, Pikachu`
- `001`

### Trainers / Boss Trainers
Format: Comma-separated trainer IDs

Examples:
- `001, 002, 003`
- `TRAINER_001, TRAINER_002`

### Gifts/Trades
Format: Free text description

Examples:
- `Starter Pokemon from Professor Oak`
- `Trader requests a Spearow in exchange for a Farfetch'd`

### Shops
Format: `Item1 - Price1, Item2 - Price2`

Examples:
- `Potion - $200, Revive - $1500`
- `TM01 - $3000`
- `Poké Ball - $200, Great Ball - $600, Ultra Ball - $1200`

### Items
Format: `Item1 x#quantity - How to obtain, Item2 - How to obtain`

Examples:
- `Potion x5 - From Mom`
- `Poké Ball - Hidden in grass, Revive - On ground`
- `Rare Candy x2 - Behind rock, TM01 - From NPC after battle`

Note: Default quantity is 1 if not specified.

## Empty Cells

Leave cells blank (or use "None") for locations that don't have that type of data.

## Tips

1. **Start Simple**: Begin with just Name and Notes for each location
2. **Add Gradually**: Add encounter data, trainers, items, etc. as you collect the information
3. **Copy Columns**: Duplicate existing location columns to create new ones quickly
4. **Use Formulas**: You can use Google Sheets formulas to help generate repeated patterns
5. **Regular Sync**: Run the GitHub Action regularly to keep your site updated

## Making the Sheet Public

Before the sync script can access your sheet:

1. Click "Share" button (top right)
2. Click "Change to anyone with the link"
3. Set permission to "Viewer"
4. Click "Copy link"

## Configuring the Script

The script is already configured to use your sheet:

```javascript
const SHEET_ID = '1x21QTXNVGAvrQsiDCGzF-m09ASGW8ofgxjoqcLmQYkE';  // Your current sheet
const SHEET_GID = '0';  // BattleLocations sheet tab
```

To change to a different sheet:
1. Get your Google Sheets URL: `https://docs.google.com/spreadsheets/d/SHEET_ID/edit#gid=GID`
2. Update `SHEET_ID` and `SHEET_GID` in `scripts/sync-google-sheets-locations.js`

## Testing

After setting up your sheet, you can:

1. Run locally: `npm run sync-sheets-locations`
2. Check the output in `data/locations.json`
3. Test parsing logic: `npm run test-sheets-parsing`
4. Trigger GitHub Action: Go to Actions → Sync Google Sheets Locations → Run workflow
