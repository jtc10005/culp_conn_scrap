# Edit Submission Feature Flag Setup

## ConfigCat Configuration

To enable/disable the edit submission feature, configure the following feature flag in ConfigCat:

### Feature Flag Details

**Flag Key**: `editPersonRecordFlag`  
**Type**: Boolean  
**Default Value**: `false` (disabled by default)

### How to Configure in ConfigCat

1. **Log in to ConfigCat Dashboard**: https://app.configcat.com/
2. **Navigate to your project**
3. **Go to Feature Flags & Settings**
4. **Create a new feature flag**:
   - **Name**: Edit Person Record
   - **Key**: `editPersonRecordFlag`
   - **Type**: Boolean
   - **Default Value**: OFF (false)

5. **Save the flag**

### Turning ON the Feature

To enable edit submissions:

1. Go to the `editPersonRecordFlag` setting
2. Toggle the switch to **ON** (true)
3. Save changes
4. The feature will be enabled within 60 seconds (ConfigCat polling interval)

### What This Controls

When `editPersonRecordFlag` is **ON** (true):

- ✅ "Suggest Edit" button appears on person detail pages
- ✅ Users can submit edit suggestions
- ✅ Edit submission API endpoint accepts requests

When `editPersonRecordFlag` is **OFF** (false):

- ❌ "Suggest Edit" button is hidden
- ❌ Edit submission API returns 403 Forbidden
- ❌ Users cannot submit edits

### Testing

**To test locally**:

1. Make sure `NEXT_PUBLIC_CONFIGCAT_SDK_KEY` is set in `.env.local`
2. Toggle the flag in ConfigCat dashboard
3. Wait ~60 seconds for polling to update
4. Refresh the person detail page
5. Button should appear/disappear based on flag value

### Code References

- **Feature Flag Function**: `application/lib/featureFlags.ts` → `getEditPersonRecordEnabled()`
- **UI Component**: `application/components/SuggestEditButton.tsx`
- **API Protection**: `application/app/api/edits/submit/route.ts`
- **Page Integration**: `application/app/person/[id]/page.tsx`

### Admin Review Dashboard

Note: The admin review functionality is NOT behind a feature flag, as it's intended for administrators only. Access control for the admin dashboard should be implemented separately through authentication/authorization.
