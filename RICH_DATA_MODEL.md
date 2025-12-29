# Rich Genealogical Data Model

## Overview

This document describes the hybrid data model that captures comprehensive genealogical information from CulpepperConnections HTML pages. The model uses **separate Neo4j nodes** for events and families, connected via relationships to Person nodes.

## Data Model Architecture

### Node Types

1. **Person** - Core biographical data (backward compatible with existing schema)
2. **LifeEvent** - Individual life events (birth, death, occupation, etc.)
3. **Family** - Marriage/family units with children

### Relationships

- `Person -[:HAS_EVENT]-> LifeEvent` - All biographical events
- `Person -[:HAS_FAMILY]-> Family` - All marriages/families
- `Family -[:SPOUSE]-> Person` - Link to spouse
- `Family -[:CHILD]-> Person` - Children from this specific marriage
- `Person -[:SPOUSE]- Person` - Backward compatible spouse relationship
- `Person -[:PARENT_OF]-> Person` - Backward compatible parent-child relationship

## Person Node

Maintains backward compatibility with existing fields while supporting rich data:

```typescript
{
  id: string
  name: string
  firstName?: string
  middleName?: string
  lastName?: string
  gender?: string
  birth?: string              // Kept for quick access
  birthPlace?: string         // Kept for quick access
  death?: string              // Kept for quick access
  deathPlace?: string         // Kept for quick access
  burial?: string             // Kept for quick access
  burialPlace?: string        // Kept for quick access
  marriageDate?: string       // First marriage, for backward compatibility
  father?: string
  mother?: string
  spouses: string[]           // All spouse IDs
  children: string[]          // All children IDs
  dnaProven?: boolean
  hasPicture?: boolean
  hasFamilyBible?: boolean
  militaryService?: string[]
  page?: string               // Source HTML page
}
```

## LifeEvent Node

Captures individual biographical events:

```typescript
{
  id: string                  // e.g., "41718_event_0"
  type: "birth" | "death" | "burial" | "baptism" | "residence" |
        "occupation" | "immigration" | "military" | "other"
  date?: string
  place?: string
  description?: string        // Full text from HTML table
  orderIndex: number          // Preserves order from source
}
```

### Event Types

- **birth** - Birth events
- **death** - Death events
- **burial** - Burial/interment events
- **baptism** - Baptism/christening events
- **residence** - Residential information
- **occupation** - Occupation/work history
- **immigration** - Immigration/emigration events
- **military** - Military service (beyond badge flags)
- **other** - Any other biographical information

## Family Node

Represents a marriage/family unit:

```typescript
{
  id: string                  // e.g., "41718_family_0"
  spouseId?: string           // ID of spouse if linked
  spouseName?: string         // Name of spouse if not linked
  marriageDate?: string
  marriagePlace?: string
  divorceDate?: string
  orderIndex: number          // 0 = first marriage, 1 = second, etc.
}
```

Connected to:

- Spouse Person node (via `[:SPOUSE]` relationship)
- Child Person nodes (via `[:CHILD]` relationships)

This allows tracking which children belong to which marriage.

## Benefits

### 1. Comprehensive Data Capture

- All biographical events from HTML tables
- Multiple marriages with correct child attribution
- Divorce information
- Rich contextual descriptions

### 2. Backward Compatibility

- Existing queries still work with base Person fields
- Simple fields (birth, death, etc.) remain on Person node
- Old code doesn't break

### 3. Query Flexibility

**Simple queries** (existing code):

```cypher
MATCH (p:Person {id: "41718"})
RETURN p.name, p.birth, p.death
```

**Rich timeline queries**:

```cypher
MATCH (p:Person {id: "41718"})-[:HAS_EVENT]->(e:LifeEvent)
RETURN e
ORDER BY e.orderIndex
```

**Family-specific queries**:

```cypher
MATCH (p:Person {id: "41718"})-[:HAS_FAMILY]->(f:Family)
OPTIONAL MATCH (f)-[:SPOUSE]->(spouse:Person)
OPTIONAL MATCH (f)-[:CHILD]->(child:Person)
RETURN f, spouse, collect(child) as children
ORDER BY f.orderIndex
```

### 4. UI Possibilities

- Timeline views of all life events
- Family trees with marriage order preserved
- Detailed biographical narratives
- Event filtering and search

## Scraper Implementation

The scraper now extracts:

1. **Events** from main biographical table (excluding marriages)
   - Parses date, place, and full description
   - Maps labels to event types
   - Preserves order with `orderIndex`

2. **Families** from all `ss-family` tables
   - Each table = one marriage/family unit
   - Captures spouse info (linked or unlinked)
   - Associates children with correct family
   - Tracks divorce information

3. **Unlinked Children**
   - Still captured as minimal Person nodes
   - Associated with correct family

## Data Storage

- **Neo4j Graph Database**
  - Person, LifeEvent, and Family nodes
  - Relationship-based connections
  - Efficient traversal queries

- **Batch Processing**
  - Saves 300 records at a time
  - Creates all nodes and relationships
  - Maintains referential integrity

## Next Steps

To use this rich data:

1. **Run the scraper** to populate events and families:

   ```bash
   cd scraper
   npm run scrape
   ```

2. **Update UI components** to display:
   - Timeline of life events
   - Multiple marriages with children
   - Rich biographical details

3. **Enable querying** by event type, date range, or location

## Example Data

For James Lamar Culpepper (ID: 41718):

**Person Node** (simplified view):

- birth: "1918"
- death: "1989"
- dnaProven: true
- militaryService: ["World War 2"]

**LifeEvent Nodes**:

- Event 0: type="birth", date="1918", place="Georgia"
- Event 1: type="death", date="1989", place="Florida"
- Event 2: type="military", description="Served in World War 2..."

**Family Nodes**:

- Family 0: spouse="Mary Smith", marriageDate="1940", children=["123", "456"]
- Family 1: spouse="Jane Doe", marriageDate="1960", divorceDate="1970", children=["789"]

This structure captures ALL information from the HTML while maintaining backward compatibility.
