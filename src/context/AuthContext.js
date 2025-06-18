// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://localhost:7062/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [token, setToken] = useState(localStorage.getItem('tpa_token'));

  // Check if user is logged in on app start
  useEffect(() => {
    if (token) {
      validateToken();
    }
  }, [token]);

  const apiCall = async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      ...options,
    };

    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  };

  const login = async (credentials) => {
    setLoading(true);
    setError('');

    try {
      const response = await apiCall('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
      });

      // Handle the direct response structure from your API
      if (response.success) {
        const sessionToken = response.token;
        const userData = {
          id: response.user.id,
          email: response.user.email,
          role: response.user.role,
          name: response.employee ? response.employee.fullName : response.user.email.split('@')[0],
          employee: response.employee
        };

        // Store token and user data
        setToken(sessionToken);
        setUser(userData);
        localStorage.setItem('tpa_token', sessionToken);
        localStorage.setItem('tpa_user', JSON.stringify(userData));

        return { success: true, user: userData };
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (err) {
      const errorMessage = err.message || 'An error occurred during login';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);

    try {
      if (token) {
        await apiCall('/auth/logout', {
          method: 'POST',
          body: JSON.stringify({ token })
        });
      }
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      // Clear local state regardless of API call success
      setUser(null);
      setToken(null);
      setError('');
      localStorage.removeItem('tpa_token');
      localStorage.removeItem('tpa_user');
      setLoading(false);
    }
  };

  const validateToken = async () => {
    if (!token) return false;

    try {
      const response = await apiCall(`/auth/validate?token=${encodeURIComponent(token)}`);
      
      if (response.success) {
        const userData = {
          id: response.user.id,
          email: response.user.email,
          role: response.user.role,
          name: response.employee ? response.employee.fullName : response.user.email.split('@')[0],
          employee: response.employee
        };
        
        setUser(userData);
        localStorage.setItem('tpa_user', JSON.stringify(userData));
        return true;
      } else {
        // Token is invalid
        logout();
        return false;
      }
    } catch (err) {
      console.error('Token validation error:', err);
      logout();
      return false;
    }
  };

  const clearError = () => setError('');

  const value = {
    user,
    token,
    loading,
    error,
    login,
    logout,
    validateToken,
    clearError,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};