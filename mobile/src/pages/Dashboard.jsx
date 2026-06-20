import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  LayoutDashboard, 
  TrendingUp, 
  FileText, 
  Trash2, 
  Eye, 
  History, 
  LogOut, 
  CheckCircle,
  ChevronRight
} from 'lucide-react';

export default function Dashboard() {
  const [predictions, setPredictions] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
      console.error("Failed to load dashboard data", error);
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
        fetchDashboardData();
      } catch (_error) {
        console.error('Failed to delete resume', _error);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('auth_tokens');
    navigate('/login');
  };

  const formatShortDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <LoadingSpinner text="Loading Dashboard..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      
      {/* Header */}
      <div className="bg-white px-5 pt-12 pb-6 rounded-b-3xl shadow-sm border-b border-slate-100 flex justify-between items-center sticky top-0 z-10">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <LayoutDashboard className="text-primary w-6 h-6" />
            Dashboard
          </h1>
          <p className="text-slate-500 text-sm mt-1">Welcome back to PredictAI</p>
        </div>
        <button 
          onClick={handleLogout}
          className="p-2.5 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 active:scale-95 transition-all"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>

      <div className="px-5 pt-6 space-y-8">
        
        {/* Quick Actions */}
        <section>
          <div className="flex gap-4">
            <Link 
              to="/predict" 
              className="flex-1 bg-gradient-to-br from-primary to-secondary rounded-3xl p-5 shadow-lg shadow-orange-500/20 text-white flex flex-col justify-between active:scale-[0.98] transition-transform"
            >
              <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-sm">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-lg leading-tight">Predict Chances</h2>
                <p className="text-white/80 text-xs mt-1">Get placement odds</p>
              </div>
            </Link>
            
            <Link 
              to="/resume" 
              className="flex-1 bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-5 shadow-lg text-white flex flex-col justify-between active:scale-[0.98] transition-transform"
            >
              <div className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-sm">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-lg leading-tight">Analyze Resume</h2>
                <p className="text-slate-400 text-xs mt-1">ATS score & feedback</p>
              </div>
            </Link>
          </div>
        </section>

        {/* Recent Predictions List (Mobile Cards) */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <History className="text-primary w-5 h-5" /> Recent Predictions
            </h2>
          </div>

          {predictions.length === 0 ? (
            <div className="bg-white rounded-2xl p-6 text-center border border-slate-100 shadow-sm">
              <p className="text-slate-500 text-sm mb-3">No prediction history yet.</p>
              <Link to="/predict" className="text-primary text-sm font-semibold">Start a prediction</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {predictions.slice(0, 5).map((pred) => (
                <div key={pred.id} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex flex-col gap-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-slate-800">{pred.job_role}</h3>
                      <p className="text-xs text-slate-500">{pred.company_name}</p>
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium bg-slate-100 px-2 py-1 rounded-full">
                      {formatShortDate(pred.created_at)}
                    </span>
                  </div>
                  
                  <div className="bg-orange-50 border border-orange-100 rounded-xl px-3 py-2 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-orange-500 shrink-0" />
                    <span className="text-xs font-semibold text-orange-700 truncate">
                      {pred.label ? pred.label : 'Pending'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Saved Resumes List (Mobile Cards) */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <FileText className="text-primary w-5 h-5" /> Saved Resumes
            </h2>
          </div>

          {resumes.length === 0 ? (
            <div className="bg-white rounded-2xl p-6 text-center border border-slate-100 shadow-sm">
              <p className="text-slate-500 text-sm mb-3">No resumes analyzed yet.</p>
              <Link to="/resume" className="text-primary text-sm font-semibold">Upload a resume</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {resumes.map((resume) => (
                <div key={resume.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                  <div className="p-4 flex gap-4 items-center">
                    <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center shrink-0">
                      <FileText className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-slate-800 text-sm truncate">{resume.name || "Unnamed Resume"}</h3>
                      <p className="text-xs text-slate-500 truncate">{resume.job_role || "No target role"}</p>
                    </div>
                    <div className={`px-2 py-1 rounded-lg text-xs font-bold shrink-0 ${
                      resume.ats_score >= 80 ? 'bg-green-100 text-green-700' :
                      resume.ats_score >= 60 ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {resume.ats_score}%
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 divide-x divide-slate-100 border-t border-slate-100 bg-slate-50">
                    <Link 
                      to={`/resume/result/${resume.id}`} 
                      className="py-3 flex items-center justify-center gap-2 text-sm font-medium text-slate-600 active:bg-slate-100 transition-colors"
                    >
                      <Eye className="w-4 h-4" /> View
                    </Link>
                    <button 
                      onClick={() => handleDeleteResume(resume.id)}
                      className="py-3 flex items-center justify-center gap-2 text-sm font-medium text-red-500 active:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>
    </div>
  );
}
