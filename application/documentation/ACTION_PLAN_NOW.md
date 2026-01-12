# IMMEDIATE ACTION PLAN - Fix Person Page 404

## What's Happening

`GET https://culpepper.info/person/1` returns 404 - the route isn't being recognized at all.

## What I Just Changed

Updated `application/app/person/[id]/page.tsx` with these route segment config options:

```typescript
export const dynamic = 'force-dynamic';
export const dynamicParams = true;
export const revalidate = 0;
export const runtime = 'nodejs';
```

## DO THIS NOW (In Order):

### 1. Test Build Locally First (5 minutes)

```bash
cd application
npm run build
```

**Look for this in the output:**

```
Route (app)
├ ƒ /person/[id]        <-- Should have "ƒ" not "○"
```

**If build fails:** Fix the errors before deploying  
**If build succeeds:** Continue to step 2

### 2. Test Locally in Production Mode (2 minutes)

```bash
npm run start
```

Visit: `http://localhost:3000/person/1`

**If it works:** Great! The code is fine, Vercel is the issue  
**If 404 locally:** There's a code issue we need to fix first

### 3. Commit and Push (1 minute)

```bash
git add .
git commit -m "Add dynamic route config for person pages"
git push origin main
```

### 4. Check Vercel Auto-Deploy (5-10 minutes)

Wait for Vercel to auto-deploy, then:

1. Go to Vercel Dashboard → Deployments
2. Click on the latest deployment
3. Check the **Build Logs** tab
4. Look for `/person/[id]` in the route list

**Should see:**

```
Route (app)
├ ƒ /person/[id]
```

### 5. Test the Deployment

Visit: `https://culpepper.info/person/1`

**If it works:** Problem solved! ✅  
**If still 404:** Continue to step 6

### 6. If Still 404 - Check Vercel Functions

1. Vercel Dashboard → Deployments → Latest
2. Click **Functions** tab
3. Look for `/person/[id]`

**If you DON'T see it:** The route wasn't built - check build logs for errors  
**If you DO see it:** Click it to see function logs for errors

### 7. If STILL 404 - Set Environment Variable

Vercel Dashboard → Settings → Environment Variables

Add:

- **Name:** `NEXT_PUBLIC_BASE_URL`
- **Value:** `https://culpepper.info`
- **Environment:** Production ✓

Then **Redeploy** (uncheck cache)

### 8. If STILL 404 - Try Direct DB Access

At this point, we should refactor to skip the API call and fetch directly from the database. This is actually the recommended Next.js pattern.

## Quick Checks

Before deploying, verify:

- [ ] File exists at: `application/app/person/[id]/page.tsx`
- [ ] File has `export default async function PersonPage`
- [ ] File has `export const dynamic = 'force-dynamic'`
- [ ] Local build succeeds (`npm run build`)
- [ ] Local production mode works (`npm run start`)

## Most Likely Issues

1. **Route not being built** - Fixed by the export configs I just added
2. **Missing environment variable** - Add `NEXT_PUBLIC_BASE_URL` in Vercel
3. **Build cache** - Redeploy without cache
4. **Database connection issue** - Check Neo4j/Supabase env vars

## What to Tell Me

After you test locally and deploy, tell me:

1. Did local build succeed?
2. Did local production mode work?
3. What does the Vercel build log show for the route?
4. Does the Functions tab in Vercel show `/person/[id]`?
5. Any errors in the function logs?

This will help me determine the next step!
