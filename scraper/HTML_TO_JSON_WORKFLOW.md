# HTML to JSON to Neo4j Workflow

This document explains the two-step process for converting HTML files to JSON and then uploading to Neo4j.

## Overview

Instead of scraping the Culpepper Connections website directly, this workflow allows you to:

1. Parse existing HTML files in the `data/` folder to create a comprehensive JSON file
2. Review and verify the JSON data
3. Upload the JSON data to Neo4j, replacing all existing data

## Why This Approach?

- **Completeness**: Captures ALL data from the HTML files, not just what's available from the live website
- **Verification**: Allows you to review the JSON before uploading to Neo4j
- **No Missing Data**: Ensures you don't lose any information that might be missing from the website
- **Repeatability**: Can re-process HTML files anytime to regenerate the database
- **Version Control**: JSON file can be committed to git as a backup

## Process

### Step 1: Convert HTML to JSON

This step parses all HTML files in `scraper/data/` and creates `scraper/data/genealogy-data.json`.

```bash
npm run html-to-json
```

**What it does:**

- Scans all `.htm` files in the `data/` folder
- Extracts all person records using the existing parser
- Merges duplicate records (same person appearing in multiple files)
- Creates a JSON file with metadata and all person records

**Output:**

- `scraper/data/genealogy-data.json` - Complete genealogy database

**JSON Structure:**

```json
{
  "metadata": {
    "exportDate": "2025-01-01T12:00:00.000Z",
    "totalPeople": 1234,
    "totalFiles": 567,
    "source": "Culpepper Connections HTML Files",
    "sourceLocation": "./data"
  },
  "people": [
    {
      "id": "1",
      "name": "Henry Culpeper of Lower Norfolk Co., VA",
      "firstName": "Henry",
      "lastName": "Culpeper",
      "gender": "Male",
      "birth": "say 1633",
      "birthPlace": "England",
      "death": "after 1675",
      "deathPlace": "Lower Norfolk Co., Virginia",
      "spouses": ["36058"],
      "children": ["834", "831"],
      "father": null,
      "mother": null
    }
    // ... more people
  ]
}
```

### Step 2: Review the JSON

Before uploading to Neo4j, review the generated JSON file:

1. Open `scraper/data/genealogy-data.json` in VS Code
2. Check the `totalPeople` count in metadata
3. Spot-check a few records for accuracy
4. Verify relationships (spouses, children, parents) look correct

### Step 3: Upload to Neo4j

⚠️ **WARNING**: This will DELETE ALL existing data in Neo4j and replace it with the JSON data!

```bash
npm run json-to-neo4j
```

**What it does:**

- Connects to Neo4j using credentials from `env.json`
- Shows a 5-second warning before proceeding
- Deletes all existing nodes and relationships
- Uploads all person records in batches of 100
- Creates all relationship links (spouses, parents, children)
- Verifies the upload was successful

**Safety Features:**

- 5-second countdown before deletion begins
- Progress indicator shows upload status
- Verification step confirms record count
- Can press Ctrl+C to cancel anytime before data is deleted

## Commands

From project root:

```bash
# Step 1: Parse HTML files to JSON
npm run html-to-json

# Step 2: Upload JSON to Neo4j (⚠️ replaces all data!)
npm run json-to-neo4j
```

From scraper directory:

```bash
cd scraper

# Step 1: Parse HTML files to JSON
npm run html-to-json

# Step 2: Upload JSON to Neo4j (⚠️ replaces all data!)
npm run json-to-neo4j
```

## Configuration

The Neo4j connection uses settings from `scraper/env.json`:

```json
{
  "NEO4J_URI": "neo4j+s://your-instance.databases.neo4j.io",
  "NEO4J_USER": "neo4j",
  "NEO4J_PASSWORD": "your-password",
  "NEO4J_DATABASE": "neo4j"
}
```

## Expected Output

### HTML to JSON

```
=== HTML to JSON Converter ===

Reading HTML files from: ./data
Found 1234 HTML files

Processing: p2173.htm
✓ Processed 1234 files
✓ Found 5678 unique people

Writing JSON to: ./data/genealogy-data.json
✓ JSON file created: 1234.56 KB (1.23 MB)

Sample records:
────────────────────────────────────────────────────────────────────────────────
ID: 1 - Henry Culpeper of Lower Norfolk Co., VA
  Birth: say 1633 at England
  Death: after 1675 at Lower Norfolk Co., Virginia
  Spouses: 1, Children: 2
────────────────────────────────────────────────────────────────────────────────

✓ Conversion complete!

Next steps:
  1. Review the JSON file: ./data/genealogy-data.json
  2. When ready, upload to Neo4j with: npm run json-to-neo4j
```

### JSON to Neo4j

```
=== JSON to Neo4j Uploader ===

Testing Neo4j connection...
✓ Connected to Neo4j

Reading JSON from: ./data/genealogy-data.json
✓ Loaded 5678 people
  Export date: 2025-01-01T12:00:00.000Z
  Source: Culpepper Connections HTML Files

⚠️  WARNING: This will DELETE ALL EXISTING DATA in Neo4j!
⚠️  You are about to upload 5678 people.

Press Ctrl+C now to cancel, or wait 5 seconds to continue...

⚠️  CLEARING ALL EXISTING DATA FROM NEO4J...
✓ Database cleared

Uploading 5678 people in 57 batches...

Batch 57/57 - Uploading 78 people... ✓ (5678/5678 - 100.0%)

✓ Upload complete!
✓ Successfully uploaded 5678 people to Neo4j

Verification: 5678 Person nodes in database
Verification: 12345 relationships in database
```

## Troubleshooting

### "JSON file not found"

Run `npm run html-to-json` first to create the JSON file.

### "Data directory not found"

Make sure you're in the `scraper` directory and that `data/` folder exists with HTML files.

### Neo4j connection error

- Check your `env.json` credentials
- Verify your Neo4j instance is running (not paused)
- Test connection at https://console.neo4j.io

### No people found in HTML

- Verify HTML files are in `scraper/data/`
- Check that HTML files have the expected structure with `<div class="itp" id="i123">` elements

## Data Validation

After upload, you can verify the data in Neo4j:

```cypher
// Count total people
MATCH (p:Person) RETURN count(p)

// Count relationships
MATCH ()-[r]->() RETURN type(r), count(r)

// Find a specific person
MATCH (p:Person {id: "1"}) RETURN p

// Check family relationships
MATCH (p:Person {id: "1"})-[:PARENT_OF]->(child) RETURN child.name
MATCH (p:Person {id: "1"})-[:SPOUSE]-(spouse) RETURN spouse.name
```

## Notes

- The JSON file can be version controlled in git as a backup
- Each run of `html-to-json` overwrites the previous JSON file
- Each run of `json-to-neo4j` completely replaces the Neo4j database
- Person records are merged if they appear in multiple HTML files
- All data from HTML files is captured (not just the data available on the website)
