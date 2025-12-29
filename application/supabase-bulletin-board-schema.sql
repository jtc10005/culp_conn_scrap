-- Bulletin Board Schema for Supabase
-- Users table extends Supabase auth.users with profile info

-- User profiles (extends auth.users)
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bulletin board posts/questions
CREATE TABLE IF NOT EXISTS public.bulletin_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT, -- e.g., 'question', 'announcement', 'discussion'
  tags TEXT[], -- Array of tags for filtering
  is_pinned BOOLEAN DEFAULT FALSE,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Comments/replies on posts
CREATE TABLE IF NOT EXISTS public.bulletin_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES public.bulletin_posts(id) ON DELETE CASCADE NOT NULL,
  author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  parent_comment_id UUID REFERENCES public.bulletin_comments(id) ON DELETE CASCADE, -- For nested replies
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Post likes/reactions
CREATE TABLE IF NOT EXISTS public.bulletin_post_likes (
  post_id UUID REFERENCES public.bulletin_posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (post_id, user_id)
);

-- Comment likes
CREATE TABLE IF NOT EXISTS public.bulletin_comment_likes (
  comment_id UUID REFERENCES public.bulletin_comments(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (comment_id, user_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_bulletin_posts_author ON public.bulletin_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_bulletin_posts_created ON public.bulletin_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bulletin_posts_category ON public.bulletin_posts(category);
CREATE INDEX IF NOT EXISTS idx_bulletin_comments_post ON public.bulletin_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_bulletin_comments_author ON public.bulletin_comments(author_id);
CREATE INDEX IF NOT EXISTS idx_bulletin_comments_parent ON public.bulletin_comments(parent_comment_id);

-- Row Level Security (RLS) Policies

-- Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bulletin_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bulletin_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bulletin_post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bulletin_comment_likes ENABLE ROW LEVEL SECURITY;

-- User Profiles: Anyone can read, users can update their own
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.user_profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON public.user_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.user_profiles FOR UPDATE
  USING (auth.uid() = id);

-- Bulletin Posts: Anyone can read, authenticated users can create
CREATE POLICY "Posts are viewable by everyone"
  ON public.bulletin_posts FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create posts"
  ON public.bulletin_posts FOR INSERT
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own posts"
  ON public.bulletin_posts FOR UPDATE
  USING (auth.uid() = author_id);

CREATE POLICY "Users can delete their own posts"
  ON public.bulletin_posts FOR DELETE
  USING (auth.uid() = author_id);

-- Comments: Anyone can read, authenticated users can create
CREATE POLICY "Comments are viewable by everyone"
  ON public.bulletin_comments FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create comments"
  ON public.bulletin_comments FOR INSERT
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own comments"
  ON public.bulletin_comments FOR UPDATE
  USING (auth.uid() = author_id);

CREATE POLICY "Users can delete their own comments"
  ON public.bulletin_comments FOR DELETE
  USING (auth.uid() = author_id);

-- Post Likes: Anyone can read, authenticated users can like
CREATE POLICY "Post likes are viewable by everyone"
  ON public.bulletin_post_likes FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can like posts"
  ON public.bulletin_post_likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike posts"
  ON public.bulletin_post_likes FOR DELETE
  USING (auth.uid() = user_id);

-- Comment Likes: Anyone can read, authenticated users can like
CREATE POLICY "Comment likes are viewable by everyone"
  ON public.bulletin_comment_likes FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can like comments"
  ON public.bulletin_comment_likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike comments"
  ON public.bulletin_comment_likes FOR DELETE
  USING (auth.uid() = user_id);

-- Views for easier querying

-- Posts with author info and counts
CREATE OR REPLACE VIEW public.bulletin_posts_with_details AS
SELECT 
  p.*,
  up.display_name AS author_name,
  up.avatar_url AS author_avatar,
  (SELECT COUNT(*) FROM public.bulletin_comments WHERE post_id = p.id) AS comment_count,
  (SELECT COUNT(*) FROM public.bulletin_post_likes WHERE post_id = p.id) AS like_count
FROM public.bulletin_posts p
LEFT JOIN public.user_profiles up ON p.author_id = up.id
ORDER BY p.is_pinned DESC, p.created_at DESC;

-- Comments with author info
CREATE OR REPLACE VIEW public.bulletin_comments_with_details AS
SELECT 
  c.*,
  up.display_name AS author_name,
  up.avatar_url AS author_avatar,
  (SELECT COUNT(*) FROM public.bulletin_comment_likes WHERE comment_id = c.id) AS like_count
FROM public.bulletin_comments c
LEFT JOIN public.user_profiles up ON c.author_id = up.id
ORDER BY c.created_at ASC;

-- Function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Function to update post view count
CREATE OR REPLACE FUNCTION public.increment_post_views(post_uuid UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.bulletin_posts
  SET view_count = view_count + 1
  WHERE id = post_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
