import React, { useState, useEffect, useContext, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaUserCircle, FaEnvelope, FaCamera, FaSave, FaEdit } from 'react-icons/fa';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';

const ProfilePage = () => {
  const { user, updateProfile } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    bio: ''
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        bio: user.bio || ''
      });
      setAvatarPreview(user.avatar || '');
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
      setIsEditing(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const data = new FormData();
    data.append('username', formData.username);
    data.append('email', formData.email);
    data.append('bio', formData.bio);
    if (avatarFile) {
      data.append('avatar', avatarFile);
    }

    const result = await updateProfile(data);
    setLoading(false);
    
    if (result.success) {
      toast.success('Profile updated successfully');
      setIsEditing(false);
    } else {
      toast.error('Failed to update profile');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-10 pb-20">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">
            My <span className="text-[var(--color-brand-primary)]">Profile</span>
          </h1>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100"
        >
          <div className="h-32 bg-gradient-to-r from-[var(--color-brand-primary)] to-[var(--color-brand-secondary)]"></div>
          
          <div className="px-8 pb-8">
            <form onSubmit={handleSubmit}>
              {/* Avatar Section */}
              <div className="relative flex justify-between items-end -mt-16 mb-8">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-slate-200 flex items-center justify-center">
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <FaUserCircle className="w-full h-full text-slate-400" />
                    )}
                  </div>
                  
                  {isEditing && (
                    <div 
                      className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer border-4 border-transparent"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <FaCamera className="text-white text-2xl" />
                    </div>
                  )}
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                </div>
                
                <div>
                  {!isEditing ? (
                    <button 
                      type="button" 
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full font-medium transition-colors"
                    >
                      <FaEdit /> Edit Profile
                    </button>
                  ) : (
                    <div className="flex gap-3">
                      <button 
                        type="button" 
                        onClick={() => {
                          setIsEditing(false);
                          setFormData({ username: user.username, email: user.email, bio: user.bio });
                          setAvatarPreview(user.avatar);
                          setAvatarFile(null);
                        }}
                        className="px-5 py-2.5 border border-slate-200 text-slate-600 rounded-full font-medium hover:bg-slate-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit" 
                        disabled={loading}
                        className="flex items-center gap-2 px-5 py-2.5 bg-[var(--color-brand-primary)] hover:bg-[var(--color-brand-secondary)] text-white rounded-full font-medium transition-colors disabled:opacity-70"
                      >
                        {loading ? <LoadingSpinner size="small" text="" /> : <><FaSave /> Save</>}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
                    <FaUserCircle className="text-slate-400" /> Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[var(--color-brand-primary)] outline-none transition-all disabled:bg-slate-50 disabled:text-slate-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
                    <FaEnvelope className="text-slate-400" /> Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[var(--color-brand-primary)] outline-none transition-all disabled:bg-slate-50 disabled:text-slate-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
                    <FaEdit className="text-slate-400" /> Bio
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    disabled={!isEditing}
                    rows="4"
                    placeholder="Write a little about yourself..."
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[var(--color-brand-primary)] outline-none transition-all disabled:bg-slate-50 disabled:text-slate-500 resize-none"
                  ></textarea>
                </div>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;
