import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUser, FaLock, FaEnvelope, FaEye, FaEyeSlash, FaCheckCircle } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';

const RegisterPage = () => {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    password1: '',
    password2: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const calculateStrength = (password) => {
    let score = 0;
    if (!password) return score;
    if (password.length > 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    return score;
  };

  const strength = calculateStrength(formData.password1);
  const strengthColors = ['bg-slate-200', 'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500'];
  const strengthLabels = ['Too Weak', 'Weak', 'Fair', 'Good', 'Strong'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password1 !== formData.password2) {
      toast.error('Passwords do not match');
      return;
    }
    
    setLoading(true);
    const result = await register(formData);
    setLoading(false);
    
    if (result.success) {
      toast.success('Registration successful! Welcome.');
      navigate('/');
    } else {
      toast.error(result.error || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 pt-20 pb-12">
      {/* Left Side - Benefits */}
      <div className="hidden lg:flex lg:w-1/2 gradient-bg flex-col justify-center items-center text-white p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 max-w-lg">
          <h2 className="text-4xl font-extrabold mb-6">Join PredictAI Today</h2>
          <p className="text-xl mb-12 text-white/90">Unlock the power of AI to supercharge your career journey.</p>
          
          <div className="space-y-8">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="flex items-start gap-4">
              <div className="mt-1 bg-white/20 p-2 rounded-full"><FaCheckCircle className="text-2xl" /></div>
              <div>
                <h3 className="text-xl font-bold">Predict Placement Chances</h3>
                <p className="text-white/80">Know where you stand before applying with our highly accurate ML models.</p>
              </div>
            </motion.div>
            
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="flex items-start gap-4">
              <div className="mt-1 bg-white/20 p-2 rounded-full"><FaCheckCircle className="text-2xl" /></div>
              <div>
                <h3 className="text-xl font-bold">Smart Resume Analysis</h3>
                <p className="text-white/80">Get ATS scores and AI-driven feedback to make your resume stand out.</p>
              </div>
            </motion.div>
            
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }} className="flex items-start gap-4">
              <div className="mt-1 bg-white/20 p-2 rounded-full"><FaCheckCircle className="text-2xl" /></div>
              <div>
                <h3 className="text-xl font-bold">Personalized Recommendations</h3>
                <p className="text-white/80">Discover courses and roles tailored specifically to your profile.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8 lg:hidden">
            <h2 className="text-3xl font-bold text-slate-800">Create an Account</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 hidden lg:block">Create your account</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">First Name</label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  className="block w-full px-4 py-2.5 border-2 border-slate-200 rounded-xl focus:ring-0 focus:border-[var(--color-brand-primary)] transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  className="block w-full px-4 py-2.5 border-2 border-slate-200 rounded-xl focus:ring-0 focus:border-[var(--color-brand-primary)] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Username <span className="text-red-500">*</span></label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="text-slate-400" />
                </div>
                <input
                  type="text"
                  name="username"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2.5 border-2 border-slate-200 rounded-xl focus:ring-0 focus:border-[var(--color-brand-primary)] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email <span className="text-red-500">*</span></label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="text-slate-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2.5 border-2 border-slate-200 rounded-xl focus:ring-0 focus:border-[var(--color-brand-primary)] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password <span className="text-red-500">*</span></label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-slate-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password1"
                  required
                  value={formData.password1}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-10 py-2.5 border-2 border-slate-200 rounded-xl focus:ring-0 focus:border-[var(--color-brand-primary)] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-[var(--color-brand-primary)]"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {formData.password1 && (
                <div className="mt-2">
                  <div className="flex justify-between items-center mb-1 text-xs">
                    <span className="text-slate-500">Password strength</span>
                    <span className="font-semibold" style={{ color: strength > 0 ? strengthColors[strength].replace('bg-', '') : 'inherit' }}>
                      {strengthLabels[strength]}
                    </span>
                  </div>
                  <div className="flex h-1.5 gap-1">
                    {[1, 2, 3, 4].map((level) => (
                      <div key={level} className={`flex-1 rounded-full ${strength >= level ? strengthColors[strength] : 'bg-slate-200'}`}></div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Confirm Password <span className="text-red-500">*</span></label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-slate-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password2"
                  required
                  value={formData.password2}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-2.5 border-2 rounded-xl focus:ring-0 transition-colors ${
                    formData.password2 && formData.password1 !== formData.password2 ? 'border-red-500 focus:border-red-500' : 'border-slate-200 focus:border-[var(--color-brand-primary)]'
                  }`}
                />
              </div>
              {formData.password2 && formData.password1 !== formData.password2 && (
                <p className="mt-1 text-xs text-red-500">Passwords do not match</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 rounded-xl shadow-lg text-white bg-gradient-to-r from-[var(--color-brand-primary)] to-[var(--color-brand-secondary)] hover:shadow-orange-500/50 hover:-translate-y-0.5 transition-all font-semibold text-lg disabled:opacity-70 disabled:hover:translate-y-0 mt-6"
            >
              {loading ? <LoadingSpinner size="small" text="" /> : "Create Account"}
            </button>
            
            <p className="text-center text-slate-600 mt-4 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-[var(--color-brand-primary)] hover:text-[var(--color-brand-secondary)]">
                Log in
              </Link>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default RegisterPage;
