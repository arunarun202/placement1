import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCloudUploadAlt, FaFilePdf, FaFileWord, FaTrash } from 'react-icons/fa';
import { motion } from 'framer-motion';
import api from '../api/axios';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';

const ResumeUploadPage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    job_role: ''
  });

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && (selectedFile.type === 'application/pdf' || selectedFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
      setFile(selectedFile);
    } else {
      toast.error('Please upload a PDF or DOCX file');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && (droppedFile.type === 'application/pdf' || droppedFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
      setFile(droppedFile);
    } else {
      toast.error('Please upload a PDF or DOCX file');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error('Please upload a resume file');
      return;
    }

    setLoading(true);
    const data = new FormData();
    data.append('file', file);
    data.append('name', formData.name);
    data.append('email', formData.email);
    data.append('job_role', formData.job_role);

    try {
      const response = await api.post('/resume/upload', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Resume analyzed successfully!');
      navigate(`/resume/result/${response.data.id}`);
    } catch (error) {
      toast.error('Failed to process resume. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-10 pb-20">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">
            AI Resume <span className="text-[var(--color-brand-primary)]">Analyzer</span>
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            Upload your resume to get an ATS score, personalized feedback, and course recommendations powered by Gemini AI.
          </p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl p-8 border border-slate-100"
        >
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                  <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[var(--color-brand-primary)] outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[var(--color-brand-primary)] outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Target Job Role</label>
                  <input type="text" required value={formData.job_role} onChange={(e) => setFormData({...formData, job_role: e.target.value})}
                    placeholder="e.g. Frontend Developer, Data Scientist"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[var(--color-brand-primary)] outline-none transition-all" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Upload Resume</label>
                <div 
                  className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-xl transition-colors ${
                    file ? 'border-[var(--color-brand-primary)] bg-orange-50' : 'border-slate-300 hover:border-[var(--color-brand-primary)]'
                  }`}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current.click()}
                >
                  <div className="space-y-1 text-center cursor-pointer">
                    {!file ? (
                      <>
                        <FaCloudUploadAlt className="mx-auto h-12 w-12 text-slate-400" />
                        <div className="flex text-sm text-slate-600 justify-center">
                          <span className="relative font-medium text-[var(--color-brand-primary)] hover:text-[var(--color-brand-secondary)] focus-within:outline-none">
                            Upload a file
                          </span>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-slate-500">PDF or DOCX up to 10MB</p>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center p-4">
                        {file.type === 'application/pdf' ? <FaFilePdf className="h-12 w-12 text-red-500 mb-2" /> : <FaFileWord className="h-12 w-12 text-blue-500 mb-2" />}
                        <p className="text-sm font-medium text-slate-900 truncate max-w-[200px]">{file.name}</p>
                        <p className="text-xs text-slate-500 mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        <button type="button" onClick={(e) => { e.stopPropagation(); setFile(null); }} className="mt-3 text-red-500 text-sm hover:text-red-700 flex items-center gap-1">
                          <FaTrash /> Remove
                        </button>
                      </div>
                    )}
                    <input ref={fileInputRef} type="file" className="sr-only" accept=".pdf,.docx" onChange={handleFileChange} />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center border-t border-slate-100 pt-8 mt-4">
              <button
                type="submit"
                disabled={loading || !file}
                className="w-full md:w-auto bg-gradient-to-r from-[var(--color-brand-primary)] to-[var(--color-brand-secondary)] text-white px-10 py-3.5 rounded-full font-bold shadow-lg hover:shadow-orange-500/40 hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:hover:translate-y-0"
              >
                {loading ? <LoadingSpinner size="small" text="Analyzing with Gemini AI..." /> : 'Analyze Resume'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default ResumeUploadPage;
