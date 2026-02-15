import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
    setLoading(false);
  }, []);

  // Fetch current user from API
  const fetchUser = async () => {
    try {
      const response = await api.get('/api/auth/me');
      if (response.data.success) {
        setUser(response.data.data.user);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
      logout();
    }
  };

  // Login function
  const login = async (email, password) => {
    try {
      const response = await api.post('/api/auth/login', { email, password });
      
      if (response.data.success) {
        const { token, user } = response.data.data;
        setToken(token);
        setUser(user);
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        return { success: true };
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error?.message || 'Login failed'
      };
    }
  };

  // Register function
  const register = async (email, password, name, role) => {
    try {
      const response = await api.post('/api/auth/register', {
        email,
        password,
        name,
        role
      });
      
      if (response.data.success) {
        const { token, user } = response.data.data;
        setToken(token);
        setUser(user);
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        return { 
          success: true, 
          message: response.data.message 
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error?.message || 'Registration failed'
      };
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  // Google OAuth login
  const loginWithGoogle = () => {
    window.location.href = `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/auth/google`;
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    loginWithGoogle,
    fetchUser,
    setUser: updateUser,
    setToken,
    isAuthenticated: !!user,
    isStudent: user?.role === 'student',
    isFaculty: user?.role === 'faculty',
    isAdmin: user?.role === 'admin'
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
