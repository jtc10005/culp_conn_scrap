# Quick Action Items to Fix 404

## Immediate Actions Required

### 1. Set Environment Variable in Vercel (CRITICAL)

1. Go to: https://vercel.com/dashboard
2. Select your project (culpepper.info)
3. Go to **Settings** → **Environment Variables**
4. Add new variable:
   - **Name:** `NEXT_PUBLIC_BASE_URL`
   - **Value:** `https://culpepper.info`
   - **Environment:** Select **Production** ✓

### 2. Redeploy with Clean Build

1. Go to **Deployments** tab
2. Click ••• on the latest deployment
3. Select **Redeploy**
4. ⚠️ **UNCHECK** "Use existing Build Cache"
5. Click **Redeploy** button

### 3. Wait and Test

- Wait 2-3 minutes for deployment to complete
- Test: `https://culpepper.info/person/1`
- Test: `https://culpepper.info/person/41252`

## If Still 404 After Above Steps

### Check the API Route First

Visit: `https://culpepper.info/api/person/1`

**If you get JSON data back:**
- The API works, issue is with the page component
- Check Vercel function logs for the page function

**If you get 404 or error:**
- The API route itself isn't working
- Check Neo4j and Supabase connections
- Verify all database environment variables are set

### Check Vercel Function Logs

1. Vercel Dashboard → Deployments → Latest
2. Click on **Functions** tab
3. Look for `/person/[id]` function
4. Check logs for error messages
5. Look for console.log outputs we added

## Code Changes Already Made

✅ Added `export const dynamic = 'force-dynamic';`  
✅ Added fallback logic for base URL  
✅ Added console.log debugging  
✅ Using proper Next.js 15 params syntax

## What the Console Logs Will Show

In Vercel function logs, you should see:
```
Fetching from: https://culpepper.info/api/person/1
Response status: 200
```

If you see different values, that tells us what's wrong.

## Most Likely Cause

Based on typical Vercel + Next.js issues, the most likely causes are:

1. **Missing `NEXT_PUBLIC_BASE_URL`** - Set this first!
2. **Database connection issues** - Verify Neo4j/Supabase env vars
3. **Build cache issue** - Do a clean redeploy
4. **VERCEL_URL not available** - That's why we need NEXT_PUBLIC_BASE_URL

## Alternative Solution (If Above Doesn't Work)

I can refactor the code to:
- Skip the internal API call
- Fetch directly from Neo4j/Supabase in the page component
- This is actually the recommended Next.js App Router pattern

Let me know if you want me to implement this alternative approach.
