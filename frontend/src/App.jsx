import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import KanbanBoard from './components/KanbanBoard';
import Settings from './components/Settings';
import MeetingRoom from './components/MeetingRoom';

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user session from localStorage on startup
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (err) {
      console.warn('Failed to parse user session from storage:', err);
    } finally {
      setLoading(false);
    }

    // Interceptor logout listener (triggered from api.js on session expiry)
    const handleAuthLogout = () => {
      setUser(null);
      localStorage.removeItem('user');
    };
    window.addEventListener('auth-logout', handleAuthLogout);
    return () => window.removeEventListener('auth-logout', handleAuthLogout);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="h-10 w-10 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
      </div>
    );
  }

  // Helper component to guard authenticated pages
  const ProtectedRoute = ({ children }) => {
    return user ? children : <Navigate to="/login" replace />;
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-dark-bg flex flex-col justify-between">
        {/* Global Navigation Header */}
        <Navbar user={user} setUser={setUser} />

        {/* Page Switch Routing */}
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            
            <Route 
              path="/login" 
              element={user ? <Navigate to="/dashboard" replace /> : <Login setUser={setUser} />} 
            />
            
            <Route 
              path="/register" 
              element={user ? <Navigate to="/dashboard" replace /> : <Register />} 
            />

            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard user={user} />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/workspace" 
              element={
                <ProtectedRoute>
                  <KanbanBoard />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/settings" 
              element={
                <ProtectedRoute>
                  <Settings user={user} setUser={setUser} />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/room/:roomId" 
              element={
                <ProtectedRoute>
                  <MeetingRoom user={user} />
                </ProtectedRoute>
              } 
            />

            {/* Fallback Catch-All Route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Dynamic footer */}
        <footer className="py-6 border-t border-white/5 bg-slate-950/20 text-center shrink-0">
          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} IntellMeet. All rights reserved. Developed for Zidio domains.
          </p>
        </footer>
      </div>
    </BrowserRouter>
  );
}
