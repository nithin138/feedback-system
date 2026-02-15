import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PendingApprovalPage from './pages/PendingApprovalPage';
import FeedPage from './pages/FeedPage';
import AnalyticsPage from './pages/AnalyticsPage';
import AdminApprovalsPage from './pages/AdminApprovalsPage';
import AdminModerationPage from './pages/AdminModerationPage';
import AdminCategoriesPage from './pages/AdminCategoriesPage';
import AboutPage from './pages/AboutPage';
import HelpPage from './pages/HelpPage';
import OAuthCallbackPage from './pages/OAuthCallbackPage';

function AppContent() {
  const [showCreatePost, setShowCreatePost] = useState(false);
  const location = useLocation();
  const isFeedPage = location.pathname === '/feed';

  const handleCreatePost = () => {
    if (isFeedPage) {
      setShowCreatePost(true);
    } else {
      window.location.href = '/feed';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar onCreatePost={handleCreatePost} />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/pending-approval" element={<PendingApprovalPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/help" element={<HelpPage />} />
        <Route path="/auth/callback" element={<OAuthCallbackPage />} />

        {/* Protected Routes */}
        <Route
          path="/feed"
          element={
            <ProtectedRoute>
              <FeedPage showComposer={showCreatePost} onCloseComposer={() => setShowCreatePost(false)} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <AnalyticsPage />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin/approvals"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminApprovalsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/moderation"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminModerationPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/categories"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminCategoriesPage />
            </ProtectedRoute>
          }
        />

        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
