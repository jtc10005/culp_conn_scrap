# Person Detail Page 404 Fix

## Problem

Person detail pages (e.g., `/person/41252`) were returning 404 errors in production on Vercel, even though:

- The API route `/api/person/[id]` was working correctly
- The pages worked fine locally

## Root Cause

1. **Missing dynamic route configuration**: Next.js 15+ requires explicit configuration for dynamic routes that should be rendered on-demand
2. **Missing VERCEL_URL environment variable**: The page was trying to fetch from the API using `NEXT_PUBLIC_BASE_URL`, which wasn't properly configured for Vercel's environment

## Solution

Made two key changes to `app/person/[id]/page.tsx`:

### 1. Added Dynamic Route Configuration

```typescript
export const dynamic = 'force-dynamic';
```

This tells Next.js to render this page dynamically on each request, rather than trying to statically generate it at build time.

### 2. Fixed API Fetch URL

Updated the `getPerson` function to properly construct the base URL:

```typescript
const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
```

This ensures:

- In Vercel production: Uses `VERCEL_URL` (automatically provided by Vercel)
- In local development: Uses `NEXT_PUBLIC_BASE_URL` or falls back to `localhost:3000`

## Deployment Steps

1. Commit and push these changes
2. Vercel will automatically redeploy
3. Test by visiting: `https://culpepper.info/person/41252`

## Verification

After deployment, all person detail pages should work correctly:

- ✅ `/person/1`
- ✅ `/person/41252`
- ✅ Any other person ID

## Note on `next export`

This fix is compatible with SSR (Server-Side Rendering). The project does NOT use `next export`:

- ✅ `package.json` uses `next build` (correct for SSR)
- ✅ `next.config.ts` has no `output: 'export'` (correct for SSR)
- ✅ Vercel deployment uses default SSR mode
