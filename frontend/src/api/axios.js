import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add the access token to headers
api.interceptors.request.use(
  (config) => {
    const tokens = localStorage.getItem('auth_tokens');
    if (tokens) {
      const parsedTokens = JSON.parse(tokens);
      if (parsedTokens.access) {
        config.headers.Authorization = `Bearer ${parsedTokens.access}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If the error status is 401, the token has expired or is invalid
    if (error.response && error.response.status === 401) {
      // Avoid redirecting if we are already on the login page or trying to login
      if (window.location.pathname !== '/login' && !error.config.url.includes('/auth/login')) {
        localStorage.removeItem('auth_tokens');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
