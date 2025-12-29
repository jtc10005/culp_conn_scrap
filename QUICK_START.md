# Quick Start: Rich Data Model

## Run the Scraper

```bash
cd scraper
npm run scrape
```

This will populate Neo4j with:

- Person nodes (with basic fields)
- LifeEvent nodes (all biographical events)
- Family nodes (all marriages with children)

## What Gets Captured

### Life Events

- Birth (with place)
- Death (with place)
- Burial (with place)
- Baptism/Christening
- Residence information
- Occupations
- Immigration/Emigration
- Military service details
- Other biographical info

### Families

- All marriages (in order)
- Spouse information (linked or unlinked)
- Marriage date and place
- Divorce date (if applicable)
- Children from each specific marriage

## View in UI

Visit any person page:

```
http://localhost:3000/person/[id]
```

You'll see a new **Timeline** section showing:

- All life events with icons
- All marriages with spouse and children
- Proper chronological order

## Example Cypher Queries

### Get all events for a person

```cypher
MATCH (p:Person {id: "41718"})-[:HAS_EVENT]->(e:LifeEvent)
RETURN e
ORDER BY e.orderIndex
```

### Get all families for a person

```cypher
MATCH (p:Person {id: "41718"})-[:HAS_FAMILY]->(f:Family)
OPTIONAL MATCH (f)-[:SPOUSE]->(s:Person)
OPTIONAL MATCH (f)-[:CHILD]->(c:Person)
RETURN f, s, collect(c) as children
ORDER BY f.orderIndex
```

### Find all military veterans

```cypher
MATCH (p:Person)-[:HAS_EVENT]->(e:LifeEvent {type: "military"})
RETURN p.name, p.id, e.description
```

### Find people with multiple marriages

```cypher
MATCH (p:Person)-[:HAS_FAMILY]->(f:Family)
WITH p, count(f) as marriages
WHERE marriages > 1
RETURN p.name, p.id, marriages
ORDER BY marriages DESC
```

### Find all people born in a specific place

```cypher
MATCH (p:Person)-[:HAS_EVENT]->(e:LifeEvent {type: "birth"})
WHERE e.place CONTAINS "Georgia"
RETURN p.name, p.id, e.date, e.place
```

## Data Model

```
Person (base fields for compatibility)
  ├─[:HAS_EVENT]→ LifeEvent (type, date, place, description)
  ├─[:HAS_EVENT]→ LifeEvent
  ├─[:HAS_FAMILY]→ Family (marriageDate, divorceDate, orderIndex)
  │   ├─[:SPOUSE]→ Person
  │   └─[:CHILD]→ Person
  └─[:HAS_FAMILY]→ Family (second marriage, etc.)
      └─[:CHILD]→ Person
```

## Backward Compatibility

Old queries still work:

```cypher
MATCH (p:Person {id: "123"})
RETURN p.birth, p.death, p.marriageDate
```

New queries get rich data:

```cypher
MATCH (p:Person {id: "123"})-[:HAS_EVENT]->(e:LifeEvent)
RETURN e
```

## Configuration

Edit `scraper/env.json`:

```json
{
  "BATCH_SIZE": 300,
  "SKIP_NEO4J_SAVE": false,
  "MAX_RECORDS": null,
  "SAVE_HTML": true
}
```

- Set `SKIP_NEO4J_SAVE: true` to test parsing without saving
- Set `MAX_RECORDS: 10` to limit scraping for testing
- Set `SAVE_HTML: false` to skip saving HTML files

## Next Steps

1. ✅ Run scraper: `npm run scrape`
2. ✅ View person pages to see Timeline
3. ✅ Query Neo4j for rich data
4. Consider adding:
   - Event type filtering in UI
   - Date range search
   - Place-based search
   - Family tree visualization
