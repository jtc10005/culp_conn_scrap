# Person Page 404 - Complete Deployment Checklist

## Current Issue

`GET https://culpepper.info/person/1 404 (Not Found)`

This means the route itself isn't being recognized by Next.js/Vercel, not that the data fetch is failing.

## Recent Code Changes

Added these exports to `app/person/[id]/page.tsx`:

```typescript
export const dynamic = 'force-dynamic';
export const dynamicParams = true;
export const revalidate = 0;
export const runtime = 'nodejs';
```

## CRITICAL: Vercel Deployment Steps

### Step 1: Verify Build Settings

In Vercel Dashboard → Settings → General:

- **Framework Preset:** Next.js
- **Build Command:** (leave empty or `npm run build`)
- **Output Directory:** (leave empty - do NOT set to `out`)
- **Install Command:** (leave empty or `npm install`)
- **Node Version:** 18.x or 20.x

### Step 2: Set Environment Variables

In Vercel Dashboard → Settings → Environment Variables, ensure ALL these are set for **Production**:

```
NEXT_PUBLIC_BASE_URL=https://culpepper.info
NEO4J_URI=<your-value>
NEO4J_USERNAME=<your-value>
NEO4J_PASSWORD=<your-value>
NEO4J_DATABASE=neo4j
NEXT_PUBLIC_SUPABASE_URL=<your-value>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-value>
SUPABASE_SERVICE_ROLE_KEY=<your-value>
NEXT_PUBLIC_CONFIGCAT_SDK_KEY=<your-value>
```

### Step 3: Check Vercel Project Settings

**CRITICAL - Check if Functions are Enabled:**

1. Vercel Dashboard → Settings → Functions
2. Ensure serverless functions are enabled
3. Check that function timeout is at least 10 seconds

### Step 4: Commit and Deploy

```bash
git add .
git commit -m "Fix person detail page dynamic routing"
git push origin main
```

### Step 5: Force Clean Build in Vercel

1. Go to Deployments tab
2. Wait for auto-deploy to complete OR click "Redeploy"
3. **UNCHECK** "Use existing Build Cache"
4. Click "Redeploy"

### Step 6: Check Build Logs

In the deployment:

1. Look for "Route (app)" section in build output
2. Verify you see: `ƒ /person/[id]` (the ƒ means function/dynamic)
3. Should NOT see `○ /person/[id]` (○ means static)

### Step 7: Verify Routes in Vercel

After deployment, check:

1. Deployments → Latest → Functions tab
2. Look for `/person/[id]` function
3. If it's NOT there, the route didn't get built properly

## Troubleshooting

### If Route Still Shows 404

**Option A: Test API Route First**

```
Visit: https://culpepper.info/api/person/1
```

- If this works but page doesn't, it's a routing issue
- If this also fails, it's a database/env var issue

**Option B: Check for TypeScript Errors**

Run locally:

```bash
cd application
npm run build
```

Look for any errors in the build output, especially:

- TypeScript compilation errors
- Route generation errors
- Missing dependencies

**Option C: Verify File Structure**

Ensure the file is at exactly:

```
application/app/person/[id]/page.tsx
```

Not at:

- `application/app/person/[id].tsx` (wrong)
- `application/app/person/[id]/index.tsx` (wrong for App Router)

**Option D: Check .gitignore**

Make sure `.gitignore` isn't excluding the person folder:

```bash
# Check if person folder is being tracked
git ls-files application/app/person/
```

Should show: `application/app/person/[id]/page.tsx`

### If Still Not Working

The issue might be with how Vercel is building the project. Try:

1. **Check if there's a `vercel.json` file** that might be overriding settings
2. **Look at the actual deployment URL** in Vercel - sometimes preview deployments work but production doesn't
3. **Check Vercel regions** - ensure your function region matches your database region

## Alternative Solution: Refactor to Direct DB Access

If all else fails, we can refactor the page to skip the API call and fetch directly from the database. This is actually the recommended Next.js App Router pattern:

```typescript
import { getNeo4jDriver, getSupabaseAdmin } from '@/lib';

async function getPerson(id: string) {
  const driver = getNeo4jDriver();
  const session = driver.session();
  // ... direct database query
}
```

This would eliminate the need for the internal API fetch and might be more reliable.

## Next Steps

1. ✅ Commit and push the code changes
2. ⏳ Wait for Vercel auto-deploy OR manually redeploy
3. ⏳ Check build logs for route compilation
4. ⏳ Test: https://culpepper.info/person/1
5. ⏳ If still failing, check Vercel function logs
6. ⏳ If still failing, implement direct DB access approach

Let me know what you see in the Vercel build logs!
