# Google Sheets Integration for Locations

## Overview

This integration allows you to manage location data via Google Sheets and sync it to the Binary Star Pokédex site.

## Setup

### 1. Google Sheets Format

The Google Sheets document should be structured as follows:

- **Column A**: Field descriptions/labels (e.g., "Name", "Notes", "Grass Encounters", etc.)
- **Columns B, C, D...**: Each column represents one location

Example structure:

| Field Description | Route 1 | Iki Town | Route 2 |
|-------------------|---------|----------|---------|
| Name | Route 1 | Iki Town | Route 2 |
| Notes | Starting route | Your home town | Second route |
| Grass Encounters | (Levels 3-5): Pikachu (30%), Rattata (20%) | | (Levels 4-6): Pidgey (40%) |
| Water Encounters | | | (Levels 5-10): Magikarp (100%) |
| Static Pokemon | | Meowth, Eevee | |
| Trainers | 001, 002 | | 003, 004, 005 |
| Boss Trainers | | 010 | |
| Gifts/Trades | | Starter Pokemon from Prof | |
| Shops | Potion - $200, Poké Ball - $200 | | Super Potion - $700 |
| Items | Potion x5 - From Mom, Poké Ball - Hidden | Town Map - From Hau | Revive - On ground |

### 2. Field Descriptions

Column A should contain these field labels (case-insensitive, partial matches work):

- **Name** (required): The location name
- **Notes** or **Description**: Optional notes about the location
- **Grass Encounters**, **Cave Encounters**, **Water Encounters**, **Fishing Encounters**, etc.: Pokemon encounters by area type
  - Format: `(Levels X-Y): Pokemon1 (chance%), Pokemon2 (chance%, SOS: SOSPokemon1, SOSPokemon2)`
  - Example: `(Levels 3-5): Yungoos (10%), Rattata (20%, SOS: Raticate)`
- **Static Pokemon**: Comma-separated list of static Pokemon IDs/names
- **Trainers**: Comma-separated list of trainer IDs
- **Boss Trainers**: Comma-separated list of boss trainer IDs  
- **Gifts/Trades**: Text description of any gifts or trades available
- **Shops**: Items and prices
  - Format: `Item1 - Price1, Item2 - Price2`
  - Example: `Potion - $200, Revive - $1500`
- **Items**: Items found in the location
  - Format: `Item1 x#quantity - How to obtain, Item2 - How to obtain`
  - Example: `Potion x5 - From Mom, Rare Candy - Hidden behind rock`

### 3. Making the Sheet Public

**Important**: The Google Sheet must be publicly accessible for the script to read it.

1. Click "Share" in the top right of your Google Sheet
2. Click "Change to anyone with the link"
3. Set permission to "Viewer"
4. Copy the share link

### 4. Configuration

The sheet details are configured in `scripts/sync-google-sheets-locations.js`:

```javascript
const SHEET_ID = '1x21QTXNVGAvrQsiDCGzF-m09ASGW8ofgxjoqcLmQYkE';
const SHEET_GID = '0'; // BattleLocations sheet
```

To change the source sheet:
1. Get your Google Sheets URL: `https://docs.google.com/spreadsheets/d/SHEET_ID/edit#gid=GID`
2. Update `SHEET_ID` and `SHEET_GID` in the script

## Usage

### Manual Sync via GitHub Actions

1. Go to your repository on GitHub
2. Click "Actions" tab
3. Select "Sync Google Sheets Locations" workflow
4. Click "Run workflow"
5. Click the green "Run workflow" button

The workflow will:
- Fetch data from the Google Sheet
- Convert it to the locations.json format
- Commit and push the updated locations.json file
- Trigger the deploy workflow (if configured)

### Local Testing

You can also run the sync locally:

```bash
npm run sync-sheets-locations
```

This requires internet access to fetch the Google Sheets data.

## Output Format

The script generates `data/locations.json` in this format:

```json
{
  "locations": [
    {
      "id": "route1",
      "name": "Route 1",
      "notes": "Starting route",
      "encounters": [
        {
          "spot": "Grass",
          "levelRange": { "min": 3, "max": 5 },
          "pokemon": [
            { "name": "Pikachu", "chance": 30, "sos": [] },
            { "name": "Rattata", "chance": 20, "sos": ["Raticate"] }
          ]
        }
      ],
      "giftsTrades": "",
      "staticPokemon": [],
      "trainers": ["001", "002"],
      "bossTrainers": [],
      "shops": [
        { "item": "Potion", "price": "$200" }
      ],
      "items": [
        { "item": "Potion", "quantity": 5, "obtain": "From Mom" }
      ]
    }
  ]
}
```

## Troubleshooting

### "Sheet appears to be empty or inaccessible"

1. Verify the sheet is set to "Anyone with the link can view"
2. Check that the SHEET_ID and SHEET_GID are correct
3. Make sure the "BattleLocations" sheet exists
4. Ensure there is data in the sheet (at least column headers in column A)

### Locations not appearing correctly

1. Check that Column A has the correct field labels
2. Verify the data format matches the examples above
3. Check the GitHub Actions logs for parsing warnings
4. Ensure location names are in the "Name" row

### GitHub Actions workflow fails

1. Check the Actions tab for error logs
2. Verify repository has write permissions enabled for GitHub Actions
3. Ensure npm dependencies install correctly

## Related Files

- **Script**: `scripts/sync-google-sheets-locations.js`
- **Workflow**: `.github/workflows/sync-google-sheets-locations.yml`
- **Output**: `data/locations.json`
- **UI Display**: `js/pokedex-locations.js`
- **Data Loading**: `js/data.js`

## Migration from Old System

This replaces the manual text file parsing system (`scripts/parse-locations.js` from `data/rawtxt/Locations.txt`).

Benefits of the Google Sheets approach:
- ✅ Easier editing with spreadsheet interface
- ✅ Multiple people can collaborate
- ✅ No need to format text files manually
- ✅ Visual overview of all locations at once
- ✅ Can copy/paste from other spreadsheets

To switch back to the old system, use the "Parse Locations" workflow instead.
