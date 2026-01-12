# Person Page 404 Troubleshooting Guide

## Current Status

After implementing fixes, person detail pages still return 404 in production.

## Steps to Debug and Fix

### Step 1: Check Vercel Function Logs

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Click on **Deployments** → Latest Deployment
4. Click on the **Functions** tab
5. Look for errors in the logs for `/person/[id]`

**What to look for:**

- "Error fetching person" messages
- Database connection errors
- Environment variable missing errors
- Timeout errors

### Step 2: Verify Environment Variables

In Vercel Dashboard → Settings → Environment Variables, ensure these are set for **Production**:

```
NEXT_PUBLIC_BASE_URL=https://culpepper.info
NEO4J_URI=<your-neo4j-uri>
NEO4J_USERNAME=<your-username>
NEO4J_PASSWORD=<your-password>
NEO4J_DATABASE=neo4j
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-key>
NEXT_PUBLIC_CONFIGCAT_SDK_KEY=<your-configcat-key>
```

### Step 3: Test API Route Directly

Visit: `https://culpepper.info/api/person/1`

**Expected:** JSON response with person data  
**If 404:** The API route itself isn't working - check API route deployment  
**If 500:** Server error - check function logs and database connections  
**If JSON returned:** API works, issue is with the page component

### Step 4: Check Build Output

In Vercel Deployment → Build Logs, look for:

- Lines mentioning "person/[id]"
- Any errors during route compilation
- Warnings about dynamic routes

### Step 5: Force Clean Rebuild

1. Vercel Dashboard → Deployments
2. Click ••• on latest deployment → **Redeploy**
3. **Uncheck** "Use existing Build Cache"
4. Click **Redeploy**
5. Wait for deployment to complete

### Step 6: Check Vercel Project Settings

**Framework Preset:** Should be "Next.js"  
**Build Command:** Should be `next build` or empty (auto-detect)  
**Output Directory:** Should be empty (auto-detect) or `.next`  
**Install Command:** Should be empty or `npm install`

⚠️ **Make sure there's NO custom output directory like `out`**

### Step 7: Test with Simple Static Response

If still failing, let's test if dynamic routes work at all. Create a test file:

**File:** `app/test/[id]/page.tsx`

```typescript
export const dynamic = 'force-dynamic';

export default async function TestPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <div>Test ID: {id}</div>;
}
```

Deploy and test: `https://culpepper.info/test/123`  
**If this works:** Issue is with data fetching in person page  
**If this also 404s:** Issue is with Vercel dynamic route configuration

## Common Issues and Solutions

### Issue: VERCEL_URL not available during build

**Solution:** Use `NEXT_PUBLIC_BASE_URL` explicitly in Vercel env vars

### Issue: Database connection timeout

**Solution:** Check that Neo4j and Supabase are accessible from Vercel's servers

### Issue: Route not found in build output

**Solution:** Ensure `app/person/[id]/page.tsx` exists and exports a default component

### Issue: Page tries to statically generate at build time

**Solution:** Verify `export const dynamic = 'force-dynamic';` is in the file

### Issue: Fetch fails with CORS or network error

**Solution:** Use server-side data fetching, not client-side

## Alternative: Direct Database Access

Instead of fetching from our own API, we can fetch directly from the database in the page component. This is actually the recommended Next.js pattern for App Router.

Let me know if you want me to refactor to use direct database access instead of the API fetch pattern.

## Next Steps

1. **Check Vercel function logs first** - this will tell us exactly what's failing
2. **Verify the API route works** - test `/api/person/1` directly
3. **If API works but page doesn't** - the issue is in how the page is calling the API
4. **If API doesn't work** - we need to debug the database connections

Let me know what you find in the logs!
