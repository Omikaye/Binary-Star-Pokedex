# BinaryStar Pokedex
A Pokedex for the rom hack Pokemon Binary Star by Omikaye

## Features

- **Google Sheets Integration**: Manage location data via Google Sheets with automatic sync
  - **BattleLocations**: Column-based format for complete location data with battles and tags
  - **ShopLocations**: Table-based format for shop inventories per location (NEW!)
  - **ItemLocations**: Table-based format for item-specific updates
- **Battle System**: Visual battle tags with colored badges (Story, Boss, Optional, Static, etc.)
- **Shop Tables**: Reference reusable shop inventories across multiple locations
- **Location Pages**: Display Pokemon encounters, items, trainers, battles, and shops for each location
- **Search Functionality**: Find locations by name, Pokemon, items, or trainers
- **Unified Sync**: Single GitHub Actions workflow syncs all three sheet types at once

## Quick Start

### Setting Up Google Sheets Integration

**Three sheet types supported:**

1. **BattleLocations** (Column-based) - Complete location data
   - Format: Column A has field labels, columns B+ are locations
   - Syncs: All location data (encounters, items, trainers, battles, shops, notes)
   - Supports: Battle tags, shop table references, location notes

2. **ShopLocations** (Table-based OR Column-based) - Shop inventories per location
   - **Table format** (NEW!): Each table is a location with Item/Cost columns
   - **Column format** (Legacy): Each column is a shop table with items and prices
   - Syncs: Shop table definitions referenced by locations

3. **ItemLocations** (Table-based) - Item-specific updates
   - Format: Multiple tables, each table is one location with Item/Num/Method columns
   - Syncs: Only items for each location

**One workflow to sync all three sheets:**
- Workflow: **"Sync Google Sheets Locations"**
- Runs: All three syncs (locations, shops, items) in one click
- See [GOOGLE_SHEETS_SYNC_GUIDE.md](GOOGLE_SHEETS_SYNC_GUIDE.md) for detailed instructions

See [LOCATION_IMPORT.md](docs/LOCATION_IMPORT.md) for detailed format specifications and battle tag configuration.

### Development

```bash
# Install dependencies
npm install

# Serve locally
npm run serve

# Sync all data from Google Sheets (locations, shops, items)
# Use GitHub Actions workflow "Sync Google Sheets Locations"
# OR run manually:
npm run sync-sheets-locations
npm run sync-sheets-shop-tables
npm run sync-item-locations -- 1958269454

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

## GitHub Pages deployment

The site is deployed by the **Build and Deploy to GitHub Pages** workflow in `.github/workflows/deploy.yml`.

- Automatic deployments run on pushes to `main`, `master`, or `Reset`.
- Manual `workflow_dispatch` runs from other branches still build the site, but they intentionally skip the deploy job so protected environments do not reject the run.
- In repository **Settings → Pages**, set **Source** to **GitHub Actions**.
- If the `github-pages` environment has deployment branch restrictions enabled, allow the same deployment branches (`main`, `master`, and/or `Reset`).
- After changing Pages settings, rerun the workflow from an allowed branch to republish the site.
