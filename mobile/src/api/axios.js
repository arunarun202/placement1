import axios from 'axios';

// Get the URL from env
const rawApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const baseURL = rawApiUrl.replace(/\/+$/, ''); // Strip trailing slash

const api = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add the access token to headers
api.interceptors.request.use(
  (config) => {
    // We check both 'auth_tokens' and 'token' as per our Login/Register implementation
    const tokenData = localStorage.getItem('auth_tokens');
    const rawToken = localStorage.getItem('token');
    
    let token = null;
    
    if (tokenData) {
      try {
        const parsedTokens = JSON.parse(tokenData);
        token = parsedTokens.access || null;
      } catch (e) {
        // Fallback if not JSON
        token = tokenData;
      }
    }
    
    if (!token && rawToken) {
      token = rawToken;
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh / 401s
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear storage
      localStorage.removeItem('auth_tokens');
      localStorage.removeItem('token');
      
      // We don't have a direct window.location redirect in mobile (Capacitor) typically, 
      // but if we do, we can just trigger a reload or redirect.
      // A better way in React is handling this at the component level, but this serves as a fallback.
      if (window.location.pathname !== '/login' && !error.config.url.includes('/auth/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
