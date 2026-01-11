# Debug Logging Setup for Person Page 404 Troubleshooting

## What Was Added

Added a ConfigCat feature flag called `debugLogging` that enables verbose logging for the person detail page to help diagnose the 404 issue.

## Setup in ConfigCat

1. Go to your ConfigCat dashboard
2. Navigate to your environment (Production or Local)
3. Click **Add Setting**
4. Configure:
   - **Key:** `debugLogging`
   - **Type:** Boolean (On/Off Toggle)
   - **Default value:** `false` (off)
5. Click **Save**

## How to Use

### Enable Debug Logging

1. In ConfigCat, find the `debugLogging` setting
2. Toggle it to **ON** (true)
3. Wait 60 seconds for the config to sync (or less if you set faster polling)

### Check Logs in Vercel

1. Visit: `https://culpepper.info/person/1`
2. Go to Vercel Dashboard → Deployments → Latest
3. Click **Functions** tab
4. Click on the `app/person/[id]/page` function
5. View the **Real-time Logs**

You should now see detailed debug output like:

```
[DEBUG] Using VERCEL_URL: xxx.vercel.app
[DEBUG] Environment variables: { VERCEL_URL: '...', NEXT_PUBLIC_BASE_URL: '...', ... }
[DEBUG] Fetching from: https://xxx.vercel.app/api/person/1
[DEBUG] Response status: 200
[DEBUG] Response ok: true
[DEBUG] Data received: true
[DEBUG] PersonPage rendered for id: 1
[DEBUG] Person found: true
```

OR if there's an error:

```
[DEBUG] Using NEXT_PUBLIC_BASE_URL: https://culpepper.info
[DEBUG] Fetching from: https://culpepper.info/api/person/1
[DEBUG] Response status: 404
[DEBUG] Response ok: false
[DEBUG] Response not ok, returning null
[DEBUG] PersonPage rendered for id: 1
[DEBUG] Person found: false
[DEBUG] Person not found, calling notFound()
```

### What the Logs Tell Us

The debug logs will reveal:

1. **Which environment variable is being used** (VERCEL_URL vs NEXT_PUBLIC_BASE_URL)
2. **The exact URL being fetched**
3. **The HTTP response status**
4. **Whether data was received**
5. **Whether the person was found**

### Disable Debug Logging

Once you've identified the issue:

1. Go back to ConfigCat
2. Toggle `debugLogging` to **OFF** (false)
3. Logs will stop after the next config sync

## What to Look For

### Scenario 1: Wrong URL

```
[DEBUG] Fetching from: https://wrong-url.vercel.app/api/person/1
```

**Solution:** The environment variable is incorrect or pointing to the wrong deployment

### Scenario 2: Fetch Fails

```
[DEBUG] Response status: 404
[DEBUG] Response ok: false
```

**Solution:** The API route isn't accessible from the server-side function

### Scenario 3: Environment Variables Missing

```
[DEBUG] Environment variables: { VERCEL_URL: undefined, NEXT_PUBLIC_BASE_URL: undefined, ... }
```

**Solution:** Environment variables aren't set in Vercel

### Scenario 4: Fetch Succeeds But No Data

```
[DEBUG] Response status: 200
[DEBUG] Data received: false
```

**Solution:** API returns 200 but with empty/invalid data

## Next Steps After Reviewing Logs

Once you've enabled the flag and reviewed the logs, share the debug output and we can pinpoint exactly where the failure is occurring.

## Code Changes Made

### `lib/featureFlags.ts`

Added new function:

```typescript
export async function getDebugLoggingEnabled(): Promise<boolean> {
  return getFeatureFlag('debugLogging', false);
}
```

### `app/person/[id]/page.tsx`

- Added debug logging throughout `getPerson()` function
- Added debug logging in `PersonPage` component
- All logging is conditional based on the `debugLogging` flag
