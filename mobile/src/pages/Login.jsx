import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Loader2 } from 'lucide-react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    
    if (!username || !password) {
      setErrorMessage('Please enter both username and password.');
      return;
    }

    setIsLoading(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      
      const formData = new URLSearchParams();
      formData.append('username', username);
      formData.append('password', password);
      
      const response = await axios.post(`${apiUrl}/auth/login`, formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });

      if (response.status === 200 && response.data.access_token) {
        const token = response.data.access_token;
        localStorage.setItem('token', token);
        localStorage.setItem('auth_tokens', JSON.stringify({ access: token }));
        navigate('/dashboard');
      } else {
        setErrorMessage('Unexpected response format. Please try again.');
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          setErrorMessage('Invalid username or password.');
        } else if (error.response.status >= 500) {
          setErrorMessage('Server error. Please try again later.');
        } else {
          setErrorMessage(error.response.data?.detail || 'An error occurred during login.');
        }
      } else if (error.request) {
        setErrorMessage('Network error. Please check your connection.');
      } else {
        setErrorMessage('An unexpected error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 gradient-bg">
      {/* Container for glassmorphism effect */}
      <div className="glass-panel w-full max-w-md rounded-3xl p-8 flex flex-col gap-6 animate-in fade-in zoom-in duration-500">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">Welcome Back</h1>
          <p className="text-slate-600 text-sm">Sign in to continue to your account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700 ml-1">Username</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-white/60 border border-slate-300 text-slate-800 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-slate-400"
              placeholder="Enter your username"
              autoCapitalize="none"
              autoCorrect="off"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700 ml-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/60 border border-slate-300 text-slate-800 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-slate-400"
              placeholder="Enter your password"
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full mt-2 bg-primary hover:bg-primary-hover text-white font-semibold rounded-xl py-3.5 px-4 transition-all active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 flex items-center justify-center min-h-[52px] shadow-lg shadow-primary/30"
          >
            {isLoading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              "Login"
            )}
          </button>
          
          {/* Error Message */}
          {errorMessage && (
            <div className="mt-1 text-center p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 text-sm animate-in slide-in-from-top-2">
              {errorMessage}
            </div>
          )}

        </form>

        {/* Footer */}
        <div className="text-center mt-2">
          <p className="text-slate-600 text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary hover:text-primary-hover font-semibold transition-colors">
              Register
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
