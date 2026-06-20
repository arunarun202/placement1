import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  ArrowLeft, User, Briefcase, Rocket 
} from 'lucide-react';

export default function Predict() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    qualification: '',
    year: '',
    cgpa: '',
    post_graduation: '',
    ten_percentage: '',
    twelth_percentage: '',
    job_role: '',
    salary: '',
    soft_skills: '',
    internship: '',
    experience: '',
    round: '',
    company_name: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    
    try {
      // Convert string values to proper numeric types for the backend
      const payload = {
        ...formData,
        age: parseFloat(formData.age),
        year: parseFloat(formData.year),
        cgpa: parseFloat(formData.cgpa),
        ten_percentage: parseFloat(formData.ten_percentage),
        twelth_percentage: parseFloat(formData.twelth_percentage),
        salary: parseFloat(formData.salary),
        experience: parseFloat(formData.experience),
        round: parseInt(formData.round),
      };
      
      const response = await api.post('/predict', payload);
      // Navigate to result page with the data
      navigate('/prediction/result', { state: { result: response.data } });
    } catch (error) {
      console.error(error);
      const detail = error.response?.data?.detail;
      if (typeof detail === 'string') {
        setErrorMessage(detail);
      } else if (Array.isArray(detail)) {
        setErrorMessage(detail.map(e => e.msg || JSON.stringify(e)).join(', '));
      } else {
        setErrorMessage('Failed to generate prediction. Please try again.');
      }
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
            Predict Chances
          </h1>
        </div>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <LoadingSpinner text="Analyzing Profile..." />
        </div>
      ) : (
        <div className="px-5 pt-6 flex-1 flex flex-col">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center p-3 bg-orange-100 rounded-2xl mb-3">
              <Rocket className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">
              Placement <span className="text-primary">Prediction</span>
            </h2>
            <p className="text-slate-500 text-sm mt-2 px-2">
              Fill out your details below to see your probability of getting placed.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-6">
            
            {/* Section 1: Personal & Academic Info */}
            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-4">
              <h3 className="text-lg font-bold text-slate-800 pb-2 border-b-2 border-orange-100 flex items-center gap-2">
                <User className="w-5 h-5 text-primary" /> Personal & Academic Info
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700 ml-1">Age</label>
                  <input type="number" name="age" min="18" required value={formData.age} onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-slate-400" />
                </div>
                
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700 ml-1">Gender</label>
                  <select name="gender" required value={formData.gender} onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all">
                    <option value="" disabled>Select</option>
                    <option value="0">Male</option>
                    <option value="1">Female</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700 ml-1">Qualification</label>
                <select name="qualification" required value={formData.qualification} onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all">
                  <option value="" disabled>Select Qualification</option>
                  <option value="0">B.TECH</option>
                  <option value="1">BCA</option>
                  <option value="2">BE</option>
                  <option value="3">BSC</option>
                  <option value="4">DIPLOMA</option>
                  <option value="5">ITI</option>
                  <option value="6">M.TECH</option>
                  <option value="7">MCA</option>
                  <option value="8">MCS</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700 ml-1">Year</label>
                  <input type="number" name="year" min="2010" max="2080" required value={formData.year} onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" />
                </div>
                
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700 ml-1">CGPA</label>
                  <input type="number" step="0.01" name="cgpa" min="0" max="10" placeholder="0 - 10" required value={formData.cgpa} onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-slate-400" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700 ml-1">10th %</label>
                  <input type="number" step="0.01" name="ten_percentage" min="0" max="100" placeholder="0 - 100" required value={formData.ten_percentage} onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-slate-400" />
                </div>
                
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700 ml-1">12th %</label>
                  <input type="number" step="0.01" name="twelth_percentage" min="0" max="100" placeholder="0 - 100" required value={formData.twelth_percentage} onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-slate-400" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700 ml-1">Post Graduation</label>
                <select name="post_graduation" required value={formData.post_graduation} onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all">
                  <option value="" disabled>Select PG</option>
                  <option value="0">No</option>
                  <option value="1">Yes</option>
                </select>
              </div>
            </div>

            {/* Section 2: Career Information */}
            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-4">
              <h3 className="text-lg font-bold text-slate-800 pb-2 border-b-2 border-orange-100 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-primary" /> Career Information
              </h3>
              
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700 ml-1">Job Role</label>
                <select name="job_role" required value={formData.job_role} onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all">
                  <option value="" disabled>Select Job Role</option>
                  <option value="0">Android Studio</option>
                  <option value="1">C</option>
                  <option value="2">C++</option>
                  <option value="3">Data Analytics</option>
                  <option value="4">Data Science</option>
                  <option value="5">Frontend</option>
                  <option value="6">Full Stack</option>
                  <option value="7">Java</option>
                  <option value="8">Node JS</option>
                  <option value="9">Python</option>
                  <option value="10">React</option>
                </select>
              </div>
              
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700 ml-1">Target Company</label>
                <select name="company_name" required value={formData.company_name} onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all">
                  <option value="" disabled>Select Company</option>
                  <option value="0">Accenture India</option>
                  <option value="1">Amazon India</option>
                  <option value="22">Infosys</option>
                  <option value="43">TCS</option>
                  <option value="47">Wipro</option>
                  <option value="24">Kotak Mahindra Bank</option>
                  <option value="19">HDFC Bank</option>
                  <option value="37">Reliance Jio</option>
                  <option value="14">Flipkart</option>
                  <option value="9">Capgemini</option>
                  <option value="10">Cognizant</option>
                  <option value="8">Byju's</option>
                  <option value="48">Zoho</option>
                  <option value="49">Zomato</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700 ml-1">Soft Skills</label>
                <select name="soft_skills" required value={formData.soft_skills} onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all">
                  <option value="" disabled>Select Soft Skill</option>
                  <option value="0">Adaptability</option>
                  <option value="1">Communication</option>
                  <option value="2">Emotional Intelligence</option>
                  <option value="3">Data</option>
                  <option value="4">Leadership</option>
                  <option value="5">Problem Solving</option>
                  <option value="6">Teamwork</option>
                  <option value="7">Time Management</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700 ml-1">Expected Salary (₹)</label>
                <input type="number" name="salary" min="0" required value={formData.salary} onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700 ml-1">Internship</label>
                  <select name="internship" required value={formData.internship} onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all">
                    <option value="" disabled>Select</option>
                    <option value="0">No</option>
                    <option value="1">Yes</option>
                  </select>
                </div>
                
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700 ml-1">Experience</label>
                  <select name="experience" required value={formData.experience} onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all">
                    <option value="" disabled>Select</option>
                    <option value="0">No</option>
                    <option value="1">Yes</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700 ml-1">Interview Rounds</label>
                <input type="number" name="round" min="1" max="10" required value={formData.round} onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" />
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm text-center animate-in slide-in-from-top-2">
                {errorMessage}
              </div>
            )}

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={loading}
              className="mt-2 w-full bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-2xl py-4 shadow-lg shadow-orange-500/20 active:scale-[0.98] transition-all disabled:opacity-70 disabled:active:scale-100 flex items-center justify-center gap-2"
            >
              <Rocket className="w-5 h-5" />
              Predict Placement
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
