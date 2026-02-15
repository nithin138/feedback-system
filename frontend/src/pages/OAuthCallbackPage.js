import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const OAuthCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setUser, setToken } = useAuth();
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleCallback = async () => {
      const token = searchParams.get('token');
      const errorParam = searchParams.get('error');

      if (errorParam) {
        setError(decodeURIComponent(errorParam));
        setTimeout(() => {
          navigate('/login');
        }, 3000);
        return;
      }

      if (token) {
        try {
          // Store token
          localStorage.setItem('token', token);

          // Fetch user data
          const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/auth/me`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          const data = await response.json();

          if (data.success) {
            const user = data.data.user;
            localStorage.setItem('user', JSON.stringify(user));
            
            // Update auth context
            if (setUser) setUser(user);
            if (setToken) setToken(token);

            // Redirect based on user status
            if (user.role === 'faculty' && user.approvalStatus === 'pending') {
              navigate('/pending-approval');
            } else {
              navigate('/feed');
            }
          } else {
            setError('Failed to fetch user data');
            setTimeout(() => navigate('/login'), 3000);
          }
        } catch (err) {
          console.error('OAuth callback error:', err);
          setError('Authentication failed. Please try again.');
          setTimeout(() => navigate('/login'), 3000);
        }
      } else {
        setError('No authentication token received');
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    handleCallback();
  }, [searchParams, navigate, setUser, setToken]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full space-y-8 text-center">
        {error ? (
          <div className="space-y-4">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/20">
              <svg className="h-6 w-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Authentication Failed
            </h2>
            <p className="text-gray-600 dark:text-gray-400">{error}</p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              Redirecting to login page...
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="mx-auto flex items-center justify-center h-12 w-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Completing Sign In...
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Please wait while we authenticate your account
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OAuthCallbackPage;
