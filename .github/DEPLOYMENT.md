# GitHub Actions Deployment Setup

This workflow automatically deploys the application to Vercel when changes are pushed to `main`.

## Required GitHub Secrets

You need to add these secrets to your GitHub repository:

### 1. Go to GitHub Repository Settings
- Navigate to: `Settings` → `Secrets and variables` → `Actions`
- Click `New repository secret`

### 2. Add Vercel Secrets

**Get these from Vercel:**

1. **VERCEL_TOKEN**
   - Go to [Vercel Account Settings → Tokens](https://vercel.com/account/tokens)
   - Create a new token
   - Copy and save as `VERCEL_TOKEN`

2. **VERCEL_ORG_ID** and **VERCEL_PROJECT_ID**
   ```bash
   # Install Vercel CLI
   npm install -g vercel
   
   # Login to Vercel
   vercel login
   
   # Link your project (run from application folder)
   cd application
   vercel link
   
   # This creates .vercel/project.json with your IDs
   ```
   
   Or find them in:
   - Org ID: Vercel Settings → General
   - Project ID: Project Settings → General

### 3. Add Neo4j Secrets

**NEO4J_URI**
```
neo4j+s://547733c6.databases.neo4j.io
```

**NEO4J_USER**
```
neo4j
```

**NEO4J_PASSWORD**
```
J1HoqaoP4DUAXoKFsfD-OwHG1ParaecsmLPZd1knilw
```

**NEO4J_DATABASE**
```
neo4j
```

## How It Works

1. Push code to `main` branch
2. GitHub Actions automatically:
   - Checks out code
   - Installs dependencies
   - Builds the Next.js app
   - Deploys to Vercel production
3. Your site updates at culpepper.info

## Preview Deployments

Pull requests automatically get preview deployments with unique URLs for testing before merging.

## Monitoring

- View deployment status: GitHub Actions tab
- View live deployments: [Vercel Dashboard](https://vercel.com/dashboard)
