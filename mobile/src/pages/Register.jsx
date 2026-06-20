import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Loader2 } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    password: '',
    confirm_password: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    
    if (formData.password !== formData.confirm_password) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setIsLoading(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      
      // 1. Register User
      const payload = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        first_name: formData.first_name,
        last_name: formData.last_name,
      };

      await axios.post(`${apiUrl}/auth/register`, payload);

      // 2. Auto-Login
      const loginData = new URLSearchParams();
      loginData.append('username', formData.username);
      loginData.append('password', formData.password);
      
      const loginRes = await axios.post(`${apiUrl}/auth/login`, loginData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });

      if (loginRes.status === 200 && (loginRes.data.access_token || loginRes.data.token)) {
        const token = loginRes.data.access_token || loginRes.data.token;
        localStorage.setItem('auth_tokens', JSON.stringify({ access: token }));
        // Some systems look for 'token', so set both just in case
        localStorage.setItem('token', token);
        
        setSuccessMessage('Registration successful! Redirecting...');
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
      } else {
        setSuccessMessage('Registration successful! Please login.');
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      }
    } catch (error) {
      if (error.response) {
        const detail = error.response.data?.detail;
        if (typeof detail === 'string') {
          setErrorMessage(detail);
        } else if (Array.isArray(detail)) {
          setErrorMessage(detail.map(e => e.msg || JSON.stringify(e)).join(', '));
        } else {
          setErrorMessage('Registration failed. Please try again.');
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
    <div className="min-h-screen w-full flex items-center justify-center p-4 gradient-bg py-10">
      {/* Container for glassmorphism effect */}
      <div className="glass-panel w-full max-w-md rounded-3xl p-6 sm:p-8 flex flex-col gap-6 animate-in fade-in zoom-in duration-500 my-auto">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">Create Account</h1>
          <p className="text-slate-600 text-sm">Join PredictAI and supercharge your career</p>
        </div>

        {/* Form */}
        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700 ml-1">First Name</label>
              <input 
                type="text" 
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                className="w-full bg-white/60 border border-slate-300 text-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-slate-400"
                placeholder="Jane"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700 ml-1">Last Name</label>
              <input 
                type="text" 
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                className="w-full bg-white/60 border border-slate-300 text-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-slate-400"
                placeholder="Doe"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-700 ml-1">Username <span className="text-red-500">*</span></label>
            <input 
              type="text" 
              name="username"
              required
              value={formData.username}
              onChange={handleChange}
              className="w-full bg-white/60 border border-slate-300 text-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-slate-400"
              placeholder="Choose a username"
              autoCapitalize="none"
              autoCorrect="off"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-700 ml-1">Email <span className="text-red-500">*</span></label>
            <input 
              type="email" 
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-white/60 border border-slate-300 text-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-slate-400"
              placeholder="Enter your email"
              autoCapitalize="none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-700 ml-1">Password <span className="text-red-500">*</span></label>
            <input 
              type="password" 
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-white/60 border border-slate-300 text-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-slate-400"
              placeholder="Create a password"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-700 ml-1">Confirm Password <span className="text-red-500">*</span></label>
            <input 
              type="password" 
              name="confirm_password"
              required
              value={formData.confirm_password}
              onChange={handleChange}
              className={`w-full bg-white/60 border text-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 transition-all placeholder:text-slate-400 ${
                formData.confirm_password && formData.confirm_password !== formData.password 
                ? 'border-red-500 focus:ring-red-500' 
                : 'border-slate-300 focus:ring-primary focus:border-transparent'
              }`}
              placeholder="Confirm your password"
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
              "Sign Up"
            )}
          </button>
          
          {/* Error Message */}
          {errorMessage && (
            <div className="mt-1 text-center p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 text-sm animate-in slide-in-from-top-2">
              {errorMessage}
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="mt-1 text-center p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-600 text-sm animate-in slide-in-from-top-2">
              {successMessage}
            </div>
          )}

        </form>

        {/* Footer */}
        <div className="text-center mt-1">
          <p className="text-slate-600 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:text-primary-hover font-semibold transition-colors">
              Log in
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
