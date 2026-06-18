import React from 'react';
import { Link } from 'react-router-dom';
import { FaRobot, FaTwitter, FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-brand-primary)] to-[var(--color-brand-secondary)] flex items-center justify-center">
                <FaRobot className="text-white text-xl" />
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-white">
                Predict<span className="text-[var(--color-brand-primary)]">AI</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 mb-6 leading-relaxed">
              Empowering students with AI-driven placement predictions, personalized career recommendations, and intelligent resume analysis.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-[var(--color-brand-primary)] hover:text-white transition-colors"><FaTwitter /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-[var(--color-brand-primary)] hover:text-white transition-colors"><FaFacebook /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-[var(--color-brand-primary)] hover:text-white transition-colors"><FaInstagram /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-[var(--color-brand-primary)] hover:text-white transition-colors"><FaLinkedin /></a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 uppercase tracking-wider text-sm">Services</h3>
            <ul className="space-y-3">
              <li><Link to="/predict" className="hover:text-[var(--color-brand-primary)] transition-colors text-sm">Placement Prediction</Link></li>
              <li><Link to="/resume" className="hover:text-[var(--color-brand-primary)] transition-colors text-sm">Resume Analysis</Link></li>
              <li><Link to="/chatbot" className="hover:text-[var(--color-brand-primary)] transition-colors text-sm">AI Career Advisor</Link></li>
              <li><Link to="/predictions" className="hover:text-[var(--color-brand-primary)] transition-colors text-sm">Track Progress</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 uppercase tracking-wider text-sm">Resources</h3>
            <ul className="space-y-3">
              <li><a href="#" className="hover:text-[var(--color-brand-primary)] transition-colors text-sm">Blog</a></li>
              <li><a href="#" className="hover:text-[var(--color-brand-primary)] transition-colors text-sm">Success Stories</a></li>
              <li><a href="#" className="hover:text-[var(--color-brand-primary)] transition-colors text-sm">Interview Guide</a></li>
              <li><a href="#" className="hover:text-[var(--color-brand-primary)] transition-colors text-sm">FAQ</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white font-semibold mb-4 uppercase tracking-wider text-sm">Subscribe</h3>
            <p className="text-sm text-slate-400 mb-4">Get the latest updates on careers and AI insights.</p>
            <form className="flex" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Email address" 
                className="w-full px-4 py-2 rounded-l-lg bg-slate-800 border-none focus:ring-2 focus:ring-[var(--color-brand-primary)] text-white text-sm outline-none"
              />
              <button 
                type="submit" 
                className="bg-[var(--color-brand-primary)] hover:bg-[var(--color-brand-secondary)] px-4 py-2 rounded-r-lg text-white font-medium transition-colors"
              >
                Send
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} PredictAI. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-slate-300">Privacy Policy</a>
            <a href="#" className="hover:text-slate-300">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
