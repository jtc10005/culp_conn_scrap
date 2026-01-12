# Culpepper Family Genealogy Application

A Next.js application for exploring the Culpepper family tree with data from Neo4j and Supabase.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Visit `http://localhost:3000` to view the application.

## 🔑 Environment Variables

Create a `.env.local` file with the following variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Neo4j
NEO4J_URI=your_neo4j_uri
NEO4J_USERNAME=your_username
NEO4J_PASSWORD=your_password
NEO4J_DATABASE=neo4j

# ConfigCat (Feature Flags)
NEXT_PUBLIC_CONFIGCAT_SDK_KEY=your_configcat_key

# Application URL (for production)
NEXT_PUBLIC_BASE_URL=https://culpepper.info
```

## ✨ Features

- 🌳 **Family Tree Visualization** - Interactive D3.js family tree
- � **Person Detail Pages** - Comprehensive biographical information
- � **Timeline View** - Life events and family relationships
- 🔍 **Search & Filter** - Find people by name, date, location
- � **Bulletin Board** - Community announcements and updates
- 🎨 **Theme Customization** - Dark mode and calligraphic fonts
- 🔐 **Authentication** - Social login (Google, Facebook, Apple, X/Twitter)
- 🚩 **Feature Flags** - ConfigCat integration for dynamic features

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Database**: Neo4j (graph database) + Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Feature Flags**: ConfigCat
- **Styling**: Tailwind CSS
- **Visualization**: D3.js
- **Deployment**: Vercel

## 📁 Project Structure

```
application/
├── app/                  # Next.js app router pages
│   ├── api/             # API routes
│   ├── person/[id]/     # Dynamic person detail pages
│   ├── people/          # People search page
│   ├── tree/            # Family tree visualization
│   └── bulletin-board/  # Community bulletin board
├── components/          # React components
├── lib/                 # Utility functions and services
│   ├── featureFlags.ts  # ConfigCat integration
│   ├── neo4j.ts         # Neo4j database client
│   ├── supabase.ts      # Supabase client
│   └── types.ts         # TypeScript type definitions
├── public/              # Static assets
└── documentation/       # Project documentation
```

## 📚 Documentation

Detailed documentation is available in the [`documentation/`](./documentation/) folder:

### Setup & Configuration

- [**ConfigCat Setup**](./documentation/CONFIGCAT_SETUP.md) - Feature flags configuration
- [**Bulletin Board Setup**](./documentation/BULLETIN_BOARD_SETUP.md) - Community bulletin board
- [**Vercel Environment Setup**](./documentation/VERCEL_ENV_SETUP.md) - Production deployment

### Troubleshooting & Guides

- [**Issue Resolved**](./documentation/ISSUE_RESOLVED.md) - Resolved person page 404 issue
- [**Debug 404**](./documentation/DEBUG_404.md) - Troubleshooting 404 errors
- [**Deployment Checklist**](./documentation/DEPLOYMENT_CHECKLIST.md) - Complete deployment guide
- [**Local Build Test**](./documentation/LOCAL_BUILD_TEST.md) - Testing builds locally

### Customization

- [**Theme Customization**](./documentation/THEME_CUSTOMIZATION.md) - Styling and themes
- [**Edit Feature Flag**](./documentation/EDIT_FEATURE_FLAG.md) - Managing feature flags

## 🔧 Development

```bash
# Run linter
npm run lint

# Format code
npm run format

# Type checking (if configured)
npx tsc --noEmit
```

## 🚀 Deployment

This application is deployed on Vercel at [culpepper.info](https://culpepper.info).

**Important**: Make sure all environment variables are set in Vercel's project settings before deploying.

See [Deployment Checklist](./documentation/DEPLOYMENT_CHECKLIST.md) for complete deployment instructions.

## 📝 Key Learnings

- Always prioritize `NEXT_PUBLIC_BASE_URL` over `VERCEL_URL` for production API calls
- Use ConfigCat feature flags for dynamic feature management
- Neo4j for relationship data + Supabase for relational/event data works well together
- Server-side rendering requires careful environment variable management

## 📄 License

Private project - All rights reserved

## 👤 Contact

For questions or access requests, please contact the repository owner.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
