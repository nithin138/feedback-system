import { useAuth } from '../context/AuthContext';
import LeftSidebar from '../components/LeftSidebar';
import RightSidebar from '../components/RightSidebar';

const AnalyticsPage = () => {
  const { isFaculty, isAdmin } = useAuth();

  // Mock analytics data
  const facultyAnalytics = {
    averageRating: 4.5,
    totalFeedback: 45,
    positiveRatio: 0.82,
    categories: [
      { name: 'Teaching Quality', average: 4.7 },
      { name: 'Communication', average: 4.5 },
      { name: 'Course Content', average: 4.3 }
    ]
  };

  const adminAnalytics = {
    totalPosts: 234,
    totalUsers: 156,
    totalFlags: 3,
    pendingApprovals: 5,
    facultyPerformance: [
      { name: 'Dr. Smith', average: 4.8, feedbackCount: 45 },
      { name: 'Prof. Johnson', average: 4.6, feedbackCount: 38 },
      { name: 'Dr. Williams', average: 4.4, feedbackCount: 32 }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-6">
          <LeftSidebar posts={[]} />
          
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
              {isAdmin ? 'System Analytics' : 'My Analytics'}
            </h1>

            {isFaculty && (
              <div className="space-y-6">
                {/* Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Average Rating</p>
                        <p className="text-3xl font-bold text-primary-600 dark:text-primary-400 mt-2">
                          {facultyAnalytics.averageRating}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/20 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-primary-600 dark:text-primary-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Total Feedback</p>
                        <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">
                          {facultyAnalytics.totalFeedback}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Positive Feedback</p>
                        <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-2">
                          {(facultyAnalytics.positiveRatio * 100).toFixed(0)}%
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Rating Categories */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Rating by Category
                  </h2>
                  <div className="space-y-4">
                    {facultyAnalytics.categories.map((cat, index) => (
                      <div key={index}>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                            {cat.name}
                          </span>
                          <span className="text-sm font-bold text-gray-900 dark:text-white">
                            {cat.average}/5
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-primary-600 dark:bg-primary-400 h-2 rounded-full"
                            style={{ width: `${(cat.average / 5) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {isAdmin && (
              <div className="space-y-6">
                {/* Admin Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Posts</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                      {adminAnalytics.totalPosts}
                    </p>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Users</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                      {adminAnalytics.totalUsers}
                    </p>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Flagged Posts</p>
                    <p className="text-3xl font-bold text-red-600 dark:text-red-400 mt-2">
                      {adminAnalytics.totalFlags}
                    </p>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Pending Approvals</p>
                    <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mt-2">
                      {adminAnalytics.pendingApprovals}
                    </p>
                  </div>
                </div>

                {/* Faculty Performance */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Faculty Performance Overview
                  </h2>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead>
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Faculty
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Average Rating
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Feedback Count
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {adminAnalytics.facultyPerformance.map((faculty, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                              {faculty.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                              <div className="flex items-center">
                                <span className="font-semibold">{faculty.average}</span>
                                <svg className="w-4 h-4 text-yellow-400 ml-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {faculty.feedbackCount}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>

          <RightSidebar />
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
