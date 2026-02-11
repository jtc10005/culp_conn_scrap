# RootsWeb Scraper

This scraper extracts genealogy data from RootsWeb pages (freepages.rootsweb.com).

## Background

RootsWeb was a popular free genealogy hosting service that went offline in 2020 following a security breach. Many genealogy pages hosted there are no longer directly accessible. This scraper is designed to work with:

1. **Archived HTML files** - Pages downloaded before the site went offline
2. **Future restoration** - If/when the site comes back online
3. **Archive.org copies** - With minor modifications to fetch from web archives

## Features

- ✅ Works with local HTML files (default mode)
- ✅ Can fetch from live website when available
- ✅ Extracts basic genealogy information (names, dates, relationships)
- ✅ Saves to Neo4j graph database
- ✅ Configurable batch processing
- ✅ Discovers related people through page links
- ✅ Marks data source as "rootsweb" for tracking

## Setup

### 1. Install Dependencies

```bash
cd scraper
npm install
```

### 2. Configure Neo4j Connection

Create or edit `env.json` with your Neo4j credentials:

```json
{
  "NEO4J_URI": "neo4j+s://your-instance.databases.neo4j.io",
  "NEO4J_USER": "neo4j",
  "NEO4J_PASSWORD": "your-password",
  "NEO4J_DATABASE": "neo4j",
  "SUPABASE_URL": "https://your-project.supabase.co",
  "SUPABASE_SERVICE_ROLE_KEY": "your-key",
  "BATCH_SIZE": 300,
  "SKIP_NEO4J_SAVE": false,
  "MAX_RECORDS": null,
  "SAVE_HTML": true,
  "EXTRACT_EVENTS_TO_SUPABASE": false
}
```

### 3. Prepare HTML Files (Local Mode)

If using local HTML files:

1. Create the data directory:
   ```bash
   mkdir -p data/rootsweb
   ```

2. Place your RootsWeb HTML files in `data/rootsweb/`
   - Must include `master_index.htm` as the starting point
   - Include any person detail pages referenced in the index

3. File structure example:
   ```
   data/rootsweb/
   ├── master_index.htm
   ├── person1.htm
   ├── person2.htm
   └── ...
   ```

### 4. Run the Scraper

```bash
npm run scrape:rootsweb
```

## Configuration

### Switching Between Local and Web Modes

Edit `rootsweb-scraper.ts` and change the `USE_LOCAL_FILES` constant:

```typescript
const USE_LOCAL_FILES = true;  // Use local files (default)
// or
const USE_LOCAL_FILES = false; // Fetch from web
```

### Configuration Options (env.json)

- `BATCH_SIZE`: Number of people to process before saving to database (default: 300)
- `SKIP_NEO4J_SAVE`: Set to `true` to test parsing without saving (default: false)
- `MAX_RECORDS`: Limit number of people to process, or `null` for unlimited (default: null)
- `SAVE_HTML`: Save downloaded HTML files to disk (default: true)
- `EXTRACT_EVENTS_TO_SUPABASE`: Save life events to Supabase (default: false)

## Customizing the Parser

The RootsWeb scraper uses generic HTML parsing that may need adjustment based on your specific RootsWeb pages. The parsing logic is in `rootsweb-utils.ts`.

### Common Customizations

1. **Adjust name extraction**: Edit the `parseRootsWebPersonFromPage` function to match your HTML structure
2. **Update date patterns**: Modify regex patterns in the parsing function to match your date formats
3. **Change relationship extraction**: Update the logic that finds parent/spouse/child links

### Example: Custom Section Matching

```typescript
// In rootsweb-utils.ts, modify the section finding logic:
let personSection: cheerio.Cheerio<Element>;
if (anchor) {
  personSection = $(`#${anchor}, a[name="${anchor}"]`).parent();
} else {
  // Customize this for your specific HTML structure
  personSection = $(".person-details") || $("body");
}
```

## Data Model

Person nodes saved to Neo4j include:

- `id`: Unique identifier (from anchor or page name)
- `name`: Full name
- `firstName`, `middleName`, `lastName`: Parsed name components
- `gender`: Gender (if detectable)
- `birth`, `birthPlace`: Birth date and location
- `death`, `deathPlace`: Death date and location
- `burial`, `burialPlace`: Burial date and location
- `marriageDate`: Primary marriage date
- `father`, `mother`: IDs of parents
- `spouses`: Array of spouse IDs
- `children`: Array of child IDs
- `page`: Source HTML page
- `source`: "rootsweb" to identify data origin

## Troubleshooting

### "master_index.htm not found"

Make sure you have the master index file in the correct location:
```bash
ls data/rootsweb/master_index.htm
```

### No people being parsed

1. Check the HTML structure of your files
2. Enable debug output by uncommenting console.log statements in `rootsweb-utils.ts`
3. Test with a single file first by setting `MAX_RECORDS: 1` in env.json

### Connection errors

If trying to fetch from the web and getting connection errors:
- Verify the site is accessible: `curl https://freepages.rootsweb.com/`
- Switch to local file mode if the site is offline
- Consider using archived versions from archive.org

## Integration with Existing Data

The scraper marks all RootsWeb data with `source: "rootsweb"` to distinguish it from Culpepper Connections data. You can query by source:

```cypher
// Find all RootsWeb people
MATCH (p:Person {source: "rootsweb"})
RETURN p

// Find people from both sources
MATCH (p:Person)
WHERE p.source IN ["rootsweb", "culpepperconnections"]
RETURN p.name, p.source
```

## Future Enhancements

Potential improvements to consider:

- [ ] Support for Archive.org URLs
- [ ] Better HTML structure detection
- [ ] More sophisticated name parsing
- [ ] Image extraction
- [ ] Source citation tracking
- [ ] Duplicate detection across sources
