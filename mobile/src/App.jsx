import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ResumeUpload from './pages/ResumeUpload';
import ResumeResult from './pages/ResumeResult';
import Predict from './pages/Predict';
import PredictResult from './pages/PredictResult';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/resume" element={<ResumeUpload />} />
      <Route path="/resume/result/:id" element={<ResumeResult />} />
      <Route path="/predict" element={<Predict />} />
      <Route path="/prediction/result" element={<PredictResult />} />
    </Routes>
  );
}

export default App;
