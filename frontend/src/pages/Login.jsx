import React, { useState } from 'react';

import { Link, useNavigate } from 'react-router-dom';
import { useLoginMutation } from '../redux/api/authApi';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [login, { isLoading, error }] = useLoginMutation();

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login({ email, password }).unwrap();
      navigate('/home');
    } catch (err) {
      console.error('Failed to log in:', err);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-transparent px-4 text-white">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur">
        <h1 className="mb-6 text-3xl font-semibold text-center text-white">Welcome Back</h1>
        <p className="text-slate-400 text-center mb-8">Sign in to your account to continue</p>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 placeholder:text-slate-500 transition-all"
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error?.data?.message || 'Failed to login'}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="mt-2 w-full rounded-lg bg-red-600 px-4 py-3 font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-red-500 hover:text-red-400 transition">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
