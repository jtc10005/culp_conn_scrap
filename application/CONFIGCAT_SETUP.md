# ConfigCat Feature Flags Setup

## Installation

1. Install the ConfigCat SDK:

```bash
cd application
npm install configcat-js-ssr
```

## ConfigCat Dashboard Setup

### 1. Create Navigation Config Setting

In your ConfigCat dashboard:

1. Go to **Feature Flags & Settings**
2. Click **Add Setting**
3. Create a setting with these details:
   - **Key**: `navigation_config`
   - **Name**: Navigation Configuration
   - **Type**: **Text** (we store JSON as a string)
   - **Default Value** (single line, no whitespace):

   ```json
   {
     "tree": true,
     "history": true,
     "people": true,
     "acknowledgements": true,
     "practice": true,
     "about": false
   }
   ```

   **Important**: ConfigCat uses text settings for JSON data. Make sure to enter the JSON on a single line without extra whitespace.

### 2. Create Calligraphic Font Flag

1. Go to **Feature Flags & Settings**
2. Click **Add Setting**
3. Create a setting with these details:
   - **Key**: `calligraphic_font`
   - **Name**: Calligraphic Font
   - **Type**: **Boolean**
   - **Default Value**: `false`

   This flag controls whether to use Tangerine calligraphic font site-wide (experimental).

### Flag Options:

**Navigation Config (`navigation_config` - Text/JSON):**

- `tree` - Show/hide Family Tree navigation and route
- `history` - Show/hide Family History navigation and route
- `people` - Show/hide Browse People navigation and route
- `acknowledgements` - Show/hide Credits navigation and route
- `practice` - Show/hide SVG Practice navigation and route
- `about` - Show/hide About page navigation and route

**Calligraphic Font (`calligraphic_font` - Boolean):**

- `true` - Apply Tangerine calligraphic font to all text site-wide
- `false` - Use standard Geist fonts (default)

### 2. Get Your SDK Key

1. Go to **Settings** → **SDK Keys**
2. Copy your **SDK Key**
3. Add it to your `.env.local` file:

```env
NEXT_PUBLIC_CONFIGCAT_SDK_KEY=your_sdk_key_here
```

## Environment Variables

Create or update `application/.env.local`:

```env
# Neo4j
NEO4J_URI=neo4j+s://547733c6.databases.neo4j.io
NEO4J_USER=neo4j
NEO4J_PASSWORD=J1HoqaoP4DUAXoKFsfD-OwHG1ParaecsmLPZd1knilw
NEO4J_DATABASE=neo4j

# ConfigCat
NEXT_PUBLIC_CONFIGCAT_SDK_KEY=your_configcat_sdk_key_here
```

## Usage

The feature flags are automatically integrated into the Header component.

### To Hide/Show Navigation Links:

1. Go to your ConfigCat dashboard
2. Edit the `navigation_config` flag
3. Toggle individual links by changing the JSON values:

```json
{
  "tree": true, // Show Family Tree link
  "history": false, // Hide History link
  "people": true, // Show People link
  "acknowledgements": false, // Hide Credits link
  "practice": false // Hide Practice link
}
```

4. Save changes
5. Your site will update within 60 seconds (auto-polling)

### Switch to New Header (After Installation)

In `application/app/layout.tsx`, change:

```tsx
// Old
import Header from '@/components/Header';

// New
import Header from '@/components/HeaderWithFlags';
```

## How It Works

### Single Text Setting with JSON (Recommended)

- **One text setting** stores a JSON string that controls all navigation visibility
- Easy to manage in one place
- Cleaner dashboard
- The code automatically parses the JSON string from the text setting
- JSON structure (as a string):
  ```json
  { "tree": true, "history": true, "people": true, "acknowledgements": true, "practice": true }
  ```

### Benefits

- ✅ Instant updates without deployment
- ✅ A/B testing capability
- ✅ Environment-specific configs
- ✅ Easy rollback
- ✅ Free tier: 10 settings, unlimited requests

## Alternative: Individual Boolean Flags

If you prefer separate flags for each link:

1. Create individual flags in ConfigCat:
   - `show_tree_link` (Boolean)
   - `show_history_link` (Boolean)
   - `show_people_link` (Boolean)
   - `show_acknowledgements_link` (Boolean)
   - `show_practice_link` (Boolean)

2. Update `lib/featureFlags.ts` to use individual flags instead of JSON

## Troubleshooting

### SDK Key Not Found

- Make sure `NEXT_PUBLIC_CONFIGCAT_SDK_KEY` is in `.env.local`
- Restart your Next.js dev server after adding env variables

### Changes Not Appearing

- ConfigCat polls every 60 seconds by default
- Force refresh: restart your Next.js server
- Check ConfigCat dashboard to verify flag is saved

### All Links Show (Fallback)

- If ConfigCat fails to connect, all links show by default
- Check console for error messages
- Verify SDK key is correct

## Files Created

- `application/lib/featureFlags.ts` - ConfigCat client and utilities
- `application/components/HeaderWithFlags.tsx` - Server component with feature flags
- `application/components/DarkModeToggle.tsx` - Client component for dark mode

## Next Steps

1. Install the SDK: `npm install configcat-js-ssr`
2. Add your SDK key to `.env.local`
3. Switch to `HeaderWithFlags` in `layout.tsx`
4. Test by toggling flags in ConfigCat dashboard
