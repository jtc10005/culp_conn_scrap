# Bulletin Board Setup Guide

## ✅ What's Been Created

### 1. Database Schema (`supabase-bulletin-board-schema.sql`)

- `user_profiles` - User profile information
- `bulletin_posts` - Main posts/questions
- `bulletin_comments` - Comments and replies
- `bulletin_post_likes` - Post likes/reactions
- `bulletin_comment_likes` - Comment likes
- Views for easier querying with author details and counts
- Automatic user profile creation on signup
- Row Level Security (RLS) policies

### 2. Authentication System

- **AuthProvider** (`lib/auth.tsx`) - React context for auth state
- **AuthModal** (`components/AuthModal.tsx`) - Login/signup modal
- **OAuth Callback** (`app/auth/callback/route.ts`) - Handles social login redirects

### 3. Bulletin Board Page (`app/bulletin-board/page.tsx`)

- View all posts
- Create new posts (authenticated users only)
- Post categories (question, discussion, announcement)
- View counts, comment counts, like counts
- Responsive design

### 4. Navigation

- Added "Bulletin Board" link to header (desktop & mobile)

## 🚀 Setup Steps

### Step 1: Run the Database Schema

1. Go to your Supabase dashboard
2. Navigate to **SQL Editor**
3. Open `application/supabase-bulletin-board-schema.sql`
4. Copy and paste the entire file
5. Click **Run** to execute

### Step 2: Enable Social Authentication (Optional)

#### Google OAuth:

1. Supabase Dashboard → **Authentication** → **Providers**
2. Enable **Google**
3. Go to [Google Cloud Console](https://console.cloud.google.com)
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `https://tygrhzeshzlcpwihrbnt.supabase.co/auth/v1/callback`
6. Copy Client ID and Client Secret to Supabase

#### Facebook OAuth:

1. Supabase Dashboard → **Authentication** → **Providers**
2. Enable **Facebook**
3. Go to [Facebook Developers](https://developers.facebook.com)
4. Create an app
5. Add redirect URI: `https://tygrhzeshzlcpwihrbnt.supabase.co/auth/v1/callback`
6. Copy App ID and App Secret to Supabase

#### Twitter/X OAuth:

1. Supabase Dashboard → **Authentication** → **Providers**
2. Enable **Twitter**
3. Go to [Twitter Developer Portal](https://developer.twitter.com)
4. Create an app with OAuth 2.0
5. Add callback URL: `https://tygrhzeshzlcpwihrbnt.supabase.co/auth/v1/callback`
6. Copy API Key and Secret to Supabase

#### Apple OAuth:

1. Supabase Dashboard → **Authentication** → **Providers**
2. Enable **Apple**
3. Go to [Apple Developer](https://developer.apple.com)
4. Create a Service ID
5. Configure Sign in with Apple
6. Add redirect URI: `https://tygrhzeshzlcpwihrbnt.supabase.co/auth/v1/callback`
7. Copy Service ID and Key to Supabase

### Step 3: Enable Bulletin Board in ConfigCat (Optional)

If you're using ConfigCat feature flags:

1. Go to ConfigCat Dashboard → **Feature Flags & Settings**
2. Find the `navigation_config` setting
3. Update the JSON to include `"bulletinBoard": true`:
   ```json
   {
     "tree": true,
     "history": true,
     "people": true,
     "bulletinBoard": true,
     "acknowledgements": true,
     "practice": true,
     "about": false
   }
   ```

If `bulletinBoard` is set to `false`, the route will show a 404 page.

### Step 4: Configure Login Methods in ConfigCat (Optional)

Control which social login options are displayed on the bulletin board:

1. Go to ConfigCat Dashboard → **Feature Flags & Settings**
2. Create or find the `loginMethods` text setting
3. Set the JSON value to enable/disable social login providers:
   ```json
   {
     "facebook": false,
     "X": false,
     "google": false,
     "apple": false
   }
   ```

**Notes:**

- Set any provider to `true` to show that login button
- All providers default to `false` until you configure OAuth in Supabase (Step 2)
- The social login section is completely hidden when all providers are `false`
- Enable providers only after completing their OAuth setup in Step 2

### Step 5: Configure Email Settings (Optional)

1. Supabase Dashboard → **Authentication** → **Email Templates**
2. Customize confirmation email, reset password email, etc.
3. **Authentication** → **URL Configuration**
4. Set Site URL: `https://your-domain.com`
5. Add redirect URLs for localhost during development

### Step 6: Test the Application

```bash
cd application
npm run dev
```

Visit `http://localhost:3000/bulletin-board` and test:

- Creating account (email/password)
- Social login (if enabled)
- Creating a post (requires authentication)
- Viewing posts (public)

## 📝 Next Features to Add (Optional)

### Immediate Enhancements:

1. **Post Detail Page** (`app/bulletin-board/[id]/page.tsx`)
   - Full post view
   - Comment system
   - Like/unlike functionality
   - Edit/delete own posts

2. **User Profile Page** (`app/profile/page.tsx`)
   - View/edit profile
   - See user's posts
   - Avatar upload

3. **Search & Filter**
   - Search posts by title/content
   - Filter by category
   - Sort by date, popularity, etc.

4. **Notifications** (using Supabase Realtime)
   - New comments on your posts
   - Mentions
   - Likes

5. **Moderation**
   - Report posts/comments
   - Admin panel
   - User roles (admin, moderator, user)

### API Routes Needed:

- `/api/bulletin/posts` - CRUD operations
- `/api/bulletin/comments` - Comment operations
- `/api/bulletin/likes` - Like/unlike
- `/api/profile/[userId]` - Profile management

## 🎨 Customization

### Styling:

- Uses existing theme classes (`theme-banner-bg`, `dark:bg-gray-800`, etc.)
- Fully responsive
- Dark mode support

### Categories:

Edit in `page.tsx` to add more categories:

```typescript
<option value="genealogy-help">Genealogy Help</option>
<option value="family-story">Family Story</option>
<option value="photo-share">Photo Share</option>
```

### Permissions:

Modify RLS policies in `supabase-bulletin-board-schema.sql`:

```sql
-- Example: Make posts require approval
CREATE POLICY "Posts need approval" ON bulletin_posts FOR SELECT
  USING (is_approved = true OR author_id = auth.uid());
```

## 🔒 Security Notes

- ✅ Row Level Security (RLS) enabled on all tables
- ✅ Users can only edit/delete their own content
- ✅ Social auth uses secure OAuth flow
- ✅ Passwords hashed by Supabase Auth
- ✅ Public can read, only authenticated can write

## 🐛 Troubleshooting

**"Can't create post":**

- Check if user is authenticated
- Verify Supabase credentials in `.env.local`
- Check browser console for errors

**"Social login not working":**

- Verify OAuth provider is enabled in Supabase
- Check redirect URIs match exactly
- Ensure site URL is configured

**"Posts not loading":**

- Run the SQL schema in Supabase
- Check RLS policies are applied
- Verify Supabase connection

## 📚 Resources

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Supabase RLS Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Next.js Auth Patterns](https://nextjs.org/docs/authentication)
