import { useState, useEffect } from 'react';

const RightSidebar = () => {
  const [showToast, setShowToast] = useState(false);

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

  return (
    <aside className="hidden lg:block w-[22%] flex-shrink-0">
      <div className="sticky top-20 space-y-4">
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
  );
};

export default RightSidebar;
