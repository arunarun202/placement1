import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';
import { UploadCloud, FileText, ArrowLeft, Trash2 } from 'lucide-react';

export default function ResumeUpload() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    job_role: ''
  });

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && (selectedFile.type === 'application/pdf' || selectedFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
      setFile(selectedFile);
      setErrorMessage('');
    } else if (selectedFile) {
      setErrorMessage('Please upload a PDF or DOCX file');
      setFile(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setErrorMessage('Please select a resume file to analyze');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    
    const data = new FormData();
    data.append('file', file);
    data.append('name', formData.name);
    data.append('email', formData.email);
    data.append('job_role', formData.job_role);

    try {
      const response = await api.post('/resume/upload', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      navigate(`/resume/result/${response.data.id}`);
    } catch (error) {
      const backendError = error.response?.data?.detail || 'Failed to process resume';
      if (typeof backendError === 'string') {
        setErrorMessage(backendError);
      } else {
        setErrorMessage('An unexpected error occurred');
      }
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 flex flex-col pb-10">
      {/* Header */}
      <div className="bg-white px-5 pt-12 pb-4 rounded-b-3xl shadow-sm border-b border-slate-100 flex items-center gap-4 sticky top-0 z-10">
        <Link to="/dashboard" className="p-2 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 active:scale-95 transition-all">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            Analyze Resume
          </h1>
        </div>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <LoadingSpinner text="Analyzing with Gemini AI..." />
        </div>
      ) : (
        <div className="px-5 pt-6 flex-1 flex flex-col">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-slate-800">
              AI Resume <span className="text-primary">Analyzer</span>
            </h2>
            <p className="text-slate-500 text-sm mt-2 px-4">
              Get an ATS score, personalized feedback, and recommendations powered by AI.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-5">
            {/* Form Fields */}
            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700 ml-1">Full Name <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  required 
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-slate-400"
                  placeholder="Jane Doe"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700 ml-1">Email <span className="text-red-500">*</span></label>
                <input 
                  type="email" 
                  required 
                  value={formData.email} 
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-slate-400"
                  placeholder="jane@example.com"
                  autoCapitalize="none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700 ml-1">Target Job Role <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  required 
                  value={formData.job_role} 
                  onChange={(e) => setFormData({...formData, job_role: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-slate-400"
                  placeholder="e.g. Frontend Developer"
                />
              </div>
            </div>

            {/* File Upload Area */}
            <div 
              onClick={() => !file && fileInputRef.current.click()}
              className={`bg-white p-6 rounded-3xl border-2 border-dashed shadow-sm flex flex-col items-center justify-center transition-colors text-center ${
                file ? 'border-primary bg-orange-50/50' : 'border-slate-200 active:border-primary active:bg-slate-50'
              }`}
            >
              {!file ? (
                <>
                  <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mb-3">
                    <UploadCloud className="w-7 h-7 text-slate-400" />
                  </div>
                  <h3 className="font-bold text-slate-700">Upload Resume</h3>
                  <p className="text-xs text-slate-500 mt-1">Tap to select PDF or DOCX</p>
                </>
              ) : (
                <div className="flex flex-col items-center w-full">
                  <FileText className="w-10 h-10 text-primary mb-2" />
                  <p className="font-semibold text-slate-800 text-sm truncate w-full px-4">{file.name}</p>
                  <p className="text-xs text-slate-500 mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  
                  <button 
                    type="button" 
                    onClick={(e) => { e.stopPropagation(); setFile(null); }} 
                    className="mt-4 px-4 py-2 rounded-xl bg-red-50 text-red-600 text-sm font-medium flex items-center gap-2 active:bg-red-100 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" /> Remove File
                  </button>
                </div>
              )}
              <input 
                ref={fileInputRef} 
                type="file" 
                className="hidden" 
                accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" 
                onChange={handleFileChange} 
              />
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm text-center animate-in slide-in-from-top-2">
                {errorMessage}
              </div>
            )}

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={loading || !file}
              className="mt-auto w-full bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-2xl py-4 shadow-lg shadow-orange-500/20 active:scale-[0.98] transition-all disabled:opacity-70 disabled:active:scale-100 flex items-center justify-center"
            >
              Analyze Resume
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
