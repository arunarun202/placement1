import axios from 'axios';

// Get the URL and strip any accidental trailing slashes (e.g., https://render.com/ -> https://render.com)
const rawApiUrl = import.meta.env.VITE_API_URL;
const baseURL = rawApiUrl ? rawApiUrl.replace(/\/+$/, '') : '/api';

console.log("🛠️ Frontend API Base URL is set to:", baseURL);

const api = axios.create({
  baseURL: baseURL,
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
      const base = import.meta.env.BASE_URL || '/';
      const loginPath = base.endsWith('/') ? base + 'login' : base + '/login';
      
      // Avoid redirecting if we are already on the login page or trying to login
      if (window.location.pathname !== loginPath && !error.config.url.includes('/auth/login')) {
        localStorage.removeItem('auth_tokens');
        window.location.href = loginPath;
      }
    }
    return Promise.reject(error);
  }
);

export default api;
