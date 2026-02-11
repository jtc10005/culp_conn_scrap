# Genealogy Scrapers

This directory contains web scrapers that fetch genealogy data from multiple sources and save to Neo4j.

## Available Scrapers

### 1. Culpepper Connections Scraper (`scraper.ts`)
Live web scraper that fetches genealogy data from CulpepperConnections.com and saves directly to Neo4j.

### 2. RootsWeb Scraper (`rootsweb-scraper.ts`)
Scraper for RootsWeb genealogy pages (freepages.rootsweb.com). Can work with local HTML files or live web pages.

## Features

- 🔄 Live crawling with configurable batch sizes
- 🧬 Extracts DNA verification badges
- 🎖️ Captures military service records (6 wars)
- 📷 Identifies records with pictures
- 📖 Tracks family bible entries
- 👨‍👩‍👧‍👦 Handles unlinked children (no person page)
- 💾 Optional HTML caching

## Configuration

Edit `env.json` to configure the scraper:

```json
{
  "NEO4J_URI": "neo4j+s://your-instance.databases.neo4j.io",
  "NEO4J_USER": "neo4j",
  "NEO4J_PASSWORD": "your-password",
  "NEO4J_DATABASE": "neo4j",
  "BATCH_SIZE": 300,
  "SKIP_NEO4J_SAVE": false,
  "MAX_RECORDS": null,
  "SAVE_HTML": true
}
```

### Configuration Options

- `BATCH_SIZE`: Number of records to process before saving to Neo4j (default: 300)
- `SKIP_NEO4J_SAVE`: Set to `true` to test without saving to database (default: false)
- `MAX_RECORDS`: Limit number of records to process, or `null` for unlimited (default: null)
- `SAVE_HTML`: Save HTML files to `data/` directory for offline analysis (default: true)

## Usage

### Run the Culpepper Connections Scraper

```bash
npm run scrape
```

### Run the RootsWeb Scraper

```bash
npm run scrape:rootsweb
```

**Note:** RootsWeb has been offline since 2020. The scraper supports two modes:
1. **Local files mode** (default): Reads HTML files from `data/rootsweb/` directory
2. **Live web mode**: Fetches from the website when it's available (set `USE_LOCAL_FILES=false` in `rootsweb-scraper.ts`)

To use local files:
1. Download or archive RootsWeb HTML files
2. Place them in `data/rootsweb/` directory
3. Ensure `master_index.htm` exists as the starting point
4. Run `npm run scrape:rootsweb`

### Find Missing Records

Check for people referenced but not yet scraped:

```bash
npm run find-missing
```

## Data Saved to Neo4j

Each person node includes:

- Basic info: name, firstName, middleName, lastName, gender
- Life events: birth, birthPlace, death, deathPlace, burial, burialPlace
- Marriage: marriageDate
- **Badges** (Culpepper Connections only): dnaProven, hasPicture, hasFamilyBible, militaryService[]
- Relationships: father, mother, spouses[], children[]
- Source: "culpepperconnections" or "rootsweb" to track data origin

## Culpepper Connections Features

The Culpepper Connections scraper includes advanced features:

- **DNA Proven** (🧬): `dnah.gif` icon
- **Picture Available** (📷): `exhibitsy.gif` icon
- **Family Bible** (📖): `familybibley.gif` icon
- **Military Service** (🎖️):
  - World War 2: `wartimesvc2.gif`
  - World War 1: `wartimesvc1.gif`
  - Civil War: `wartimesvcc.gif`
  - War of 1812: `wartimesvct.gif`
  - American Revolution: `wartimesvca.gif`
  - Indian Wars: `wartimesvci.gif`

## Data Saved to Neo4j

Each person node includes:

- Basic info: name, firstName, middleName, lastName, gender
- Life events: birth, birthPlace, death, deathPlace, burial, burialPlace
- Marriage: marriageDate
- **Badges**: dnaProven, hasPicture, hasFamilyBible, militaryService[]
- Relationships: father, mother, spouses[], children[]

## How It Works

1. Starts from a root person (configurable in `scraper.ts`)
2. Fetches their HTML page from CulpepperConnections.com
3. Parses person data, relationships, and badges using Cheerio
4. Discovers related people (parents, spouses, children)
5. Saves batch to Neo4j when `BATCH_SIZE` is reached
6. Continues crawling discovered people until complete"
