import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const PostComposer = ({ onPostCreated, isOpen, onClose }) => {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('general');
  const [ratings, setRatings] = useState([
    { categoryName: 'Overall Quality', value: 5 }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim()) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await api.post('/api/feedback', {
        content: content.trim(),
        category,
        ratings
      });

      if (response.data.success) {
        onPostCreated(response.data.data.feedback);
        setContent('');
        setCategory('general');
        setRatings([{ categoryName: 'Overall Quality', value: 5 }]);
        onClose();
      }
    } catch (err) {
      console.error('Error creating post:', err);
      setError(err.response?.data?.error?.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  const handleRatingChange = (index, value) => {
    const newRatings = [...ratings];
    newRatings[index].value = parseInt(value);
    setRatings(newRatings);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Create Post
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
            </div>
          )}

          {/* Content */}
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind? Share your feedback..."
            maxLength={500}
            rows={6}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none"
          />
          <div className="text-right text-sm text-gray-500 dark:text-gray-400 mt-1">
            {content.length}/500
          </div>

          {/* Category */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="general">General</option>
              <option value="faculty">Faculty</option>
              <option value="course">Course</option>
              <option value="facility">Facility</option>
            </select>
          </div>

          {/* Ratings */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-3">
              Rating
            </label>
            {ratings.map((rating, index) => (
              <div key={index} className="flex items-center gap-4 mb-2">
                <span className="text-sm text-gray-700 dark:text-gray-200 flex-1">
                  {rating.categoryName}
                </span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleRatingChange(index, star)}
                      className="focus:outline-none transition-transform hover:scale-110"
                    >
                      <svg
                        className={`w-7 h-7 ${
                          star <= rating.value
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
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !content.trim()}
              className="flex-1 px-6 py-3 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Posting...' : 'Post Feedback'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostComposer;
