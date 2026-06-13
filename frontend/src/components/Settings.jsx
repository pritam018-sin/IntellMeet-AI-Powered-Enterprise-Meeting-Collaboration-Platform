import React, { useState } from 'react';
import { User, Mail, Lock, Camera, CheckCircle2, AlertCircle } from 'lucide-react';
import api from '../utils/api';

export default function Settings({ user, setUser }) {
  const [name, setName] = useState(user?.name || '');
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [profileMessage, setProfileMessage] = useState('');
  const [profileError, setProfileError] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);

  const [pwdMessage, setPwdMessage] = useState('');
  const [pwdError, setPwdError] = useState('');
  const [pwdLoading, setPwdLoading] = useState(false);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileMessage('');
    setProfileError('');
    setProfileLoading(true);

    try {
      // 1. Update Account Details (Name)
      const detailsRes = await api.put('/users/update-account', { name });
      let updatedUser = detailsRes.data.data;

      // 2. Update Avatar if selected
      if (avatar) {
        const formData = new FormData();
        formData.append('avatar', avatar);
        const avatarRes = await api.put('/users/update-avatar', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        updatedUser = avatarRes.data.data;
      }

      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setProfileMessage('Profile details updated successfully!');
      setAvatar(null);
    } catch (err) {
      setProfileError(err.response?.data?.message || 'Failed to update profile settings.');
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPwdMessage('');
    setPwdError('');
    setPwdLoading(true);

    if (newPassword !== confirmPassword) {
      setPwdError('New passwords do not match.');
      setPwdLoading(false);
      return;
    }

    try {
      await api.put('/users/change-password', {
        currentPassword,
        newPassword,
      });
      setPwdMessage('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPwdError(err.response?.data?.message || 'Failed to change password. Double check current password.');
    } finally {
      setPwdLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 text-left">
      <h1 className="text-3xl font-extrabold text-white mb-2">Account Settings</h1>
      <p className="text-slate-400 mt-1 text-sm mb-10">Manage your profile details, avatar uploads, and password security credentials.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Profile Settings form */}
        <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-6">
          <h3 className="text-lg font-bold text-white border-b border-white/5 pb-3">Profile Information</h3>

          {profileMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="h-4.5 w-4.5" />
              <span>{profileMessage}</span>
            </div>
          )}

          {profileError && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="h-4.5 w-4.5" />
              <span>{profileError}</span>
            </div>
          )}

          <form onSubmit={handleProfileSubmit} className="space-y-4">
            
            {/* Avatar upload in settings */}
            <div className="flex items-center gap-4 bg-slate-950/40 p-3 rounded-xl border border-white/5">
              <div className="relative group cursor-pointer h-16 w-16 rounded-full overflow-hidden border border-white/10 shrink-0">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar preview" className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full bg-slate-800 flex items-center justify-center font-bold text-indigo-400">
                    {name ? name[0].toUpperCase() : 'U'}
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="h-4 w-4 text-white" />
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-300">Change Profile Image</span>
                <p className="text-[10px] text-slate-500 mt-0.5">Click the thumbnail to choose an image file.</p>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">
                Email Address (Read Only)
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600" />
                <input
                  type="email"
                  readOnly
                  value={user?.email || ''}
                  className="w-full pl-9 pr-4 py-2 bg-slate-900/40 border border-white/5 rounded-xl text-xs text-slate-500 cursor-not-allowed outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-950/60 border border-white/5 focus:border-indigo-500 rounded-xl text-xs text-white placeholder-slate-600 outline-none transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={profileLoading}
              className="w-full py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white disabled:bg-indigo-600/50 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
            >
              {profileLoading ? 'Updating Profile...' : 'Save Settings'}
            </button>
          </form>
        </div>

        {/* Change Password settings form */}
        <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-6">
          <h3 className="text-lg font-bold text-white border-b border-white/5 pb-3">Change Password</h3>

          {pwdMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="h-4.5 w-4.5" />
              <span>{pwdMessage}</span>
            </div>
          )}

          {pwdError && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="h-4.5 w-4.5" />
              <span>{pwdError}</span>
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">
                Current Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-4 py-2 bg-slate-950/60 border border-white/5 focus:border-indigo-500 rounded-xl text-xs text-white placeholder-slate-600 outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-4 py-2 bg-slate-950/60 border border-white/5 focus:border-indigo-500 rounded-xl text-xs text-white placeholder-slate-600 outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-4 py-2 bg-slate-950/60 border border-white/5 focus:border-indigo-500 rounded-xl text-xs text-white placeholder-slate-600 outline-none transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={pwdLoading}
              className="w-full py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white disabled:bg-indigo-600/50 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
            >
              {pwdLoading ? 'Changing Password...' : 'Update Password'}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
