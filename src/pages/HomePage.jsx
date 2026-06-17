import React from 'react';
import { Link } from 'react-router-dom';
import { FaRobot, FaCheckCircle, FaRocket, FaGraduationCap, FaBriefcase, FaChartLine } from 'react-icons/fa';
import { motion } from 'framer-motion';

const HomePage = () => {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 text-white pt-20 pb-32">
        <div className="absolute inset-0 gradient-bg opacity-20"></div>
        
        {/* Animated Particles/Icons Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            animate={{ y: [0, -20, 0], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-20 left-[10%] text-4xl text-[var(--color-brand-primary)]"
          >
            <FaGraduationCap />
          </motion.div>
          <motion.div 
            animate={{ y: [0, 30, 0], opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-20 right-[15%] text-5xl text-[var(--color-brand-secondary)]"
          >
            <FaBriefcase />
          </motion.div>
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute top-1/3 right-[20%] text-6xl text-[var(--color-brand-primary)]"
          >
            <FaChartLine />
          </motion.div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8"
            >
              Your Career Journey <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-brand-primary)] to-[var(--color-brand-secondary)]">
                Powered by AI
              </span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-slate-300 mb-10 leading-relaxed"
            >
              Predict your placement chances, analyze your resume against industry standards, 
              and get personalized career guidance from our intelligent chatbot.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row justify-center gap-4"
            >
              <Link to="/register" className="px-8 py-4 rounded-full bg-gradient-to-r from-[var(--color-brand-primary)] to-[var(--color-brand-secondary)] text-white font-bold text-lg shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:-translate-y-1 transition-all flex items-center justify-center gap-2">
                <FaRocket /> Get Started
              </Link>
              <Link to="/predict" className="px-8 py-4 rounded-full bg-slate-800 text-white font-bold text-lg hover:bg-slate-700 transition-all border border-slate-700 hover:border-slate-600 flex items-center justify-center gap-2">
                <FaChartLine /> Try Prediction
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Comprehensive Career Suite</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">Everything you need to secure your dream job in one powerful platform.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <motion.div 
              whileHover={{ y: -10 }}
              className="bg-white rounded-2xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100"
            >
              <div className="w-16 h-16 rounded-2xl bg-orange-100 flex items-center justify-center mb-6">
                <FaChartLine className="text-3xl text-[var(--color-brand-primary)]" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Placement Prediction</h3>
              <p className="text-slate-600 mb-6">
                Our machine learning model analyzes 15+ data points including academics, skills, and experience to predict your placement probability with high accuracy.
              </p>
              <Link to="/predict" className="text-[var(--color-brand-primary)] font-semibold flex items-center gap-2 hover:gap-3 transition-all">
                Try it out <span>→</span>
              </Link>
            </motion.div>

            {/* Feature 2 */}
            <motion.div 
              whileHover={{ y: -10 }}
              className="bg-white rounded-2xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4">
                <span className="bg-gradient-to-r from-[var(--color-brand-primary)] to-[var(--color-brand-secondary)] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Powered by Gemini
                </span>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-orange-100 flex items-center justify-center mb-6">
                <FaCheckCircle className="text-3xl text-[var(--color-brand-primary)]" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Resume AI Analysis</h3>
              <p className="text-slate-600 mb-6">
                Upload your resume and get an instant ATS score, targeted feedback, and personalized course recommendations to bridge your skill gaps.
              </p>
              <Link to="/resume" className="text-[var(--color-brand-primary)] font-semibold flex items-center gap-2 hover:gap-3 transition-all">
                Analyze Resume <span>→</span>
              </Link>
            </motion.div>

            {/* Feature 3 */}
            <motion.div 
              whileHover={{ y: -10 }}
              className="bg-white rounded-2xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100"
            >
              <div className="w-16 h-16 rounded-2xl bg-orange-100 flex items-center justify-center mb-6">
                <FaRobot className="text-3xl text-[var(--color-brand-primary)]" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Intelligent Chatbot</h3>
              <p className="text-slate-600 mb-6">
                Have questions about interview preparation, company policies, or career paths? Our NLP-powered chatbot provides instant, accurate answers 24/7.
              </p>
              <Link to="/chatbot" className="text-[var(--color-brand-primary)] font-semibold flex items-center gap-2 hover:gap-3 transition-all">
                Start Chatting <span>→</span>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-[var(--color-brand-primary)] relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4yIi8+PC9zdmc+')] opacity-20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            <div>
              <div className="text-4xl md:text-5xl font-extrabold mb-2">95%</div>
              <div className="text-orange-100 font-medium">Prediction Accuracy</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-extrabold mb-2">10k+</div>
              <div className="text-orange-100 font-medium">Resumes Analyzed</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-extrabold mb-2">50+</div>
              <div className="text-orange-100 font-medium">Partner Companies</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-extrabold mb-2">24/7</div>
              <div className="text-orange-100 font-medium">AI Support</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
