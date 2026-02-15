import { useState, useEffect } from 'react';
import api from '../utils/api';

const AdminApprovalsPage = () => {
  const [pendingFaculty, setPendingFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPendingFaculty();
  }, []);

  const fetchPendingFaculty = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/api/admin/faculty/pending');
      
      if (response.data.success) {
        setPendingFaculty(response.data.data.faculty);
      }
    } catch (err) {
      console.error('Error fetching pending faculty:', err);
      setError(err.response?.data?.error?.message || 'Failed to fetch pending faculty');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      const response = await api.put(`/api/admin/faculty/${id}/approve`);
      
      if (response.data.success) {
        setPendingFaculty(pendingFaculty.filter(f => f._id !== id));
      }
    } catch (err) {
      console.error('Error approving faculty:', err);
      alert(err.response?.data?.error?.message || 'Failed to approve faculty');
    }
  };

  const handleReject = async (id) => {
    try {
      const response = await api.put(`/api/admin/faculty/${id}/reject`);
      
      if (response.data.success) {
        setPendingFaculty(pendingFaculty.filter(f => f._id !== id));
      }
    } catch (err) {
      console.error('Error rejecting faculty:', err);
      alert(err.response?.data?.error?.message || 'Failed to reject faculty');
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
              onClick={fetchPendingFaculty}
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
          Faculty Approvals
        </h1>

        {pendingFaculty.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No pending approvals</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              All faculty registrations have been processed.
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {pendingFaculty.map((faculty) => (
                <li key={faculty._id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {faculty.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {faculty.email}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        Registered: {new Date(faculty.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => handleApprove(faculty._id)}
                        className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(faculty._id)}
                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminApprovalsPage;
