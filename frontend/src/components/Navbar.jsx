import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useTheme } from '../context/ThemeContext';
import { logout } from '../redux/slices/authSlice';

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="w-full bg-white/70 dark:bg-black/20 backdrop-blur-md border-b border-black/10 dark:border-white/10 px-6 py-4 flex items-center justify-between sticky top-0 z-50 transition-colors duration-300">
      <div className="flex items-center gap-6">
        <Link to="/" className="text-2xl font-bold text-red-600 dark:text-red-500 tracking-tight">
          IntellMeet
        </Link>
        {user && (
          <div className="hidden md:flex items-center gap-4">
            <Link to="/" className="text-gray-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 font-medium transition-colors">
              Home
            </Link>
            <Link to="/lobby" className="text-gray-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 font-medium transition-colors">
              Lobby
            </Link>
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-gray-600 dark:text-slate-300"
          aria-label="Toggle Theme"
        >
          {theme === 'light' ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          )}
        </button>

        {user ? (
          <div className="flex items-center gap-4">
            <Link to="/profile" className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
              {user.avatar ? (
                <img src={user.avatar} alt="Avatar" className="w-8 h-8 rounded-full object-cover border border-white/20" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-red-900/50 flex items-center justify-center text-red-400 font-semibold border border-red-800">
                  {user.name ? user.name[0].toUpperCase() : user.email[0].toUpperCase()}
                </div>
              )}
              <span className="hidden md:block text-sm font-medium text-slate-300">
                {user.name || user.email.split('@')[0]}
              </span>
            </Link>
            <button
              onClick={handleLogout}
              className="text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm font-medium text-gray-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 transition-colors">
              Log in
            </Link>
            <Link to="/register" className="text-sm font-medium px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors">
              Sign up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
