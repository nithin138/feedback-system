import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const FacultyAnalyticsPage = () => {
  const [analytics, setAnalytics] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchAnalytics();
    fetchFeedbacks();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await api.get('/api/analytics/faculty');
      setAnalytics(response.data.data);
    } catch (err) {
      console.error('Error fetching analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFeedbacks = async () => {
    try {
      const response = await api.get('/api/feedback', {
        params: { category: 'faculty', limit: 50 }
      });
      setFeedbacks(response.data.data);
    } catch (err) {
      console.error('Error fetching feedbacks:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const { overview, ratingDistribution, categoryRatings, recentFeedbacks } = analytics || {};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Faculty Analytics</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Your performance metrics and feedback overview
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="flex gap-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'overview'
                ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('feedbacks')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'feedbacks'
                ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Feedbacks
          </button>
        </nav>
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Feedbacks</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {overview?.totalFeedbacks || 0}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Last {overview?.period || '30 days'}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Average Rating</p>
              <div className="flex items-center gap-2 mt-2">
                <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                  {overview?.averageRating || 'N/A'}
                </p>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.round(parseFloat(overview?.averageRating || 0))
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
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Rating Trend</p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">
                {ratingDistribution?.[5] > ratingDistribution?.[1] ? '↑' : '→'} Good
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {ratingDistribution?.[5] || 0} excellent ratings
              </p>
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Rating Distribution
            </h2>
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center gap-4">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 w-12">
                    {rating} stars
                  </span>
                  <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div
                      className="bg-primary-600 h-3 rounded-full"
                      style={{
                        width: `${
                          overview?.totalFeedbacks > 0
                            ? ((ratingDistribution?.[rating] || 0) / overview.totalFeedbacks) * 100
                            : 0
                        }%`
                      }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400 w-12 text-right">
                    {ratingDistribution?.[rating] || 0}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Category Ratings */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Performance by Category
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(categoryRatings || {}).map(([category, data]) => (
                <div
                  key={category}
                  className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {category}
                    </span>
                    <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
                      {data.average.toFixed(1)}/5
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Based on {data.count} ratings
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Feedbacks */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Recent Feedbacks
            </h2>
            <div className="space-y-4">
              {recentFeedbacks?.map((feedback) => (
                <div
                  key={feedback.id}
                  className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                >
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-sm text-gray-900 dark:text-white flex-1">
                      {feedback.content}
                    </p>
                    <span className="text-sm font-semibold text-primary-600 dark:text-primary-400 ml-4">
                      {feedback.rating}/5
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(feedback.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'feedbacks' && (
        <div className="space-y-4">
          {feedbacks.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
              <p className="text-gray-500 dark:text-gray-400">No feedbacks yet</p>
            </div>
          ) : (
            feedbacks.map((feedback) => (
              <div
                key={feedback._id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {feedback.authorDisplay}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(feedback.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
                    {feedback.averageRating}/5
                  </span>
                </div>
                <p className="text-gray-900 dark:text-white mb-4">{feedback.content}</p>
                {feedback.ratings && feedback.ratings.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {feedback.ratings.map((rating, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full"
                      >
                        {rating.categoryName}: {rating.value}/5
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default FacultyAnalyticsPage;
