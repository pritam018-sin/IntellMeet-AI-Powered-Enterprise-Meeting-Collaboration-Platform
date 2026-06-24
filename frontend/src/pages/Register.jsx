import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useRegisterMutation } from '../redux/api/authApi';
import { setCredentials } from '../redux/slices/authSlice';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [register, { isLoading, error }] = useRegisterMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('password', password);
      if (avatar) {
        formData.append('avatar', avatar);
      }
      
      await register(formData).unwrap();
      // Registration only returns user data, not tokens. Redirect to login.
      navigate('/login');
    } catch (err) {
      console.error('Failed to register:', err);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-transparent px-4 text-white">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur">
        <h1 className="mb-6 text-3xl font-semibold text-center text-white">Create Account</h1>
        <p className="text-slate-400 text-center mb-8">Join IntellMeet to start collaborating</p>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
            <input
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 placeholder:text-slate-500 transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 placeholder:text-slate-500 transition-all"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
            <input
              type="password"
              placeholder="Create a strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 placeholder:text-slate-500 transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Profile Avatar (Optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setAvatar(e.target.files[0])}
              className="w-full text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-red-600/20 file:text-red-400 hover:file:bg-red-600/30 transition-all"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error?.data?.message || 'Failed to register'}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="mt-2 w-full rounded-lg bg-red-600 px-4 py-3 font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
          >
            {isLoading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="text-red-500 hover:text-red-400 transition">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
