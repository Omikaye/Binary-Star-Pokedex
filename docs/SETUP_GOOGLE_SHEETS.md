# Setting Up Your Google Sheets for Location Data

## Quick Setup Checklist

- [ ] Open your Google Sheet: https://docs.google.com/spreadsheets/d/1x21QTXNVGAvrQsiDCGzF-m09ASGW8ofgxjoqcLmQYkE/edit?gid=0#gid=0
- [ ] Ensure the sheet is named "BattleLocations" (or the tab with gid=0)
- [ ] Make the sheet publicly accessible (see instructions below)
- [ ] Format the sheet with field descriptions in Column A
- [ ] Add location data in columns B, C, D, etc.
- [ ] Run the GitHub Action to sync the data

## Making Your Sheet Public

**Important**: The sheet must be publicly accessible for the GitHub Action to read it.

### Steps:

1. Open your Google Sheet
2. Click the **Share** button in the top-right corner
3. Click **Change to anyone with the link** 
4. Make sure the dropdown is set to **Viewer** (not Editor)
5. Click **Copy link**
6. Click **Done**

Your sheet is now accessible to anyone with the link, but they can only view it, not edit.

## Testing Access

To verify your sheet is accessible, try opening this URL in an incognito/private browser window:

```
https://docs.google.com/spreadsheets/d/1x21QTXNVGAvrQsiDCGzF-m09ASGW8ofgxjoqcLmQYkE/export?format=csv&gid=0
```

If you can download a CSV file, the sheet is properly configured!

## Running the Sync

Once your sheet is set up and public:

1. Go to your GitHub repository: https://github.com/Omikaye/Binary-Star-Pokedex
2. Click the **Actions** tab
3. Click **Sync Google Sheets Locations** in the left sidebar
4. Click **Run workflow** button (on the right)
5. Click the green **Run workflow** button in the dropdown
6. Wait for the workflow to complete (usually takes 30-60 seconds)
7. Check the workflow output for any errors
8. The `data/locations.json` file will be automatically updated and committed

## Viewing Results

After a successful sync:

1. Check the commit history to see the auto-generated commit
2. View `data/locations.json` to see the converted data
3. The changes will automatically deploy to your site (if auto-deploy is enabled)
4. Visit your Pokédex site and go to the Locations tab to see the new data

## Troubleshooting

### "Sheet appears to be empty or inaccessible"

- Make sure the sheet is set to "Anyone with the link can view"
- Verify the sheet tab name is "BattleLocations" or the gid is correct
- Check that there is data in the sheet (at least column headers)

### "No locations were converted"

- Ensure Column A has a cell with "Name" (case-insensitive)
- Verify location names are in columns B, C, D, etc.
- Check the GitHub Actions logs for detailed parsing information

### Workflow fails to commit

- Ensure GitHub Actions has write permissions in repository settings
- Check if there are any merge conflicts
- Verify the workflow has the correct permissions in the YAML file

## Current Sheet Configuration

Your sheet is already configured in the script:
- **Sheet ID**: `1x21QTXNVGAvrQsiDCGzF-m09ASGW8ofgxjoqcLmQYkE`
- **Sheet GID**: `0` (BattleLocations tab)

If you want to use a different sheet or tab, update these values in `scripts/sync-google-sheets-locations.js`.

## Need Help?

See the full documentation:
- [Google Sheets Integration Guide](GOOGLE_SHEETS_INTEGRATION.md)
- [Template and Format Examples](GOOGLE_SHEETS_TEMPLATE.md)
