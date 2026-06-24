import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { 
  useUpdateAccountMutation, 
  useUpdateAvatarMutation, 
  useChangePasswordMutation 
} from '../redux/api/authApi';

const Profile = () => {
  const user = useSelector((state) => state.auth.user);
  
  // State for Account Details (Name)
  const [name, setName] = useState(user?.name || '');
  const [updateAccount, { isLoading: isUpdatingAccount }] = useUpdateAccountMutation();
  const [accountStatus, setAccountStatus] = useState(null);

  // State for Avatar
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [updateAvatar, { isLoading: isUpdatingAvatar }] = useUpdateAvatarMutation();
  const [avatarStatus, setAvatarStatus] = useState(null);

  // State for Password
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();
  const [passwordStatus, setPasswordStatus] = useState(null);

  const handleUpdateAccount = async (e) => {
    e.preventDefault();
    setAccountStatus(null);
    try {
      await updateAccount({ name }).unwrap();
      setAccountStatus({ type: 'success', message: 'Account updated successfully!' });
    } catch (err) {
      setAccountStatus({ type: 'error', message: err?.data?.message || 'Failed to update account' });
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleUpdateAvatar = async (e) => {
    e.preventDefault();
    if (!avatar) return;
    setAvatarStatus(null);
    
    const formData = new FormData();
    formData.append('avatar', avatar);

    try {
      await updateAvatar(formData).unwrap();
      setAvatarStatus({ type: 'success', message: 'Avatar updated successfully!' });
      setAvatar(null); // Clear pending file
    } catch (err) {
      setAvatarStatus({ type: 'error', message: err?.data?.message || 'Failed to update avatar' });
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordStatus(null);
    
    if (newPassword !== confirmPassword) {
      setPasswordStatus({ type: 'error', message: 'New passwords do not match' });
      return;
    }

    try {
      await changePassword({ currentPassword, newPassword }).unwrap();
      setPasswordStatus({ type: 'success', message: 'Password changed successfully!' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPasswordStatus({ type: 'error', message: err?.data?.message || 'Failed to change password' });
    }
  };

  if (!user) {
    return <div className="text-white text-center mt-20">Please log in to view your profile.</div>;
  }

  return (
    <div className="min-h-[calc(100vh-73px)] w-full bg-transparent text-white px-4 py-12 transition-colors duration-300">
      <div className="max-w-3xl mx-auto space-y-8">
        
        <h1 className="text-4xl font-bold mb-8">Your Profile</h1>

        {/* Avatar Section */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur">
          <h2 className="text-2xl font-semibold mb-6">Profile Picture</h2>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-shrink-0">
              {avatarPreview || user?.avatar ? (
                <img 
                  src={avatarPreview || user?.avatar} 
                  alt="Avatar Preview" 
                  className="w-32 h-32 rounded-full object-cover border-4 border-white/10"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-red-900/50 flex items-center justify-center text-4xl text-red-400 font-bold border-4 border-red-800">
                  {user?.name ? user.name[0].toUpperCase() : user?.email[0].toUpperCase()}
                </div>
              )}
            </div>
            <div className="flex-1 w-full">
              <form onSubmit={handleUpdateAvatar} className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Upload New Avatar</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="w-full text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-red-600/20 file:text-red-400 hover:file:bg-red-600/30 transition-all cursor-pointer"
                  />
                </div>
                {avatarStatus && (
                  <p className={`text-sm ${avatarStatus.type === 'error' ? 'text-red-500' : 'text-green-400'}`}>
                    {avatarStatus.message}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={!avatar || isUpdatingAvatar}
                  className="w-full md:w-auto rounded-lg bg-red-600 px-6 py-2 font-semibold text-white transition hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUpdatingAvatar ? 'Uploading...' : 'Save Avatar'}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Account Details Section */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur">
          <h2 className="text-2xl font-semibold mb-6">Account Details</h2>
          <form onSubmit={handleUpdateAccount} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Email (Cannot be changed)</label>
              <input
                type="email"
                value={user?.email}
                disabled
                className="w-full rounded-lg border border-white/5 bg-slate-900/50 px-4 py-3 outline-none text-slate-500 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 placeholder:text-slate-500 transition-all"
                required
              />
            </div>
            
            {accountStatus && (
              <p className={`text-sm ${accountStatus.type === 'error' ? 'text-red-500' : 'text-green-400'}`}>
                {accountStatus.message}
              </p>
            )}

            <button
              type="submit"
              disabled={isUpdatingAccount || name === user?.name}
              className="mt-2 w-full md:w-auto self-start rounded-lg bg-red-600 px-6 py-2 font-semibold text-white transition hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUpdatingAccount ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>

        {/* Change Password Section */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur">
          <h2 className="text-2xl font-semibold mb-6">Change Password</h2>
          <form onSubmit={handleChangePassword} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Current Password</label>
              <input
                type="password"
                placeholder="Enter current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 placeholder:text-slate-500 transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">New Password</label>
              <input
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 placeholder:text-slate-500 transition-all"
                required
                minLength={6}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Confirm New Password</label>
              <input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 placeholder:text-slate-500 transition-all"
                required
                minLength={6}
              />
            </div>

            {passwordStatus && (
              <p className={`text-sm ${passwordStatus.type === 'error' ? 'text-red-500' : 'text-green-400'}`}>
                {passwordStatus.message}
              </p>
            )}

            <button
              type="submit"
              disabled={isChangingPassword}
              className="mt-2 w-full md:w-auto self-start rounded-lg bg-red-600 px-6 py-2 font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
            >
              {isChangingPassword ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default Profile;
