import React, { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaChartLine, FaCheckCircle, FaRedo, FaBullseye, FaUser, FaBriefcase } from 'react-icons/fa';

const PredictionResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result;

  useEffect(() => {
    if (!result) {
      navigate('/predict');
    }
  }, [result, navigate]);

  if (!result) return null;

  // The backend returns the full PredictResponse model
  const { label, age, gender, qualification, year, cgpa, job_role, post_graduation,
    ten_percentage, twelth_percentage, salary, soft_skills, internship, experience,
    round, company_name, created_at } = result;

  // Build stats for display
  const statsItems = [
    { name: 'Age', value: age },
    { name: 'Gender', value: gender },
    { name: 'Qualification', value: qualification },
    { name: 'Year', value: year },
    { name: 'CGPA', value: cgpa },
    { name: 'Post Graduation', value: post_graduation },
    { name: '10th %', value: ten_percentage },
    { name: '12th %', value: twelth_percentage },
    { name: 'Job Role', value: job_role },
    { name: 'Salary', value: salary },
    { name: 'Soft Skills', value: soft_skills },
    { name: 'Internship', value: internship },
    { name: 'Experience', value: experience },
    { name: 'Interview Rounds', value: round },
    { name: 'Company', value: company_name },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pt-10 pb-20">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl p-8 mb-8"
        >
          {/* Header */}
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-brand-primary)] to-[var(--color-brand-secondary)] mb-2">
              <FaChartLine className="inline mr-2 text-slate-800" /> Analysis Complete
            </h2>
            {created_at && (
              <p className="text-sm text-slate-500 mt-2">
                Generated on {new Date(created_at).toLocaleString()}
              </p>
            )}
          </div>

          {/* AI Prediction Result */}
          <div className="rounded-2xl p-8 mb-10 border-l-8 bg-gradient-to-r from-orange-50 to-amber-50 border-[var(--color-brand-primary)]">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-[var(--color-brand-primary)] to-[var(--color-brand-secondary)] rounded-2xl flex items-center justify-center shrink-0">
                <FaBullseye className="text-white text-2xl" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">AI Prediction & Analysis</h3>
                <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{label || 'No prediction available.'}</p>
              </div>
            </div>
          </div>

          {/* Input Stats Summary */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2 pb-2 border-b-2 border-orange-100">
              <FaUser className="text-[var(--color-brand-primary)]" /> Your Input Summary
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {statsItems.map((item, index) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * index }}
                  key={index} 
                  className="bg-slate-50 rounded-xl p-4 text-center border border-slate-100"
                >
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{item.name}</div>
                  <div className="text-lg font-bold text-slate-800">{item.value}</div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="mt-10 flex justify-center">
            <Link to="/predict" className="btn bg-gradient-to-r from-[var(--color-brand-primary)] to-[var(--color-brand-secondary)] text-white px-8 py-3 rounded-full font-bold shadow-lg hover:shadow-orange-500/40 hover:-translate-y-1 transition-all flex items-center gap-2">
              <FaRedo /> Run New Prediction
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PredictionResult;

