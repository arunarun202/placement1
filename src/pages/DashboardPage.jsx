import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHistory, FaCheckCircle, FaExclamationTriangle, FaEye, FaArrowRight, FaFileAlt, FaTrash, FaFilePdf, FaChartLine } from 'react-icons/fa';
import api from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';
import { toast } from 'react-hot-toast';

const DashboardPage = () => {
  const [predictions, setPredictions] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [predictionsRes, resumesRes] = await Promise.all([
        api.get('/predict/').catch(() => ({ data: [] })),
        api.get('/resume/').catch(() => ({ data: [] }))
      ]);
      setPredictions(predictionsRes.data);
      setResumes(resumesRes.data);
    } catch (error) {
      toast.error('Failed to load dashboard data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleDeleteResume = async (id) => {
    if (window.confirm("Are you sure you want to delete this resume analysis?")) {
      try {
        await api.delete(`/resume/${id}`);
        toast.success('Resume deleted successfully');
        fetchDashboardData();
      } catch (error) {
        toast.error('Failed to delete resume');
      }
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatShortDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <LoadingSpinner text="Loading Dashboard..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-10 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-3">
            <FaChartLine className="text-[var(--color-brand-primary)]" /> My Dashboard
          </h1>
          <p className="mt-2 text-slate-600">Overview of your recent placement predictions and resume evaluations.</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <motion.div whileHover={{ y: -5 }} className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-3xl p-6 shadow-lg text-white flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold mb-1">New Prediction</h2>
              <p className="text-orange-100 text-sm">Predict your placement chances now</p>
            </div>
            <Link to="/predict" className="w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center backdrop-blur-sm transition-colors">
              <FaArrowRight />
            </Link>
          </motion.div>
          
          <motion.div whileHover={{ y: -5 }} className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-3xl p-6 shadow-lg text-white flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold mb-1">Analyze Resume</h2>
              <p className="text-slate-300 text-sm">Get AI feedback & ATS score</p>
            </div>
            <Link to="/resume" className="w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center backdrop-blur-sm transition-colors">
              <FaArrowRight />
            </Link>
          </motion.div>
        </div>

        {/* Recent Predictions Section */}
        <div className="mb-12">
          <div className="flex justify-between items-end mb-6">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <FaHistory className="text-[var(--color-brand-primary)]" /> Recent Predictions
            </h2>
          </div>

          {predictions.length === 0 ? (
            <div className="bg-white rounded-3xl shadow-sm p-10 text-center border border-slate-100">
              <p className="text-slate-500 mb-4">No prediction history found.</p>
              <Link to="/predict" className="text-[var(--color-brand-primary)] font-semibold hover:underline">Start your first prediction</Link>
            </div>
          ) : (
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase tracking-wider text-xs font-semibold">
                      <th className="px-6 py-4">Date & Time</th>
                      <th className="px-6 py-4">Target Role</th>
                      <th className="px-6 py-4">Company</th>
                      <th className="px-6 py-4">Prediction</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {predictions.slice(0, 5).map((pred) => (
                      <tr key={pred.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 font-medium">
                          {formatDate(pred.created_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                          {pred.job_role}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                          {pred.company_name}
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700 max-w-[200px] truncate" title={pred.label}>
                            <FaCheckCircle />
                            {pred.label ? (pred.label.length > 30 ? pred.label.substring(0, 30) + '...' : pred.label) : 'Pending'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Saved Resumes Section */}
        <div>
          <div className="flex justify-between items-end mb-6">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <FaFileAlt className="text-[var(--color-brand-primary)]" /> Saved Resumes
            </h2>
          </div>

          {resumes.length === 0 ? (
            <div className="bg-white rounded-3xl shadow-sm p-10 text-center border border-slate-100">
              <p className="text-slate-500 mb-4">No resumes analyzed yet.</p>
              <Link to="/resume" className="text-[var(--color-brand-primary)] font-semibold hover:underline">Upload a resume to analyze</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resumes.map((resume, index) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  key={resume.id}
                  className="bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-[var(--color-brand-primary)]">
                        <FaFilePdf className="text-2xl" />
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                        resume.ats_score >= 80 ? 'bg-green-100 text-green-700' :
                        resume.ats_score >= 60 ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        ATS: {resume.ats_score}%
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-bold text-slate-800 truncate mb-1" title={resume.name || "Unnamed Resume"}>
                      {resume.name || "Unnamed Resume"}
                    </h3>
                    <p className="text-sm text-[var(--color-brand-primary)] font-medium mb-4 truncate">
                      {resume.job_role || "No target role specified"}
                    </p>
                    
                    <p className="text-xs text-slate-500 mb-6 flex items-center gap-1">
                      Uploaded: {formatShortDate(resume.uploaded_at)}
                    </p>
                  </div>
                  
                  <div className="flex border-t border-slate-100 bg-slate-50">
                    <Link to={`/resume/result/${resume.id}`} className="flex-1 py-3 text-center text-slate-700 font-medium hover:bg-white hover:text-[var(--color-brand-primary)] transition-colors border-r border-slate-100 flex justify-center items-center gap-2">
                      <FaEye /> View
                    </Link>
                    <button 
                      onClick={() => handleDeleteResume(resume.id)}
                      className="flex-1 py-3 text-center text-red-500 font-medium hover:bg-red-50 transition-colors flex justify-center items-center gap-2"
                    >
                      <FaTrash /> Delete
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default DashboardPage;
