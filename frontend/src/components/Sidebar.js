import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const Sidebar = ({ posts = [] }) => {
  const { user, setUser } = useAuth();
  const [showToast, setShowToast] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');

  const handleHashtagClick = () => {
    setShowToast(true);
  };

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const handleEditClick = () => {
    setIsEditingName(true);
    setDisplayName(user?.displayName || '');
    setError('');
  };

  const handleSaveName = async () => {
    if (!displayName.trim()) {
      setError('Display name cannot be empty');
      return;
    }

    if (displayName.trim().length > 50) {
      setError('Display name must be 50 characters or less');
      return;
    }

    try {
      const response = await api.put('/api/auth/display-name', { 
        displayName: displayName.trim() 
      });
      
      if (response.data.success) {
        setUser(response.data.data.user);
        setIsEditingName(false);
        setError('');
      }
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to update display name');
    }
  };

  const handleCancelEdit = () => {
    setIsEditingName(false);
    setDisplayName('');
    setError('');
  };

  const getDisplayText = () => {
    if (user?.displayName) {
      return user.displayName;
    }
    return user?.anonymousId || user?.name || 'User';
  };

  return (
    <>
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-20 right-6 z-50 animate-slide-in">
          <div className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">Coming Soon!</span>
          </div>
        </div>
      )}

      {/* Left Sidebar - User Profile */}
      <aside className="hidden lg:block w-[22%] flex-shrink-0">
        <div className="sticky top-20">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                {(user?.displayName || user?.name)?.charAt(0).toUpperCase() || 'U'}
              </div>
              
              {!isEditingName ? (
                <div className="mt-4 flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white text-center">
                    {getDisplayText()}
                  </h3>
                  <button
                    onClick={handleEditClick}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                    title="Edit display name"
                  >
                    <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                </div>
              ) : (
                <div className="mt-4 w-full">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Enter display name"
                      maxLength={50}
                      autoFocus
                    />
                    <button
                      onClick={handleSaveName}
                      className="p-1 hover:bg-green-100 dark:hover:bg-green-900/20 rounded transition-colors"
                      title="Save"
                    >
                      <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition-colors"
                      title="Cancel"
                    >
                      <svg className="w-4 h-4 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  {error && (
                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">{error}</p>
                  )}
                </div>
              )}
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                {user?.email}
              </p>
              <span className="mt-2 px-3 py-1 text-xs font-medium rounded-full bg-primary-100 dark:bg-primary-900/20 text-primary-800 dark:text-primary-200">
                {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1) || 'Student'}
              </span>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Posts</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">{posts.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Active</span>
                  <span className="text-xs px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200">
                    Online
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="mt-4 bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Quick Stats</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span className="text-gray-600 dark:text-gray-400">General: {posts.filter(p => p.category === 'general').length}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-gray-600 dark:text-gray-400">Faculty: {posts.filter(p => p.category === 'faculty').length}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                <span className="text-gray-600 dark:text-gray-400">Course: {posts.filter(p => p.category === 'course').length}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                <span className="text-gray-600 dark:text-gray-400">Facility: {posts.filter(p => p.category === 'facility').length}</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Right Sidebar - Info */}
      <aside className="hidden lg:block w-[22%] flex-shrink-0">
        <div className="sticky top-20 space-y-4">
          {/* Trending Topics */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Trending Topics</h4>
            <div className="space-y-2">
              <div 
                onClick={handleHashtagClick}
                className="p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
              >
                <p className="text-sm font-medium text-gray-900 dark:text-white">#LibraryFacilities</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">24 posts</p>
              </div>
              <div 
                onClick={handleHashtagClick}
                className="p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
              >
                <p className="text-sm font-medium text-gray-900 dark:text-white">#TeachingQuality</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">18 posts</p>
              </div>
              <div 
                onClick={handleHashtagClick}
                className="p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
              >
                <p className="text-sm font-medium text-gray-900 dark:text-white">#CampusLife</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">15 posts</p>
              </div>
            </div>
          </div>

          {/* Guidelines */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Community Guidelines</h4>
            <ul className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Be respectful and constructive</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Provide honest feedback</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>No harassment or hate speech</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Keep content relevant</span>
              </li>
            </ul>
          </div>

          {/* Footer */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div className="text-xs text-gray-500 dark:text-gray-400 space-y-2">
              <p className="text-gray-400 dark:text-gray-500">
                © 2024 Feedback System
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
