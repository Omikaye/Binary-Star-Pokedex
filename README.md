# BinaryStar Pokedex
A Pokedex for the rom hack Pokemon Binary Star by Omikaye

## Features

- **Google Sheets Integration**: Manage location data via Google Sheets with automatic sync
  - **BattleLocations**: Column-based format for complete location data with battles and tags
  - **ShopLocations**: Define reusable shop tables for locations
  - **ItemLocations**: Table-based format for item-specific updates
- **Battle System**: Visual battle tags with colored badges (Story, Boss, Optional, Static, etc.)
- **Shop Tables**: Reference reusable shop inventories across multiple locations
- **Location Pages**: Display Pokemon encounters, items, trainers, battles, and shops for each location
- **Search Functionality**: Find locations by name, Pokemon, items, or trainers
- **Manual Sync**: GitHub Actions workflows for updating data from Google Sheets

## Quick Start

### Setting Up Google Sheets Integration

**Two sheet types supported:**

1. **BattleLocations** (Column-based) - Complete location data
   - Format: Column A has field labels, columns B+ are locations
   - Syncs: All location data (encounters, items, trainers, battles, shops, notes)
   - Supports: Battle tags, shop table references, location notes
   - Workflow: "Sync Google Sheets Locations"

2. **ShopLocations** (Column-based) - Reusable shop inventories
   - Format: Each column is a shop table with items and prices
   - Syncs: Shop table definitions referenced by locations
   - Workflow: Manual sync with `npm run sync-sheets-shop-tables`

3. **ItemLocations** (Table-based) - Item-specific updates
   - Format: Multiple tables, each table is one location with Item/Num/Method columns
   - Syncs: Only items for each location
   - Workflow: "Sync Item Locations from Google Sheets"

See [LOCATION_IMPORT.md](docs/LOCATION_IMPORT.md) for detailed format specifications and battle tag configuration.

### Development

```bash
# Install dependencies
npm install

# Serve locally
npm run serve

# Sync locations from Google Sheets (BattleLocations)
npm run sync-sheets-locations

# Sync shop tables from Google Sheets (ShopLocations)
npm run sync-sheets-shop-tables

# Sync item locations from Google Sheets (ItemLocations)
npm run sync-item-locations -- <GID>

# Run tests
npm run test-battle-parsing
npm run test-shop-tables-parsing
npm run test-data-files

# Build for production
npm run dist
```

## Documentation

- [User Guide](docs/USER_GUIDE.md) - Quick start for both integration types
- [BattleLocations Guide](docs/GOOGLE_SHEETS_INTEGRATION.md) - Column-based location data
- [ItemLocations Guide](docs/ITEM_LOCATIONS_INTEGRATION.md) - Table-based item data
- [Setup Guide](docs/SETUP_GOOGLE_SHEETS.md) - Making sheets public and running workflows
- [Template](docs/GOOGLE_SHEETS_TEMPLATE.md) - Format examples
