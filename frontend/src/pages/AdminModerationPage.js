import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const AdminModerationPage = () => {
  const [flaggedPosts, setFlaggedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchFlaggedPosts();
  }, []);

  const fetchFlaggedPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/api/admin/flags');
      
      if (response.data.success) {
        setFlaggedPosts(response.data.data.flags);
      }
    } catch (err) {
      console.error('Error fetching flagged posts:', err);
      setError(err.response?.data?.error?.message || 'Failed to fetch flagged posts');
    } finally {
      setLoading(false);
    }
  };

  const handleDismiss = async (id) => {
    try {
      setActionLoading(id);
      const response = await api.put(`/api/admin/flags/${id}/dismiss`);
      
      if (response.data.success) {
        setFlaggedPosts(flaggedPosts.filter(p => p._id !== id));
      }
    } catch (err) {
      console.error('Error dismissing flag:', err);
      alert(err.response?.data?.error?.message || 'Failed to dismiss flag');
    } finally {
      setActionLoading(null);
    }
  };

  const handleSuspend = async (id) => {
    const days = prompt('Enter suspension duration in days:', '7');
    if (!days) return;

    try {
      setActionLoading(id);
      const response = await api.put(`/api/admin/flags/${id}/suspend`, {
        days: parseInt(days)
      });
      
      if (response.data.success) {
        setFlaggedPosts(flaggedPosts.filter(p => p._id !== id));
        alert(response.data.message);
      }
    } catch (err) {
      console.error('Error suspending user:', err);
      alert(err.response?.data?.error?.message || 'Failed to suspend user');
    } finally {
      setActionLoading(null);
    }
  };

  const handleBan = async (id) => {
    if (!window.confirm('Are you sure you want to permanently ban this user?')) {
      return;
    }

    try {
      setActionLoading(id);
      const response = await api.put(`/api/admin/flags/${id}/ban`);
      
      if (response.data.success) {
        setFlaggedPosts(flaggedPosts.filter(p => p._id !== id));
        alert(response.data.message);
      }
    } catch (err) {
      console.error('Error banning user:', err);
      alert(err.response?.data?.error?.message || 'Failed to ban user');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-800 dark:text-red-200">{error}</p>
            <button
              onClick={fetchFlaggedPosts}
              className="mt-2 text-sm text-red-600 dark:text-red-400 hover:underline"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Moderation Queue
        </h1>

        {flaggedPosts.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No flagged posts</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              All posts have been reviewed.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {flaggedPosts.map((flag) => (
              <div key={flag._id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200">
                      Flagged
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(flag.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="mb-4">
                  <p className="text-gray-900 dark:text-white mb-2">{flag.feedback.content}</p>
                  <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <p>Author: {flag.feedback.author.name} ({flag.feedback.author.email})</p>
                    <p>Anonymous ID: {flag.feedback.author.anonymousId}</p>
                    <p>Flagged by: {flag.flaggedBy.name} ({flag.flaggedBy.email})</p>
                    <p className="text-red-600 dark:text-red-400 font-medium">Reason: {flag.reason}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleDismiss(flag._id)}
                    disabled={actionLoading === flag._id}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {actionLoading === flag._id ? 'Processing...' : 'Dismiss Flag'}
                  </button>
                  <button
                    onClick={() => handleSuspend(flag._id)}
                    disabled={actionLoading === flag._id}
                    className="px-4 py-2 text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {actionLoading === flag._id ? 'Processing...' : 'Suspend User'}
                  </button>
                  <button
                    onClick={() => handleBan(flag._id)}
                    disabled={actionLoading === flag._id}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {actionLoading === flag._id ? 'Processing...' : 'Ban User'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminModerationPage;
