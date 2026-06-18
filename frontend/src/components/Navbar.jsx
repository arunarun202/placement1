import React, { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaRobot, FaUserCircle, FaBars, FaTimes, FaSignOutAlt, FaHistory, FaFileAlt } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const isActive = (path) => {
    return location.pathname === path ? 'text-[var(--color-brand-primary)] font-bold' : 'text-slate-600 hover:text-[var(--color-brand-primary)]';
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" onClick={closeMenu} className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-brand-primary)] to-[var(--color-brand-secondary)] flex items-center justify-center shadow-lg shadow-orange-500/30 group-hover:scale-110 transition-transform">
                <FaRobot className="text-white text-xl" />
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-slate-800">
                Predict<span className="text-[var(--color-brand-primary)]">AI</span>
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className={`font-medium transition-colors ${isActive('/')}`}>Home</Link>
            
            {user && (
              <>
                <Link to="/dashboard" className={`font-medium transition-colors ${isActive('/dashboard')}`}>Dashboard</Link>
                <Link to="/predict" className={`font-medium transition-colors ${isActive('/predict')}`}>Predict</Link>
                <Link to="/resume" className={`font-medium transition-colors ${isActive('/resume')}`}>Resume AI</Link>
              </>
            )}

            {!user ? (
              <div className="flex items-center gap-4">
                <Link 
                  to="/login" 
                  className="font-medium text-slate-600 hover:text-[var(--color-brand-primary)] transition-colors"
                >
                  Log in
                </Link>
                <Link 
                  to="/register" 
                  className="bg-gradient-to-r from-[var(--color-brand-primary)] to-[var(--color-brand-secondary)] text-white px-5 py-2.5 rounded-full font-semibold shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:-translate-y-0.5 transition-all"
                >
                  Sign up
                </Link>
              </div>
            ) : (
              <div className="relative group">
                <button className="flex items-center gap-2 text-slate-700 hover:text-[var(--color-brand-primary)] font-medium transition-colors p-2">
                  <img 
                    src={user.avatar || 'https://ui-avatars.com/api/?name=' + user.username} 
                    alt="avatar" 
                    className="w-8 h-8 rounded-full border-2 border-[var(--color-brand-primary)] object-cover"
                  />
                  <span>{user.username}</span>
                </button>
                
                {/* Dropdown */}
                <div className="absolute right-0 w-48 mt-2 bg-white rounded-xl shadow-xl border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right scale-95 group-hover:scale-100">
                  <div className="py-2">
                    <Link to="/profile" className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-[var(--color-brand-primary)]">
                      <FaUserCircle /> Profile
                    </Link>
                    <Link to="/dashboard" className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-[var(--color-brand-primary)]">
                      <FaHistory /> Dashboard
                    </Link>
                    <div className="border-t border-slate-100 my-1"></div>
                    <button 
                      onClick={logout}
                      className="flex w-full items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <FaSignOutAlt /> Log out
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-slate-600 hover:text-[var(--color-brand-primary)] focus:outline-none p-2"
            >
              {isOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 shadow-lg absolute w-full left-0 animate-fade-in">
          <div className="px-4 pt-2 pb-6 space-y-1">
            <Link 
              to="/" 
              onClick={closeMenu}
              className="block px-3 py-3 rounded-lg text-base font-medium text-slate-800 hover:bg-orange-50 hover:text-[var(--color-brand-primary)]"
            >
              Home
            </Link>
            
            {user ? (
              <>
                <Link to="/dashboard" onClick={closeMenu} className="block px-3 py-3 rounded-lg text-base font-medium text-slate-800 hover:bg-orange-50 hover:text-[var(--color-brand-primary)]">Dashboard</Link>
                <Link to="/predict" onClick={closeMenu} className="block px-3 py-3 rounded-lg text-base font-medium text-slate-800 hover:bg-orange-50 hover:text-[var(--color-brand-primary)]">Predict Placement</Link>
                <Link to="/resume" onClick={closeMenu} className="block px-3 py-3 rounded-lg text-base font-medium text-slate-800 hover:bg-orange-50 hover:text-[var(--color-brand-primary)]">Resume Analyzer</Link>
                <div className="border-t border-slate-100 my-2"></div>
                <Link to="/profile" onClick={closeMenu} className="block px-3 py-3 rounded-lg text-base font-medium text-slate-800 hover:bg-orange-50 hover:text-[var(--color-brand-primary)]">Profile Settings</Link>
                <button 
                  onClick={() => { logout(); closeMenu(); }}
                  className="block w-full text-left px-3 py-3 rounded-lg text-base font-medium text-red-600 hover:bg-red-50"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  onClick={closeMenu}
                  className="block px-3 py-3 rounded-lg text-base font-medium text-slate-800 hover:bg-orange-50 hover:text-[var(--color-brand-primary)]"
                >
                  Log in
                </Link>
                <Link 
                  to="/register" 
                  onClick={closeMenu}
                  className="block px-3 py-3 mt-2 text-center rounded-full text-base font-medium bg-gradient-to-r from-[var(--color-brand-primary)] to-[var(--color-brand-secondary)] text-white"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
