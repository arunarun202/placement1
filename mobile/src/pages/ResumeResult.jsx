import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';
import { ArrowLeft, Lightbulb, Briefcase, GraduationCap, Trophy, FileText } from 'lucide-react';

export default function ResumeResult() {
  const { id } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const response = await api.get(`/resume/${id}`);
        setResult(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchResult();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col pt-20">
        <LoadingSpinner text="Loading Analysis..." />
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-xl font-bold text-slate-800">Result not found</h2>
        <Link to="/resume" className="mt-4 px-6 py-3 bg-primary text-white font-medium rounded-full">
          Go back to upload
        </Link>
      </div>
    );
  }

  const ats_score = result.ats_score || 0;
  const suggestionsText = result.suggestions || '';
  const suggestionsList = suggestionsText
    .split(/\n|(?<=\.)\s+/)
    .map(s => s.trim())
    .filter(s => s.length > 0);
  
  const course_products = result.course_products || [];
  const role_courses = result.role_courses || [];
  const alternative_roles = result.alternative_roles || [];
  const allCourses = [...new Set([...course_products, ...role_courses])];

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-500 stroke-green-500';
    if (score >= 60) return 'text-yellow-500 stroke-yellow-500';
    return 'text-red-500 stroke-red-500';
  };

  const getScoreBg = (score) => {
    if (score >= 80) return 'bg-green-50 border-green-500';
    if (score >= 60) return 'bg-yellow-50 border-yellow-500';
    return 'bg-red-50 border-red-500';
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
            Analysis Result
          </h1>
        </div>
      </div>

      <div className="px-5 pt-6 space-y-6">
        
        {/* ATS Score Section */}
        <div className={`rounded-3xl p-6 border-t-4 shadow-sm flex flex-col items-center text-center ${getScoreBg(ats_score)}`}>
          <h2 className="text-lg font-bold text-slate-800 mb-4">ATS Compatibility</h2>
          
          <div className="relative w-40 h-40 mb-2">
            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
              <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="8" />
              <circle 
                cx="50" cy="50" r="45" fill="none" 
                strokeWidth="8" 
                strokeDasharray={`${ats_score * 2.827} 282.7`} 
                strokeLinecap="round" 
                className={`transition-all duration-1000 ease-out ${getScoreColor(ats_score).split(' ')[1]}`}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-4xl font-black ${getScoreColor(ats_score).split(' ')[0]}`}>
                {ats_score}%
              </span>
            </div>
          </div>
          
          <p className="text-slate-700 text-sm font-medium mt-2">
            {ats_score >= 80 ? "Excellent! Highly ATS-friendly." : 
             ats_score >= 60 ? "Good, but needs some optimization." : 
             "Needs significant improvement."}
          </p>
        </div>

        {/* Resume Details Card */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 flex gap-4 items-center">
          <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center shrink-0">
            <FileText className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-slate-800 text-sm truncate">{result.name}</h3>
            <p className="text-xs text-primary font-medium truncate">{result.job_role}</p>
          </div>
        </div>

        {/* Key Suggestions */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-500" /> Key Suggestions
          </h3>
          {suggestionsList.length > 0 ? (
            <ul className="space-y-3">
              {suggestionsList.slice(0, 5).map((suggestion, index) => (
                <li key={index} className="flex items-start gap-3 text-slate-700 text-sm bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <span className="text-primary mt-0.5">•</span>
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-slate-700 text-sm bg-slate-50 p-4 rounded-2xl border border-slate-100 whitespace-pre-wrap">
              {suggestionsText || 'No specific suggestions available.'}
            </p>
          )}
        </div>

        {/* Alternative Roles */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-primary" /> Alternative Roles
          </h3>
          <div className="flex flex-wrap gap-2">
            {alternative_roles.map((role, index) => (
              <div key={index} className="bg-slate-50 border border-slate-200 text-slate-700 text-xs px-3 py-1.5 rounded-full font-medium">
                {role}
              </div>
            ))}
            {alternative_roles.length === 0 && (
              <p className="text-slate-500 text-sm">No alternative roles generated.</p>
            )}
          </div>
        </div>

        {/* Recommended Courses */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-primary" /> Recommended Courses
          </h3>
          <div className="space-y-3">
            {allCourses.map((course, index) => (
              <div key={index} className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center shrink-0">
                  <Trophy className="w-4 h-4 text-primary" />
                </div>
                <span className="font-medium text-slate-700 text-sm leading-tight">{course}</span>
              </div>
            ))}
            {allCourses.length === 0 && (
              <p className="text-slate-500 text-sm">No courses recommended.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
