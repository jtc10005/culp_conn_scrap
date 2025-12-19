# Copilot Instructions

## Project Overview

This is a monorepo containing two applications:

1. **Application** (`/application`) - Next.js 16 web application for Culpepper family genealogy
2. **Scraper** (`/scraper`) - TypeScript data scraper for Culpepper Connections website

---

## Application Structure (`/application`)

### Tech Stack

- **Framework**: Next.js 16.0.10 (App Router)
- **React**: 19.2.1
- **TypeScript**: 5
- **Database**: Neo4j Aura (graph database)
- **Styling**: Tailwind CSS 4 + Custom CSS theme system
- **Visualization**: D3.js 7.9.0
- **Feature Flags**: ConfigCat (configcat-js-ssr)
- **Deployment**: Vercel

### TypeScript Path Mappings

**ALWAYS use these path aliases for imports:**

```typescript
// tsconfig.json paths - USE THESE:
"@components" → "./components/index.ts"
"@lib"        → "./lib/index.ts"
"@models"     → "./lib/models/index.ts"
"@functions"  → "./lib/functions/index.ts"
"@/*"         → "./*" (fallback for other files)
```

**Examples:**

```typescript
// ✅ CORRECT - Use path mappings
import { HeaderWithFlags } from "@components";
import { getNeo4jDriver, Person, getNavigationConfig } from "@lib";
import { ViewBox } from "@models";
import { createCameraController } from "@functions";

// ❌ WRONG - Don't use relative imports
import Header from "../components/Header";
import { getNeo4jDriver } from "../lib/neo4j";
```

### Directory Structure

```
application/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout with dark mode script
│   ├── page.tsx                 # Home page (feature flag controlled)
│   ├── not-found.tsx            # Custom 404 page
│   ├── tree/                    # Family tree visualization
│   ├── history/                 # Family history page
│   ├── people/                  # Searchable people directory
│   │   └── layout.tsx          # Route protection
│   ├── person/[id]/            # Person detail pages
│   ├── acknowledgements/        # Credits page
│   ├── practice/               # SVG practice playground
│   │   └── layout.tsx          # Route protection
│   └── api/                    # API routes
│       ├── tree/               # Tree data endpoint
│       ├── people/             # People search endpoint
│       └── person/[id]/        # Person detail endpoint
├── components/
│   ├── index.ts                # Barrel export file
│   ├── HeaderWithFlags.tsx     # Header with ConfigCat (async server component)
│   ├── Header.tsx              # Original header (legacy)
│   ├── DarkModeToggle.tsx      # Dark mode toggle (client component)
│   ├── FamilyTree.tsx          # D3.js tree visualization
│   └── TreeIllustration.tsx    # Tree drawing utilities
├── lib/
│   ├── index.ts                # Barrel export file
│   ├── featureFlags.ts         # ConfigCat integration
│   ├── routeProtection.ts      # Route access control
│   ├── neo4j.ts                # Neo4j driver
│   ├── types.ts                # TypeScript interfaces
│   ├── models/
│   │   ├── index.ts            # Model exports
│   │   └── ViewBox.ts          # ViewBox interface
│   └── functions/
│       ├── index.ts            # Function exports
│       ├── tree.ts             # Tree utilities
│       ├── cameraController.ts # Camera controls
│       ├── clickZoom.ts        # Click zoom logic
│       └── animateZoom.ts      # Zoom animations
└── public/                     # Static assets
```

### Feature Flags (ConfigCat)

**Configuration:**

- Service: ConfigCat (free tier)
- Setting Key: `navigation_config`
- Type: **Text** (stores JSON string)
- SDK Key: `NEXT_PUBLIC_CONFIGCAT_SDK_KEY` (in `.env.local`)

**Feature Flag Structure:**

```json
{
  "tree": true, // /tree route
  "history": true, // /history route
  "people": true, // /people route
  "acknowledgements": true, // /acknowledgements route
  "practice": true // /practice route
}
```

**How It Works:**

1. **Navigation Control**: Links hidden in header and home page when `false`
2. **Route Protection**: Direct URL access blocked → shows 404 page when `false`

**Implementation:**

```typescript
// Server components - direct check
import { checkRouteAccess } from '@lib';

export default async function MyPage() {
  await checkRouteAccess('routeKey'); // throws notFound() if disabled
  return <div>Content</div>;
}

// Client components - use layout.tsx wrapper
// See /people/layout.tsx and /practice/layout.tsx
```

**Files:**

- `lib/featureFlags.ts` - ConfigCat client and utilities
- `lib/routeProtection.ts` - Route access checking
- `components/HeaderWithFlags.tsx` - Feature-controlled header
- `app/page.tsx` - Feature-controlled home page cards
- Setup docs: `CONFIGCAT_SETUP.md`

### Theme System

**Dark Mode:**

- LocalStorage key: `darkMode` (string: "true" or "false")
- Blocking script in `app/layout.tsx` prevents FOUC
- `suppressHydrationWarning` on `<html>` element
- Dark mode adds `.dark` class to `document.documentElement`

