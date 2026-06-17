import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaUser, FaBirthdayCake, FaVenusMars, FaGraduationCap, 
  FaCalendarAlt, FaPercentage, FaSchool, FaUniversity, 
  FaCode, FaMoneyBillWave, FaComments, FaBriefcase, 
  FaHistory, FaLayerGroup, FaBuilding, FaRocket 
} from 'react-icons/fa';
import api from '../api/axios';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';

const PredictionPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
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
      const response = await api.post('/predict/', payload);
      // Navigate to result page with the data
      navigate('/prediction/result', { state: { result: response.data } });
    } catch (error) {
      console.error(error);
      toast.error('Failed to generate prediction. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-50 pt-10 pb-20">
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-orange-100 opacity-50"></div>
      
      <div className="max-w-5xl mx-auto px-4 relative z-10">
        <div className="text-center mb-10">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center justify-center p-3 bg-orange-100 rounded-2xl mb-4"
          >
            <FaRocket className="text-3xl text-[var(--color-brand-primary)]" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-4xl font-extrabold text-slate-800 tracking-tight"
          >
            Placement <span className="text-[var(--color-brand-primary)]">Prediction</span>
          </motion.h1>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
            Fill out your details below to see your probability of getting placed and receive personalized AI recommendations.
          </p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl shadow-xl p-8 md:p-10 border border-slate-100"
        >
          <form onSubmit={handleSubmit}>
            {/* Section 1: Personal & Academic Info */}
            <div className="mb-10">
              <h3 className="text-xl font-bold text-slate-800 mb-6 pb-2 border-b-2 border-orange-100 flex items-center gap-2">
                <FaUser className="text-[var(--color-brand-primary)]" /> Personal & Academic Info
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
                    <FaBirthdayCake className="text-slate-400" /> Age
                  </label>
                  <input type="number" name="age" min="18" required value={formData.age} onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[var(--color-brand-primary)] focus:border-transparent outline-none transition-all" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
                    <FaVenusMars className="text-slate-400" /> Gender
                  </label>
                  <select name="gender" required value={formData.gender} onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[var(--color-brand-primary)] focus:border-transparent outline-none transition-all">
                    <option value="" disabled>Select Gender</option>
                    <option value="0">Male</option>
                    <option value="1">Female</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
                    <FaGraduationCap className="text-slate-400" /> Qualification
                  </label>
                  <select name="qualification" required value={formData.qualification} onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[var(--color-brand-primary)] focus:border-transparent outline-none transition-all">
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
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
                    <FaCalendarAlt className="text-slate-400" /> Year
                  </label>
                  <input type="number" name="year" min="2010" max="2080" required value={formData.year} onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[var(--color-brand-primary)] focus:border-transparent outline-none transition-all" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
                    <FaPercentage className="text-slate-400" /> CGPA
                  </label>
                  <input type="number" step="0.01" name="cgpa" min="0" max="10" placeholder="0.0 - 10.0" required value={formData.cgpa} onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[var(--color-brand-primary)] focus:border-transparent outline-none transition-all" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
                    <FaGraduationCap className="text-slate-400" /> Post Graduation
                  </label>
                  <select name="post_graduation" required value={formData.post_graduation} onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[var(--color-brand-primary)] focus:border-transparent outline-none transition-all">
                    <option value="" disabled>Select PG</option>
                    <option value="0">No</option>
                    <option value="1">Yes</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
                    <FaSchool className="text-slate-400" /> 10th Percentage
                  </label>
                  <input type="number" step="0.01" name="ten_percentage" min="0" max="100" placeholder="0 - 100" required value={formData.ten_percentage} onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[var(--color-brand-primary)] focus:border-transparent outline-none transition-all" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
                    <FaUniversity className="text-slate-400" /> 12th Percentage
                  </label>
                  <input type="number" step="0.01" name="twelth_percentage" min="0" max="100" placeholder="0 - 100" required value={formData.twelth_percentage} onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[var(--color-brand-primary)] focus:border-transparent outline-none transition-all" />
                </div>
              </div>
            </div>

            {/* Section 2: Career Information */}
            <div className="mb-10">
              <h3 className="text-xl font-bold text-slate-800 mb-6 pb-2 border-b-2 border-orange-100 flex items-center gap-2">
                <FaBriefcase className="text-[var(--color-brand-primary)]" /> Career Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
                    <FaCode className="text-slate-400" /> Job Role
                  </label>
                  <select name="job_role" required value={formData.job_role} onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[var(--color-brand-primary)] focus:border-transparent outline-none transition-all">
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
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
                    <FaMoneyBillWave className="text-slate-400" /> Expected Salary (₹)
                  </label>
                  <input type="number" name="salary" min="0" required value={formData.salary} onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[var(--color-brand-primary)] focus:border-transparent outline-none transition-all" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
                    <FaComments className="text-slate-400" /> Soft Skills
                  </label>
                  <select name="soft_skills" required value={formData.soft_skills} onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[var(--color-brand-primary)] focus:border-transparent outline-none transition-all">
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
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
                    <FaBriefcase className="text-slate-400" /> Internship
                  </label>
                  <select name="internship" required value={formData.internship} onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[var(--color-brand-primary)] focus:border-transparent outline-none transition-all">
                    <option value="" disabled>Select Internship</option>
                    <option value="0">No</option>
                    <option value="1">Yes</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
                    <FaHistory className="text-slate-400" /> Experience
                  </label>
                  <select name="experience" required value={formData.experience} onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[var(--color-brand-primary)] focus:border-transparent outline-none transition-all">
                    <option value="" disabled>Select Experience</option>
                    <option value="0">No</option>
                    <option value="1">Yes</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
                    <FaLayerGroup className="text-slate-400" /> Interview Rounds
                  </label>
                  <input type="number" name="round" min="1" max="10" required value={formData.round} onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[var(--color-brand-primary)] focus:border-transparent outline-none transition-all" />
                </div>
                
                <div className="md:col-span-2 lg:col-span-3">
                  <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
                    <FaBuilding className="text-slate-400" /> Target Company
                  </label>
                  <select name="company_name" required value={formData.company_name} onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[var(--color-brand-primary)] focus:border-transparent outline-none transition-all">
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
              </div>
            </div>

            <div className="flex justify-center mt-10">
              <button
                type="submit"
                disabled={loading}
                className="group relative overflow-hidden rounded-full bg-gradient-to-r from-[var(--color-brand-primary)] to-[var(--color-brand-secondary)] px-12 py-4 text-white shadow-[0_0_40px_rgba(255,107,53,0.3)] transition-all hover:scale-105 hover:shadow-[0_0_60px_rgba(255,107,53,0.5)] disabled:opacity-70 disabled:hover:scale-100 font-bold text-lg flex items-center gap-3"
              >
                {loading ? <LoadingSpinner size="small" text="Analyzing Profile..." /> : (
                  <>
                    <FaRocket className="group-hover:translate-x-1 transition-transform" />
                    PREDICT PLACEMENT
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default PredictionPage;
