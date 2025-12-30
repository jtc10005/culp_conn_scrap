-- Reset Bulletin Board Tables
-- This script clears all data from bulletin board tables while preserving the table structure
-- Run this in your Supabase SQL Editor to reset the bulletin board to a clean state

-- WARNING: This will delete ALL bulletin board data including posts, comments, and likes
-- This action cannot be undone!

-- Disable triggers temporarily to avoid constraint issues
SET session_replication_role = 'replica';

-- Delete all comment likes
DELETE FROM public.bulletin_comment_likes;

-- Delete all post likes
DELETE FROM public.bulletin_post_likes;

-- Delete all comments (including replies due to CASCADE)
DELETE FROM public.bulletin_comments;

-- Delete all posts
DELETE FROM public.bulletin_posts;

-- Optional: Reset user profiles if you want to clear those too
-- Uncomment the line below if you want to reset user profiles as well
-- DELETE FROM public.user_profiles;

-- Re-enable triggers
SET session_replication_role = 'origin';

-- Verify deletion
SELECT 
  'bulletin_posts' as table_name, 
  COUNT(*) as remaining_records 
FROM public.bulletin_posts
UNION ALL
SELECT 
  'bulletin_comments' as table_name, 
  COUNT(*) as remaining_records 
FROM public.bulletin_comments
UNION ALL
SELECT 
  'bulletin_post_likes' as table_name, 
  COUNT(*) as remaining_records 
FROM public.bulletin_post_likes
UNION ALL
SELECT 
  'bulletin_comment_likes' as table_name, 
  COUNT(*) as remaining_records 
FROM public.bulletin_comment_likes
UNION ALL
SELECT 
  'user_profiles' as table_name, 
  COUNT(*) as remaining_records 
FROM public.user_profiles;

-- Success message
SELECT 'Bulletin board tables have been reset successfully!' as status;
