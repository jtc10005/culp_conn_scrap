# Local Build Test

To test if the route will build correctly before deploying:

## 1. Build Locally

```bash
cd application
npm run build
```

## 2. Check Build Output

Look for this in the output:

```
Route (app)                              Size     First Load JS
┌ ƒ /person/[id]                        ###      ### kB
```

The `ƒ` symbol means it's a dynamic server-rendered route (correct!)

If you see `○` instead, it means static, which would be wrong.

## 3. Test Locally with Production Build

```bash
npm run start
```

Then visit: `http://localhost:3000/person/1`

If it works locally in production mode, it should work on Vercel.

## 4. Common Build Issues

### Issue: "Module not found"

**Fix:** Run `npm install` to ensure all dependencies are installed

### Issue: TypeScript errors

**Fix:** Check the error message and fix the TypeScript issues

### Issue: Route not showing in build output

**Fix:**

- Verify file is at `app/person/[id]/page.tsx`
- Check that the file exports a default component
- Ensure `export const dynamic = 'force-dynamic'` is present

### Issue: Build succeeds but page shows 404 locally

**Fix:**

- Stop the dev server (`Ctrl+C`)
- Delete `.next` folder
- Run `npm run build` again
- Run `npm run start`

## 5. What to Look For in Build Logs

**Good signs:**

```
✓ Compiled successfully
Route (app)                              Size     First Load JS
├ ○ /                                    ###      ### kB
├ ƒ /api/person/[id]                    ###      ### kB
├ ƒ /person/[id]                        ###      ### kB
```

**Bad signs:**

```
✗ Failed to compile
Error: Cannot find module...
```

or

```
○ /person/[id]                          ### kB  (SSG)
```

(○ means static, we want ƒ for dynamic)

## 6. If Local Build Works

If `npm run build && npm run start` works locally:

1. The code is correct
2. The issue is with Vercel configuration or environment variables
3. Check Vercel settings carefully
4. Ensure all environment variables are set in Vercel

## 7. If Local Build Fails

If you get errors during `npm run build`:

1. Fix the errors first
2. Don't deploy until local build succeeds
3. The same errors will occur in Vercel