**CSS Classes:**

```css
/* Use these theme classes for all styling: */
.theme-bg-primary        /* Main background */
.theme-bg-secondary      /* Secondary background */
.theme-text-primary      /* Primary text */
.theme-text-secondary    /* Secondary text */
.theme-text-tertiary     /* Tertiary text */
.theme-text-accent       /* Accent text */
.theme-banner-bg         /* Header background */
.theme-banner-text       /* Header text */
/* See theme.css for full list */
```

### Neo4j Integration

**Connection:**

```typescript
import { getNeo4jDriver } from "@lib";

const driver = getNeo4jDriver();
const session = driver.session({ database: process.env.NEO4J_DATABASE });
```

**Important:** Always use `neo4j.int()` for integer parameters:

```typescript
import neo4j from "neo4j-driver";

const limit = neo4j.int(limitParam); // Prevents float errors
```

**Person Interface:**

```typescript
interface Person {
  id: string;
  name: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  gender?: string;
  birthDate?: string;
  birthPlace?: string;
  deathDate?: string;
  deathPlace?: string;
}
```

### Component Patterns

**Server Components (default):**

```typescript
// Can be async, fetch data directly
export default async function MyPage() {
  const data = await fetchData();
  return <div>{data}</div>;
}
```

**Client Components:**

```typescript
"use client";

import { useState, useEffect } from "react";

export default function MyComponent() {
  const [state, setState] = useState();
  // ...
}
```

**Route Protection Pattern:**

- Server components: Add `await checkRouteAccess('routeKey')` in component
- Client components: Create `layout.tsx` with route check (see `/people` or `/practice`)

### Best Practices

1. **Always use TypeScript path mappings** (`@components`, `@lib`, etc.)
2. **Use theme CSS classes** for all styling (dark mode compatible)
3. **Protect routes with feature flags** using `checkRouteAccess()`
4. **Use `neo4j.int()`** for all integer Neo4j parameters
5. **Add `suppressHydrationWarning`** when manipulating HTML/body classes
6. **Debounce search inputs** (300ms delay) to prevent freezing
7. **Export from barrel files** (`index.ts`) for clean imports

---

## Scraper Structure (`/scraper`)

### Tech Stack

- **Runtime**: Node.js with TypeScript
- **Database**: Neo4j Aura
- **HTML Parsing**: Cheerio
- **HTTP**: Fetch API

### Purpose

Scrapes genealogy data from Culpepper Connections website and imports into Neo4j.

### Configuration (`env.json`)

```json
{
  "BATCH_SIZE": 300, // Records per batch
  "SKIP_NEO4J_SAVE": false, // Set true to skip DB writes
  "MAX_RECORDS": null, // Limit records (null = all)
  "SAVE_HTML": true // Save HTML files to ./data/
}
```

### Files

- `scraper.ts` - Main scraper (fetches & saves to Neo4j)
- `find-missing.ts` - Find records in HTML not in database
- `converter.ts` - Convert HTML to Neo4j format
- `utils.ts` - Shared utilities
- `data/` - Saved HTML files (p1.htm, p2.htm, etc.)

### NPM Scripts

```bash
npm run scrape          # Run main scraper
npm run find-missing    # Find missing records
npm run converter       # Run converter
```

### Data Flow

1. Fetch HTML from culpepperconnections.com
2. Parse with Cheerio (extract person data, relationships)
3. Save HTML to `data/` directory (if `SAVE_HTML: true`)
4. Create/merge Person nodes in Neo4j
5. Create relationships (PARENT_OF, SPOUSE_OF, SIBLING_OF)

---

## Environment Variables

### Application (`.env.local`)

```bash
# Neo4j
NEO4J_URI=neo4j+s://547733c6.databases.neo4j.io
NEO4J_USER=neo4j
NEO4J_PASSWORD=***
NEO4J_DATABASE=neo4j

# ConfigCat
NEXT_PUBLIC_CONFIGCAT_SDK_KEY=configcat-sdk-1/***
```

### Scraper (`env.json`)

See configuration section above.

---

## Development Commands

### Application

```bash
cd application
npm install
npm run dev          # Start dev server (localhost:3000)
npm run build        # Production build
npm run lint         # Run ESLint
```

### Scraper

```bash
cd scraper
npm install
npm run scrape       # Run scraper
npm run find-missing # Find missing records
```

---

## Key Conventions

1. **Imports**: Use `@components`, `@lib`, `@models`, `@functions` path mappings
2. **Exports**: Always export from barrel files (`index.ts`)
3. **Styling**: Use theme CSS classes (`.theme-*`)
4. **Feature Flags**: All routes must check `checkRouteAccess()`
5. **Neo4j**: Use `neo4j.int()` for integer parameters
6. **Components**: Server by default, add `'use client'` only when needed
7. **Dark Mode**: Use blocking script pattern + theme classes
