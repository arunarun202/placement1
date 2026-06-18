import React, { createContext, useState, useEffect } from 'react';
import api from '../api/axios';
import { toast } from 'react-hot-toast';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const tokens = localStorage.getItem('auth_tokens');
      if (tokens) {
        try {
          const res = await api.get('/auth/me');
          setUser(res.data);
        } catch (error) {
          console.error("Failed to fetch user on load", error);
          localStorage.removeItem('auth_tokens');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (username, password) => {
    try {
      const formData = new URLSearchParams();
      formData.append('username', username);
      formData.append('password', password);
      
      const res = await api.post('/auth/login', formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });
      
      localStorage.setItem('auth_tokens', JSON.stringify({ access: res.data.access_token }));
      
      // Fetch user data after successful login
      const userRes = await api.get('/auth/me');
      setUser(userRes.data);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Login failed. Please check your credentials.' 
      };
    }
  };

  const register = async (userData) => {
    try {
      // Map frontend field names to backend schema
      const payload = {
        username: userData.username,
        email: userData.email,
        password: userData.password1, // backend expects 'password', frontend uses 'password1'
        first_name: userData.first_name || '',
        last_name: userData.last_name || '',
      };
      await api.post('/auth/register', payload);
      // Auto-login after successful registration
      return await login(payload.username, payload.password);
    } catch (error) {
      const detail = error.response?.data?.detail;
      let errorMsg = 'Registration failed.';
      if (typeof detail === 'string') {
        errorMsg = detail;
      } else if (Array.isArray(detail)) {
        // FastAPI 422 validation errors return an array of objects
        errorMsg = detail.map(e => e.msg || JSON.stringify(e)).join('\n');
      }
      return { success: false, error: errorMsg };
    }
  };

  const logout = async () => {
    localStorage.removeItem('auth_tokens');
    setUser(null);
    window.location.href = '/login';
  };

  const updateProfile = async (formData) => {
    try {
      const res = await api.put('/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setUser(res.data);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Failed to update profile' 
      };
    }
  };

  const contextValue = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
