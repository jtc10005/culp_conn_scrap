# Vercel Environment Variable Setup

## Required Environment Variables for Production

To make the person detail pages work correctly in production, you need to set the following environment variable in your Vercel project settings:

### 1. Go to Vercel Dashboard
1. Navigate to your project: https://vercel.com/dashboard
2. Select your project (culpepper.info)
3. Go to **Settings** → **Environment Variables**

### 2. Add the Following Variable

**Variable Name:** `NEXT_PUBLIC_BASE_URL`  
**Value:** `https://culpepper.info`  
**Environment:** Production (and optionally Preview)

### 3. Other Required Variables

Make sure these are also set in Vercel:

- `NEO4J_URI` - Your Neo4j database URI
- `NEO4J_USERNAME` - Neo4j username
- `NEO4J_PASSWORD` - Neo4j password
- `NEO4J_DATABASE` - Neo4j database name (usually "neo4j")
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon key
- `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key (for admin access)
- `NEXT_PUBLIC_CONFIGCAT_SDK_KEY` - Your ConfigCat SDK key

### 4. Redeploy

After adding/updating environment variables:
1. Go to the **Deployments** tab
2. Find your latest deployment
3. Click the three dots menu (•••)
4. Select **Redeploy**
5. Make sure "Use existing Build Cache" is **unchecked**

## Alternative: Use VERCEL_URL

Vercel automatically provides `VERCEL_URL` which contains your deployment URL. Our code is already set up to use this, but it may not work in all cases during server-side rendering. Setting `NEXT_PUBLIC_BASE_URL` explicitly is more reliable.

## Troubleshooting

If person pages still show 404:

1. Check Vercel build logs for errors
2. Verify all environment variables are set correctly
3. Make sure the API route `/api/person/[id]` works (test: `https://culpepper.info/api/person/1`)
4. Check that Neo4j and Supabase connections are working
5. Review function logs in Vercel dashboard for any runtime errors
