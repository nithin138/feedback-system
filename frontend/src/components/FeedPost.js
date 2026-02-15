import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const FeedPost = ({ post, onPostFlagged }) => {
  const { user, isFaculty, isAdmin } = useAuth();
  const [liked, setLiked] = useState(post.userLiked || false);
  const [likeCount, setLikeCount] = useState(post.likeCount);
  const [showComments, setShowComments] = useState(false);
  const [showFlagModal, setShowFlagModal] = useState(false);
  const [flagReason, setFlagReason] = useState('');
  const [flagging, setFlagging] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);
  const [addingComment, setAddingComment] = useState(false);
  const [commentCount, setCommentCount] = useState(post.commentCount);

  // Fetch comments when showComments is toggled
  useEffect(() => {
    if (showComments && comments.length === 0) {
      fetchComments();
    }
  }, [showComments]);

  const fetchComments = async () => {
    try {
      setLoadingComments(true);
      const response = await api.get(`/api/feedback/${post._id}/comments`);
      
      if (response.data.success) {
        setComments(response.data.data.comments);
      }
    } catch (err) {
      console.error('Error fetching comments:', err);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleLike = async () => {
    try {
      if (liked) {
        // Unlike
        await api.delete(`/api/feedback/${post._id}/like`);
        setLikeCount(likeCount - 1);
        setLiked(false);
      } else {
        // Like
        await api.post(`/api/feedback/${post._id}/like`);
        setLikeCount(likeCount + 1);
        setLiked(true);
      }
    } catch (err) {
      console.error('Error toggling like:', err);
      // Revert on error
      if (err.response?.data?.error?.code === 'ALREADY_LIKED') {
        setLiked(true);
      } else if (err.response?.data?.error?.code === 'NOT_LIKED') {
        setLiked(false);
      }
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    
    if (!newComment.trim()) {
      return;
    }

    try {
      setAddingComment(true);
      const response = await api.post(`/api/feedback/${post._id}/comment`, {
        content: newComment.trim()
      });

      if (response.data.success) {
        setComments([...comments, response.data.data.comment]);
        setCommentCount(response.data.data.commentCount);
        setNewComment('');
      }
    } catch (err) {
      console.error('Error adding comment:', err);
      alert(err.response?.data?.error?.message || 'Failed to add comment');
    } finally {
      setAddingComment(false);
    }
  };

  const handleFlag = async () => {
    if (!flagReason.trim()) {
      alert('Please provide a reason for flagging this post');
      return;
    }

    try {
      setFlagging(true);
      const response = await api.post(`/api/feedback/${post._id}/flag`, {
        reason: flagReason.trim()
      });

      if (response.data.success) {
        alert('Post flagged successfully and hidden from feed');
        setShowFlagModal(false);
        setFlagReason('');
        
        // Notify parent component to remove post from feed
        if (onPostFlagged) {
          onPostFlagged(post._id);
        }
      }
    } catch (err) {
      console.error('Error flagging post:', err);
      alert(err.response?.data?.error?.message || 'Failed to flag post');
    } finally {
      setFlagging(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    
    return date.toLocaleDateString();
  };

  const getCategoryColor = (category) => {
    const colors = {
      general: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
      faculty: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200',
      course: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200',
      facility: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-200'
    };
    return colors[category] || colors.general;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center">
            <svg className="w-6 h-6 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white">
              {post.authorDisplay}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {formatDate(post.createdAt)}
            </p>
          </div>
        </div>

        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(post.category)}`}>
          {post.category.charAt(0).toUpperCase() + post.category.slice(1)}
        </span>
      </div>

      {/* Content */}
      <p className="text-gray-900 dark:text-white mb-4">
        {post.content}
      </p>

      {/* Ratings */}
      {post.ratings && post.ratings.length > 0 && (
        <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
              {post.averageRating}
            </span>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.round(parseFloat(post.averageRating))
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300 dark:text-gray-600'
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
              ))}
            </div>
          </div>
          <div className="space-y-1">
            {post.ratings.map((rating, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">{rating.categoryName}</span>
                <span className="font-medium text-gray-900 dark:text-white">{rating.value}/5</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={handleLike}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
        >
          <svg
            className={`w-5 h-5 ${liked ? 'fill-current text-red-500' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          <span className="text-sm font-medium">{likeCount}</span>
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <span className="text-sm font-medium">{commentCount}</span>
        </button>

        {(isFaculty || isAdmin) && (
          <button 
            onClick={() => setShowFlagModal(true)}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors ml-auto"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"
              />
            </svg>
            <span className="text-sm font-medium">Flag</span>
          </button>
        )}
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          {/* Add Comment Form */}
          <form onSubmit={handleAddComment} className="mb-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                disabled={addingComment}
              />
              <button
                type="submit"
                disabled={addingComment || !newComment.trim()}
                className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {addingComment ? 'Posting...' : 'Post'}
              </button>
            </div>
          </form>

          {/* Comments List */}
          {loadingComments ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
            </div>
          ) : comments.length > 0 ? (
            <div className="space-y-3">
              {comments.map((comment) => (
                <div key={comment._id} className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg px-3 py-2">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {comment.authorDisplay}
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                        {comment.content}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 ml-3">
                      {formatDate(comment.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
              No comments yet. Be the first to comment!
            </p>
          )}
        </div>
      )}

      {/* Flag Modal */}
      {showFlagModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Flag Post
              </h3>
              <button
                onClick={() => {
                  setShowFlagModal(false);
                  setFlagReason('');
                }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Please provide a reason for flagging this post. The post will be hidden from the feed and sent to administrators for review.
            </p>

            <textarea
              value={flagReason}
              onChange={(e) => setFlagReason(e.target.value)}
              placeholder="Enter reason for flagging..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
              rows="4"
              disabled={flagging}
            />

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => {
                  setShowFlagModal(false);
                  setFlagReason('');
                }}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                disabled={flagging}
              >
                Cancel
              </button>
              <button
                onClick={handleFlag}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={flagging || !flagReason.trim()}
              >
                {flagging ? 'Flagging...' : 'Flag Post'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedPost;
