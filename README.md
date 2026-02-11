# Culpepper Genealogy Project

This monorepo contains two projects for the Culpepper family genealogy website:

## 📁 Project Structure

```
culp_conn_scrap/
├── scraper/              # Data scraping tools
│   ├── scraper.ts        # Culpepper Connections crawler
│   ├── rootsweb-scraper.ts    # RootsWeb crawler
│   ├── utils.ts          # Helper functions
│   ├── rootsweb-utils.ts      # RootsWeb parser utilities
│   ├── converter.ts      # Data conversion utilities
│   ├── package.json      # Scraper dependencies
│   ├── tsconfig.json     # TypeScript config
│   └── env.json          # Neo4j credentials (gitignored)
│
├── application/          # Next.js genealogy website
│   ├── app/              # Next.js app directory
│   ├── components/       # React components
│   ├── lib/              # Utilities and Neo4j client
│   ├── documentation/    # Project documentation
│   └── package.json      # Website dependencies
│
├── shared/               # Shared types between scraper and website
│
├── data/                 # Cached HTML files (gitignored)
│   ├── culpepper/        # Culpepper Connections HTML
│   └── rootsweb/         # RootsWeb HTML files
└── README.md             # This file
```

## 🛠️ Projects

### Scraper (`/scraper`)

TypeScript-based web scrapers that:

- Crawl culpepperconnections.com and RootsWeb genealogy pages
- Extract genealogy data (names, dates, relationships)
- Save to Neo4j graph database

**Run the Culpepper Connections scraper:**

```bash
cd scraper
npm install
npm run scrape
```

**Run the RootsWeb scraper:**

```bash
cd scraper
npm install
npm run scrape:rootsweb
```

Note: RootsWeb has been offline since 2020. The RootsWeb scraper can work with archived HTML files in local storage.

### Website (`/application`)

Next.js TypeScript application that:

- Displays interactive family tree visualization
- Queries Neo4j database
- Provides search and filtering
- Hosted on Vercel at culpepper.info

📚 **Full documentation**: See [`application/documentation/`](./application/documentation/)

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
