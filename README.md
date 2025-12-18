# Culpepper Genealogy Project

This monorepo contains two projects for the Culpepper family genealogy website:

## 📁 Project Structure

```
culp_conn_scrap/
├── scraper/              # Data scraping tool
│   ├── scraper.ts        # Main crawler
│   ├── utils.ts          # Helper functions
│   ├── converter.ts      # Data conversion utilities
│   ├── package.json      # Scraper dependencies
│   ├── tsconfig.json     # TypeScript config
│   └── env.json          # Neo4j credentials (gitignored)
│
├── application/          # Next.js genealogy website
│   ├── app/              # Next.js app directory
│   ├── components/       # React components
│   ├── lib/              # Utilities and Neo4j client
│   └── package.json      # Website dependencies
│
├── shared/               # Shared types between scraper and website
│
├── data/                 # Cached HTML files (gitignored)
└── README.md             # This file
```

## 🛠️ Projects

### Scraper (`/scraper`)
TypeScript-based web scraper that:
- Crawls culpepperconnections.com
- Extracts genealogy data (names, dates, relationships)
- Saves to Neo4j graph database

**Run the scraper:**
```bash
cd scraper
npm install
npm run scrape
```

### Website (`/application`)
Next.js TypeScript application that:
- Displays interactive family tree visualization
- Queries Neo4j database
- Provides search and filtering
- Hosted on Vercel at culpepper.info

**Run locally:**
```bash
cd application
npm install
npm run dev
```

## 🔑 Environment Variables

Both projects require Neo4j credentials. See individual project READMEs for details.

## 📝 License

Private project for Culpepper family genealogy research.
