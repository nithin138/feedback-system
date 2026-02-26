import React, { useState, useEffect } from 'react';
import PostComposer from '../components/PostComposer';
import FeedPost from '../components/FeedPost';
import FilterBar from '../components/FilterBar';
import LeftSidebar from '../components/LeftSidebar';
import RightSidebar from '../components/RightSidebar';
import api from '../utils/api';

const FeedPage = ({ showComposer: externalShowComposer, onCloseComposer }) => {
  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState({ category: 'all', sort: 'recent' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showComposer, setShowComposer] = useState(false);

  useEffect(() => {
    if (externalShowComposer) {
      setShowComposer(true);
    }
  }, [externalShowComposer]);

  const handleCloseComposer = () => {
    setShowComposer(false);
    if (onCloseComposer) {
      onCloseComposer();
    }
  };

  useEffect(() => {
    fetchFeed();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const fetchFeed = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        category: filter.category,
        sort: filter.sort,
        limit: 20,
        skip: 0
      };

      const response = await api.get('/api/feedback', { params });

      if (response.data.success) {
        setPosts(response.data.data.feedbacks);
      }
    } catch (err) {
      console.error('Error fetching feed:', err);
      setError(err.response?.data?.error?.message || 'Failed to load feed');
    } finally {
      setLoading(false);
    }
  };

  const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  const handlePostFlagged = (postId) => {
    setPosts(posts.filter(p => p._id !== postId));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Three Column Layout */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          <LeftSidebar posts={posts} />

          {/* Center - Feed */}
          <main className="flex-1 min-w-0">
            <FilterBar filter={filter} onFilterChange={handleFilterChange} />

            {error && (
              <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-red-800 dark:text-red-200">{error}</p>
                <button
                  onClick={fetchFeed}
                  className="mt-2 text-sm text-red-600 dark:text-red-400 hover:underline"
                >
                  Try again
                </button>
              </div>
            )}

            <div className="mt-4 space-y-4">
              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                </div>
              ) : posts.length > 0 ? (
                posts.map((post) => (
                  <FeedPost key={post._id} post={post} onPostFlagged={handlePostFlagged} />
                ))
              ) : (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">No posts yet</h3>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Be the first to share feedback!
                  </p>
                  <button
                    onClick={() => setShowComposer(true)}
                    className="mt-4 px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors"
                  >
                    Create Post
                  </button>
                </div>
              )}
            </div>
          </main>

          <RightSidebar />
        </div>
      </div>

      {/* Post Composer Modal */}
      <PostComposer
        isOpen={showComposer}
        onClose={handleCloseComposer}
        onPostCreated={handlePostCreated}
      />
    </div>
  );
};

export default FeedPage;
