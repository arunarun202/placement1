import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUser, FaLock, FaEye, FaEyeSlash, FaGraduationCap, FaBriefcase, FaChartLine, FaRobot } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';

const LoginPage = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const result = await login(formData.username, formData.password);
    
    setLoading(false);
    if (result.success) {
      toast.success('Login successful!');
      navigate('/');
    } else {
      toast.error(result.error);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center bg-slate-900 pt-20 pb-12">
      <div className="absolute inset-0 gradient-bg opacity-30"></div>
      
      {/* Floating Icons */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div animate={{ y: [0, -20, 0], opacity: [0.1, 0.4, 0.1] }} transition={{ duration: 6, repeat: Infinity }} className="absolute top-[10%] left-[5%] text-4xl text-white">
          <FaGraduationCap />
        </motion.div>
        <motion.div animate={{ y: [0, 30, 0], opacity: [0.1, 0.4, 0.1] }} transition={{ duration: 8, repeat: Infinity, delay: 1 }} className="absolute top-[20%] right-[8%] text-5xl text-white">
          <FaBriefcase />
        </motion.div>
        <motion.div animate={{ x: [0, 20, 0], opacity: [0.1, 0.4, 0.1] }} transition={{ duration: 7, repeat: Infinity, delay: 2 }} className="absolute bottom-[15%] left-[10%] text-6xl text-white">
          <FaChartLine />
        </motion.div>
        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.4, 0.1] }} transition={{ duration: 5, repeat: Infinity, delay: 3 }} className="absolute bottom-[25%] right-[5%] text-5xl text-white">
          <FaRobot />
        </motion.div>
      </div>

      <div className="w-full max-w-md px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-panel p-8 rounded-3xl shadow-2xl"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-800 mb-2">Welcome Back!</h2>
            <p className="text-slate-500">Sign in to continue your journey</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="text-[var(--color-brand-primary)]" />
                </div>
                <input
                  type="text"
                  name="username"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border-2 border-slate-200 rounded-xl focus:ring-0 focus:border-[var(--color-brand-primary)] transition-colors bg-white/50 backdrop-blur-sm"
                  placeholder="Enter your username"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-[var(--color-brand-primary)]" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-10 py-3 border-2 border-slate-200 rounded-xl focus:ring-0 focus:border-[var(--color-brand-primary)] transition-colors bg-white/50 backdrop-blur-sm"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-[var(--color-brand-primary)]"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center">
                <input type="checkbox" className="rounded text-[var(--color-brand-primary)] focus:ring-[var(--color-brand-primary)] border-slate-300" />
                <span className="ml-2 text-slate-600">Remember me</span>
              </label>
              <a href="#" className="font-medium text-[var(--color-brand-primary)] hover:text-[var(--color-brand-secondary)]">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-white bg-gradient-to-r from-[var(--color-brand-primary)] to-[var(--color-brand-secondary)] hover:shadow-orange-500/50 hover:-translate-y-0.5 transition-all font-semibold text-lg disabled:opacity-70 disabled:hover:translate-y-0"
            >
              {loading ? <LoadingSpinner size="small" text="" /> : "Sign In"}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-slate-600">
              Don't have an account?{' '}
              <Link to="/register" className="font-bold text-[var(--color-brand-primary)] hover:text-[var(--color-brand-secondary)]">
                Sign up
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
