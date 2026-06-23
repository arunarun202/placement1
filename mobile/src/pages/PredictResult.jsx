import React, { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, Target, User, RefreshCw
} from 'lucide-react';

export default function PredictResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result;

  useEffect(() => {
    if (!result) {
      navigate('/predict', { replace: true });
    }
  }, [result, navigate]);

  if (!result) return null;

  const { label, age, gender, qualification, year, cgpa, job_role, post_graduation,
    ten_percentage, twelth_percentage, salary, soft_skills, internship, experience,
    round, company_name } = result;

  const genderMap = { 0: 'Male', 1: 'Female' };
  const qualificationMap = { 0: 'B.TECH', 1: 'BCA', 2: 'BE', 3: 'BSC', 4: 'DIPLOMA', 5: 'ITI', 6: 'M.TECH', 7: 'MCA', 8: 'MCS' };
  const yesNoMap = { 0: 'No', 1: 'Yes' };
  const jobRoleMap = { 0: 'Android Studio', 1: 'C', 2: 'C++', 3: 'Data Analytics', 4: 'Data Science', 5: 'Frontend', 6: 'Full Stack', 7: 'Java', 8: 'Node JS', 9: 'Python', 10: 'React' };
  const softSkillsMap = { 0: 'Adaptability', 1: 'Communication', 2: 'Emotional Intelligence', 3: 'Data', 4: 'Leadership', 5: 'Problem Solving', 6: 'Teamwork', 7: 'Time Management' };
  const companyMap = { 0: 'Accenture India', 1: 'Amazon India', 22: 'Infosys', 43: 'TCS', 47: 'Wipro', 24: 'Kotak Mahindra Bank', 19: 'HDFC Bank', 37: 'Reliance Jio', 14: 'Flipkart', 9: 'Capgemini', 10: 'Cognizant', 8: "Byju's", 48: 'Zoho', 49: 'Zomato' };

  const statsItems = [
    { name: 'Age', value: age },
    { name: 'Gender', value: genderMap[gender] ?? gender },
    { name: 'Qual', value: qualificationMap[qualification] ?? qualification },
    { name: 'Year', value: year },
    { name: 'CGPA', value: cgpa },
    { name: 'PG', value: yesNoMap[post_graduation] ?? post_graduation },
    { name: '10th %', value: ten_percentage },
    { name: '12th %', value: twelth_percentage },
    { name: 'Role', value: jobRoleMap[job_role] ?? job_role },
    { name: 'Salary', value: salary },
    { name: 'Skills', value: softSkillsMap[soft_skills] ?? soft_skills },
    { name: 'Intern', value: yesNoMap[internship] ?? internship },
    { name: 'Exp', value: yesNoMap[experience] ?? experience },
    { name: 'Rounds', value: round },
    { name: 'Company', value: companyMap[company_name] ?? company_name },
  ];

  const parsePrediction = (text) => {
    if (!text) return { score: null, probLabel: null, explanation: 'No prediction available.' };
    
    let score = null;
    let probLabel = null;
    let explanation;

    const scoreMatch = text.match(/\*?Predicted Score\*?\s*[-:]\s*\*?([^\n*]+)\*?/i);
    if (scoreMatch) score = scoreMatch[1].trim();

    const labelMatch = text.match(/\*?Prediction Label\*?\s*[-:]\s*\*?([^\n*]+)\*?/i);
    if (labelMatch) probLabel = labelMatch[1].trim();

    const expMatch = text.match(/\*?Explanation\*?\s*[-:]\s*([\s\S]+)/i);
    if (expMatch) {
      explanation = expMatch[1].trim();
    } else {
      // fallback
      explanation = text.replace(/\*?Predicted Score.*?\n/ig, '').replace(/\*?Prediction Label.*?\n/ig, '').trim();
    }

    return { score, probLabel, explanation };
  };

  const { score, probLabel, explanation } = parsePrediction(label);

  const getLabelColor = (l) => {
    if (!l) return 'bg-slate-100 text-slate-700 border-slate-200';
    const lower = l.toLowerCase();
    if (lower.includes('high')) return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    if (lower.includes('medium')) return 'bg-amber-100 text-amber-800 border-amber-200';
    if (lower.includes('low')) return 'bg-rose-100 text-rose-800 border-rose-200';
    return 'bg-indigo-100 text-indigo-800 border-indigo-200';
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
            Analysis Complete
          </h1>
        </div>
      </div>

      <div className="px-5 pt-6 space-y-6">
        
        {/* Prediction Cards */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col items-center justify-center gap-2 relative overflow-hidden">
            <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Score</span>
            <div className="text-3xl font-black text-primary">
              {score || '--'}
            </div>
          </div>
          
          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col items-center justify-center gap-2 relative overflow-hidden text-center">
            <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Prediction</span>
            <div className={`px-4 py-1.5 rounded-full text-sm font-bold border ${getLabelColor(probLabel)}`}>
              {probLabel || 'Unknown'}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border-l-4 border-indigo-500 shadow-sm flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-indigo-500" />
            <h3 className="text-lg font-bold text-slate-800">AI Explanation</h3>
          </div>
          <ul className="list-disc pl-5 space-y-2 text-slate-700 text-base font-medium">
            {(() => {
              let lines = explanation.split('\n')
                .map(line => line.trim().replace(/^[-*]\s*/, ''))
                .filter(line => line.length > 0);
              
              // Force split into sentences if it returned a single block of text
              if (lines.length === 1 && lines[0].length > 60) {
                lines = lines[0].replace(/([.!?])\s+(?=[A-Z])/g, '$1\n').split('\n')
                  .map(line => line.trim().replace(/^[-*]\s*/, ''))
                  .filter(line => line.length > 0);
              }

              return lines.map((point, index) => {
                const parts = point.split(/\*\*(.*?)\*\*/g);
                return (
                  <li key={index}>
                    {parts.map((part, i) => i % 2 === 1 ? <strong key={i} className="font-bold text-slate-900">{part}</strong> : part)}
                  </li>
                );
              });
            })()}
          </ul>
        </div>

        {/* Input Summary */}
        <div>
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-primary" /> Your Input Summary
          </h3>
          
          <div className="grid grid-cols-3 gap-3">
            {statsItems.map((item, index) => (
              <div key={index} className="bg-white rounded-2xl p-3 border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{item.name}</span>
                <span className="text-sm font-semibold text-slate-800 leading-tight truncate w-full px-1">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Retry Button */}
        <Link 
          to="/predict" 
          className="mt-4 w-full bg-slate-800 text-white font-bold rounded-2xl py-4 shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          <RefreshCw className="w-5 h-5" />
          Run New Prediction
        </Link>
        
      </div>
    </div>
  );
}
