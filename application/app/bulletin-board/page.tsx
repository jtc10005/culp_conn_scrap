'use client';

import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/lib/auth';
import AuthModal from '@/components/AuthModal';
import { getSupabaseClient } from '@/lib';
import Link from 'next/link';
import type { LoginMethodsConfig } from '@/lib/featureFlags';

interface Post {
  id: string;
  title: string;
  content: string;
  author_name: string;
  author_avatar: string | null;
  category: string | null;
  comment_count: number;
  like_count: number;
  view_count: number;
  created_at: string;
  is_pinned: boolean;
}

export default function BulletinBoardPage() {
  const { user, loading: authLoading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [loginMethods, setLoginMethods] = useState<LoginMethodsConfig>({
    facebook: false,
    X: false,
    google: false,
    apple: false,
  });
  const [newPostCategory, setNewPostCategory] = useState('question');
  const supabase = useMemo(() => getSupabaseClient(), []);

  const loadPosts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('bulletin_posts_with_details')
      .select('*')
      .order('is_pinned', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading posts:', error);
    } else {
      setPosts(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Fetch login methods config from API
    fetch('/api/login-methods')
      .then((res) => res.json())
      .then((data) => setLoginMethods(data))
      .catch((error) => console.error('Error fetching login methods:', error));
  }, []);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    const { error } = await supabase.from('bulletin_posts').insert({
      author_id: user.id,
      title: newPostTitle,
      content: newPostContent,
      category: newPostCategory,
    });

    if (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post');
    } else {
      setNewPostTitle('');
      setNewPostContent('');
      setShowNewPostForm(false);
      loadPosts();
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const getCategoryColor = (category: string | null) => {
    switch (category) {
      case 'question':
        return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200';
      case 'announcement':
        return 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200';
      case 'discussion':
        return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen theme-bg-primary">
        <div className="text-xl theme-text-primary">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen theme-bg-primary">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2 theme-text-primary">Bulletin Board</h1>
            <p className="theme-text-secondary">
              Ask questions, share stories, and connect with the Culpepper family community
            </p>
          </div>
          {user ? (
            <button
              onClick={() => setShowNewPostForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg"
            >
              + New Post
            </button>
          ) : (
            <button
              onClick={() => setShowAuthModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg"
            >
              Sign In to Post
            </button>
          )}
        </div>

        {/* New Post Form */}
        {showNewPostForm && (
          <div className="theme-bg-secondary rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4 theme-text-primary">Create New Post</h2>
            <form onSubmit={handleCreatePost} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 theme-text-primary">
                  Category
                </label>
                <select
                  value={newPostCategory}
                  onChange={(e) => setNewPostCategory(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 theme-bg-tertiary theme-border theme-text-primary"
                >
                  <option value="question">Question</option>
                  <option value="discussion">Discussion</option>
                  <option value="announcement">Announcement</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 theme-text-primary">Title</label>
                <input
                  type="text"
                  required
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 theme-bg-tertiary theme-border theme-text-primary"
                  placeholder="What's your question or topic?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 theme-text-primary">Content</label>
                <textarea
                  required
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  rows={6}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 theme-bg-tertiary theme-border theme-text-primary"
                  placeholder="Share more details..."
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg"
                >
                  Post
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowNewPostForm(false);
                    setNewPostTitle('');
                    setNewPostContent('');
                  }}
                  className="theme-bg-tertiary hover:opacity-80 font-medium px-6 py-2 rounded-lg theme-text-primary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Posts List */}
        <div className="space-y-4">
          {posts.length === 0 ? (
            <div className="theme-bg-secondary rounded-lg shadow p-8 text-center">
              <p className="theme-text-secondary text-lg">
                No posts yet. Be the first to start a conversation!
              </p>
            </div>
          ) : (
            posts.map((post) => (
              <Link
                key={post.id}
                href={`/bulletin-board/${post.id}`}
                className="block theme-bg-secondary rounded-lg shadow hover:shadow-lg transition-shadow p-6"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {post.is_pinned && (
                        <span className="text-yellow-500" title="Pinned">
                          📌
                        </span>
                      )}
                      {post.category && (
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(post.category)}`}
                        >
                          {post.category}
                        </span>
                      )}
                    </div>
                    <h2 className="text-xl font-bold mb-2 hover:text-blue-600 theme-text-primary">
                      {post.title}
                    </h2>
                    <p className="theme-text-secondary line-clamp-2">{post.content}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm theme-text-secondary">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      {post.author_name || 'Anonymous'}
                    </span>
                    <span>•</span>
                    <span>{formatDate(post.created_at)}</span>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">💬 {post.comment_count}</span>
                    <span className="flex items-center gap-1">👁️ {post.view_count}</span>
                    <span className="flex items-center gap-1">👍 {post.like_count}</span>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>

        {showAuthModal && (
          <AuthModal onClose={() => setShowAuthModal(false)} loginMethods={loginMethods} />
        )}
      </div>
    </div>
  );
}
