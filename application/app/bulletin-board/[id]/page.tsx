'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { getSupabaseClient } from '@/lib';
import { useAuth } from '@/lib/auth';
import AuthModal from '@/components/AuthModal';
import Link from 'next/link';
import type { LoginMethodsConfig } from '@/lib/featureFlags';

interface Post {
  id: string;
  title: string;
  content: string;
  author_id: string;
  author_name: string;
  author_avatar: string | null;
  category: string | null;
  tags: string[] | null;
  is_pinned: boolean;
  view_count: number;
  comment_count: number;
  like_count: number;
  created_at: string;
  updated_at: string;
}

interface Comment {
  id: string;
  post_id: string;
  author_id: string;
  author_name: string;
  author_avatar: string | null;
  parent_comment_id: string | null;
  content: string;
  like_count: number;
  created_at: string;
  updated_at: string;
}

export default function PostDetailPage() {
  const params = useParams();
  const postId = params.id as string;
  const { user } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [loginMethods, setLoginMethods] = useState<LoginMethodsConfig>({
    facebook: false,
    X: false,
    google: false,
    apple: false,
  });
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editTags, setEditTags] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editCommentContent, setEditCommentContent] = useState('');
  const supabase = useMemo(() => getSupabaseClient(), []);

  useEffect(() => {
    if (!postId) return;

    const loadPost = async () => {
      setLoading(true);
      setError(null);

      try {
        // Increment view count
        await supabase.rpc('increment_post_views', { post_uuid: postId });

        // Fetch post details
        const { data, error: fetchError } = await supabase
          .from('bulletin_posts_with_details')
          .select('*')
          .eq('id', postId)
          .single();

        if (fetchError) {
          console.error('Error loading post:', fetchError);
          setError('Post not found');
        } else {
          setPost(data);
        }

        // Fetch comments
        const { data: commentsData, error: commentsError } = await supabase
          .from('bulletin_comments_with_details')
          .select('*')
          .eq('post_id', postId)
          .order('created_at', { ascending: true });

        if (commentsError) {
          console.error('Error loading comments:', commentsError);
        } else {
          setComments(commentsData || []);
        }
      } catch (err) {
        console.error('Error:', err);
        setError('Failed to load post');
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [postId, supabase]);

  useEffect(() => {
    // Fetch login methods config from API
    fetch('/api/login-methods')
      .then((res) => res.json())
      .then((data) => setLoginMethods(data))
      .catch((error) => console.error('Error fetching login methods:', error));
  }, []);

  useEffect(() => {
    if (post && editing) {
      setEditTitle(post.title);
      setEditContent(post.content);
      setEditTags(post.tags ? post.tags.join(', ') : '');
    }
  }, [post, editing]);

  const handleAddComment = async (parentCommentId: string | null = null) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    if (!newComment.trim()) return;

    const { error: insertError } = await supabase.from('bulletin_comments').insert({
      post_id: postId,
      author_id: user.id,
      content: newComment,
      parent_comment_id: parentCommentId,
    });

    if (insertError) {
      console.error('Error adding comment:', insertError);
      alert('Failed to add comment');
    } else {
      setNewComment('');
      setReplyingTo(null);

      // Reload comments
      const { data: commentsData } = await supabase
        .from('bulletin_comments_with_details')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (commentsData) {
        setComments(commentsData);
      }

      // Reload post to update comment count
      const { data: postData } = await supabase
        .from('bulletin_posts_with_details')
        .select('*')
        .eq('id', postId)
        .single();

      if (postData) {
        setPost(postData);
      }
    }
  };

  const handleEditPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !post) return;
    const tagsArray = editTags
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);
    const { error } = await supabase
      .from('bulletin_posts')
      .update({
        title: editTitle,
        content: editContent,
        tags: tagsArray.length > 0 ? tagsArray : null,
      })
      .eq('id', post.id);
    if (error) {
      alert('Failed to update post');
    } else {
      setEditing(false);
      // Reload post
      const { data: postData } = await supabase
        .from('bulletin_posts_with_details')
        .select('*')
        .eq('id', post.id)
        .single();
      if (postData) setPost(postData);
    }
  };

  const handleLikePost = async () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    // Try to insert like
    const { error } = await supabase.from('bulletin_post_likes').insert({
      post_id: postId,
      user_id: user.id,
    });

    if (error) {
      // Might already be liked, try to unlike
      await supabase
        .from('bulletin_post_likes')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', user.id);
    }

    // Reload post to update like count
    const { data: postData } = await supabase
      .from('bulletin_posts_with_details')
      .select('*')
      .eq('id', postId)
      .single();

    if (postData) {
      setPost(postData);
    }
  };

  const handleLikeComment = async (commentId: string) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    // Try to insert like
    const { error } = await supabase.from('bulletin_comment_likes').insert({
      comment_id: commentId,
      user_id: user.id,
    });

    if (error) {
      // Might already be liked, try to unlike
      await supabase
        .from('bulletin_comment_likes')
        .delete()
        .eq('comment_id', commentId)
        .eq('user_id', user.id);
    }

    // Reload comments to update like counts
    const { data: commentsData } = await supabase
      .from('bulletin_comments_with_details')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: true });

    if (commentsData) {
      setComments(commentsData);
    }
  };
  const handleDeleteComment = async (commentId: string) => {
    if (!user) return;
    if (!window.confirm('Are you sure you want to delete this comment?')) return;
    const { error } = await supabase
      .from('bulletin_comments')
      .delete()
      .eq('id', commentId)
      .eq('author_id', user.id);
    if (!error) {
      // Reload comments
      const { data: commentsData } = await supabase
        .from('bulletin_comments_with_details')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: true });
      if (commentsData) setComments(commentsData);
    } else {
      alert('Failed to delete comment');
    }
  };
  const handleEditComment = async (commentId: string) => {
    if (!user) return;
    const { error } = await supabase
      .from('bulletin_comments')
      .update({ content: editCommentContent })
      .eq('id', commentId)
      .eq('author_id', user.id);
    if (!error) {
      setEditingCommentId(null);
      setEditCommentContent('');
      // Reload comments
      const { data: commentsData } = await supabase
        .from('bulletin_comments_with_details')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: true });
      if (commentsData) setComments(commentsData);
    } else {
      alert('Failed to update comment');
    }
  };
  const organizeComments = () => {
    const parentComments = comments.filter((c) => !c.parent_comment_id);
    const repliesMap = new Map<string, Comment[]>();

    comments.forEach((comment) => {
      if (comment.parent_comment_id) {
        const replies = repliesMap.get(comment.parent_comment_id) || [];
        replies.push(comment);
        repliesMap.set(comment.parent_comment_id, replies);
      }
    });

    return { parentComments, repliesMap };
  };

  const { parentComments, repliesMap } = organizeComments();

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

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'announcement':
        return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200';
      case 'question':
        return 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200';
      case 'discussion':
        return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen theme-bg-primary">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-xl theme-text-primary">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen theme-bg-primary">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="theme-bg-secondary rounded-lg shadow p-8 text-center">
            <h1 className="text-2xl font-bold theme-text-primary mb-4">Post Not Found</h1>
            <p className="theme-text-secondary mb-6">
              {error || "The post you're looking for doesn't exist or has been removed."}
            </p>
            <Link
              href="/bulletin-board"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg"
            >
              Back to Bulletin Board
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen theme-bg-primary">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back button */}
        <Link
          href="/bulletin-board"
          className="inline-flex items-center theme-text-secondary hover:theme-text-primary mb-6"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Bulletin Board
        </Link>

        {/* Post Card */}
        <article className="theme-bg-secondary rounded-lg shadow-lg p-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
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
              <h1 className="text-3xl font-bold theme-text-primary mb-4">{post.title}</h1>
            </div>
          </div>

          {/* Author and date */}
          <div className="flex items-center gap-4 mb-6 pb-6 border-b theme-border">
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 theme-text-secondary"
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
              <span className="font-medium theme-text-primary">
                {post.author_name || 'Anonymous'}
              </span>
            </div>
            <span className="theme-text-secondary">•</span>
            <span className="theme-text-secondary">{formatDate(post.created_at)}</span>
          </div>

          {/* Content */}
          {editing ? (
            <form onSubmit={handleEditPost} className="mb-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 theme-text-primary">Title</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 theme-bg-tertiary theme-border theme-text-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 theme-text-primary">Content</label>
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  rows={6}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 theme-bg-tertiary theme-border theme-text-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 theme-text-primary">Tags</label>
                <input
                  type="text"
                  value={editTags}
                  onChange={(e) => setEditTags(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 theme-bg-tertiary theme-border theme-text-primary"
                  placeholder="Comma-separated, e.g. genealogy, DNA, reunion"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="theme-bg-tertiary hover:opacity-80 font-medium px-6 py-2 rounded-lg theme-text-primary"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="prose prose-lg max-w-none theme-text-primary mb-6">
              <p className="whitespace-pre-wrap">{post.content}</p>
            </div>
          )}

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="text-xs px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700 theme-text-secondary"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Stats */}
          <div className="flex items-center gap-6 text-sm theme-text-secondary pt-6 border-t theme-border">
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              {post.view_count} views
            </span>
            <span className="flex items-center gap-2">💬 {post.comment_count} comments</span>
            <button
              onClick={handleLikePost}
              className="flex items-center gap-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              👍 {post.like_count} likes
            </button>
          </div>

          {/* Edit Button (only for author) */}
          {user && post && user.id === post.author_id && !editing && (
            <button
              onClick={() => setEditing(true)}
              className="mb-4 bg-yellow-500 hover:bg-yellow-600 text-white font-medium px-4 py-2 rounded-lg"
            >
              Edit Post
            </button>
          )}
        </article>

        {/* Comments Section */}
        <div className="mt-8 theme-bg-secondary rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold theme-text-primary mb-6">
            Comments ({comments.length})
          </h2>

          {/* Add Comment Form */}
          {user ? (
            <div className="mb-8">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border theme-border rounded-lg focus:ring-2 focus:ring-blue-500 theme-bg-tertiary theme-text-primary"
                placeholder="Write a comment..."
              />
              <div className="flex gap-3 mt-3">
                <button
                  onClick={() => handleAddComment()}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg"
                >
                  Post Comment
                </button>
              </div>
            </div>
          ) : (
            <div className="mb-8 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg text-center">
              <p className="theme-text-secondary mb-3">Sign in to join the conversation</p>
              <button
                onClick={() => setShowAuthModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg"
              >
                Sign In
              </button>
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-6">
            {parentComments.length === 0 ? (
              <p className="theme-text-secondary text-center py-8">
                No comments yet. Be the first to comment!
              </p>
            ) : (
              parentComments.map((comment) => (
                <div key={comment.id} className="space-y-4">
                  {/* Parent Comment */}
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="font-medium theme-text-primary">
                          {comment.author_name || 'Anonymous'}
                        </span>
                        <span className="text-sm theme-text-secondary">
                          {formatDate(comment.created_at)}
                        </span>
                      </div>
                    </div>
                    <p className="theme-text-primary whitespace-pre-wrap mb-3">{comment.content}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <button
                        onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        Reply
                      </button>
                      <button
                        onClick={() => handleLikeComment(comment.id)}
                        className="flex items-center gap-1 theme-text-secondary hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        👍 {comment.like_count}
                      </button>
                      {user && comment.author_id === user.id && (
                        <>
                          {editingCommentId === comment.id ? (
                            <>
                              <button
                                onClick={() => handleEditComment(comment.id)}
                                className="text-green-600 dark:text-green-400 hover:underline"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => {
                                  setEditingCommentId(null);
                                  setEditCommentContent('');
                                }}
                                className="text-gray-600 dark:text-gray-400 hover:underline"
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => {
                                  setEditingCommentId(comment.id);
                                  setEditCommentContent(comment.content);
                                }}
                                className="text-yellow-600 dark:text-yellow-400 hover:underline"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteComment(comment.id)}
                                className="text-red-600 dark:text-red-400 hover:underline"
                              >
                                Delete
                              </button>
                            </>
                          )}
                        </>
                      )}
                    </div>
                    {editingCommentId === comment.id && (
                      <textarea
                        value={editCommentContent}
                        onChange={(e) => setEditCommentContent(e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2 border theme-border rounded-lg focus:ring-2 focus:ring-blue-500 theme-bg-tertiary theme-text-primary mt-2"
                      />
                    )}
                  </div>

                  {/* Replies */}
                  {repliesMap.get(comment.id)?.map((reply) => (
                    <div
                      key={reply.id}
                      className="ml-8 bg-gray-100 dark:bg-gray-700/30 rounded-lg p-4"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <span className="font-medium theme-text-primary">
                            {reply.author_name || 'Anonymous'}
                          </span>
                          <span className="text-sm theme-text-secondary">
                            {formatDate(reply.created_at)}
                          </span>
                        </div>
                      </div>
                      <p className="theme-text-primary whitespace-pre-wrap mb-2">{reply.content}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <button
                          onClick={() => handleLikeComment(reply.id)}
                          className="flex items-center gap-1 theme-text-secondary hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                          👍 {reply.like_count}
                        </button>
                        {user && reply.author_id === user.id && (
                          <>
                            {editingCommentId === reply.id ? (
                              <>
                                <button
                                  onClick={() => handleEditComment(reply.id)}
                                  className="text-green-600 dark:text-green-400 hover:underline"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={() => {
                                    setEditingCommentId(null);
                                    setEditCommentContent('');
                                  }}
                                  className="text-gray-600 dark:text-gray-400 hover:underline"
                                >
                                  Cancel
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => {
                                    setEditingCommentId(reply.id);
                                    setEditCommentContent(reply.content);
                                  }}
                                  className="text-yellow-600 dark:text-yellow-400 hover:underline"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteComment(reply.id)}
                                  className="text-red-600 dark:text-red-400 hover:underline"
                                >
                                  Delete
                                </button>
                              </>
                            )}
                          </>
                        )}
                      </div>
                      {editingCommentId === reply.id && (
                        <textarea
                          value={editCommentContent}
                          onChange={(e) => setEditCommentContent(e.target.value)}
                          rows={2}
                          className="w-full px-3 py-2 border theme-border rounded-lg focus:ring-2 focus:ring-blue-500 theme-bg-tertiary theme-text-primary mt-2"
                        />
                      )}
                    </div>
                  ))}
                </div>
              ))
            )}
          </div>
        </div>

        {showAuthModal && (
          <AuthModal onClose={() => setShowAuthModal(false)} loginMethods={loginMethods} />
        )}
      </div>
    </div>
  );
}
