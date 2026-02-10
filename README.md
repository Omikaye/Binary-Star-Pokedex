# BinaryStar Pokedex
A Pokedex for the rom hack Pokemon Binary Star by Omikaye

## Features

- **Google Sheets Integration**: Manage location data via Google Sheets with automatic sync
- **Location Pages**: Display Pokemon encounters, items, trainers, and shops for each location
- **Search Functionality**: Find locations by name, Pokemon, items, or trainers
- **Manual Sync**: GitHub Actions workflow for updating location data from Google Sheets

## Quick Start

### Setting Up Google Sheets Integration

1. Create or use a Google Sheets document for location data
2. Format it with Column A as field descriptions and subsequent columns as locations
3. Make the sheet publicly accessible (Anyone with the link can view)
4. Update the sheet ID in `scripts/sync-google-sheets-locations.js`
5. Run the "Sync Google Sheets Locations" workflow in GitHub Actions

See [docs/GOOGLE_SHEETS_INTEGRATION.md](docs/GOOGLE_SHEETS_INTEGRATION.md) for detailed instructions.

### Development

```bash
# Install dependencies
npm install

# Serve locally
npm run serve

# Sync locations from Google Sheets
npm run sync-sheets-locations

# Build for production
npm run dist
```

## Documentation

- [Google Sheets Integration Guide](docs/GOOGLE_SHEETS_INTEGRATION.md) - How to manage location data via Google Sheets
