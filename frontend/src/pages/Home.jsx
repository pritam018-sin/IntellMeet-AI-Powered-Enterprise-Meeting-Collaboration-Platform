import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useCreateMeetingMutation, useGetMyMeetingsQuery } from '../redux/api/meetingApi';
import { useSocket } from '../context/SocketProvider';

const HomePage = () => {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const [createMeeting, { isLoading: isCreating }] = useCreateMeetingMutation();
  const { data: meetingsResponse, isLoading: isLoadingMeetings, refetch } = useGetMyMeetingsQuery(undefined, { skip: !user });
  const meetings = meetingsResponse?.data || [];

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [meetingTitle, setMeetingTitle] = useState('');
  const [createError, setCreateError] = useState('');

  const handleCreateMeeting = async (e) => {
    e.preventDefault();
    if (!meetingTitle.trim()) {
      setCreateError('Please enter a meeting title');
      return;
    }
    setCreateError('');
    try {
      const response = await createMeeting(meetingTitle).unwrap();
      const meetingCode = response.data.meetingCode;
      
      // Navigate to the video room for preview
      navigate(`/room/${meetingCode}`);
    } catch (err) {
      setCreateError(err?.data?.message || 'Failed to create meeting');
    }
  };

  return (
    <div className="min-h-[calc(100vh-73px)] w-full bg-transparent text-slate-900 dark:text-white transition-colors duration-300">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-20 lg:py-32 flex flex-col lg:flex-row items-center justify-between gap-12">
        
        {/* Text Content */}
        <div className="flex-1 text-center lg:text-left space-y-8 relative z-10">
          <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight">
            Meetings that <br/>
            <span className="text-red-600 dark:text-red-500">Inspire.</span>
          </h1>
          <p className="text-lg lg:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto lg:mx-0">
            IntellMeet brings your team together with seamless, high-quality video conferencing. Secure, fast, and beautifully designed.
          </p>
          
          <div className="flex flex-col items-center lg:items-start gap-4 pt-4">
            {user ? (
              <div className="flex flex-col sm:flex-row gap-4 w-full justify-center lg:justify-start">
                {!showCreateForm ? (
                  <>
                    <button 
                      onClick={() => setShowCreateForm(true)}
                      className="w-full sm:w-auto px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl shadow-lg shadow-red-600/30 transition-all transform hover:-translate-y-1"
                    >
                      New Meeting
                    </button>
                    <Link 
                      to="/lobby"
                      className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-white/10 border-2 border-red-500/30 dark:border-white/20 text-slate-800 dark:text-white hover:border-red-500 font-semibold rounded-xl transition-all flex items-center justify-center shadow-sm dark:shadow-none"
                    >
                      Join via Code
                    </Link>
                  </>
                ) : (
                  <form onSubmit={handleCreateMeeting} className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
                    <div className="flex-1">
                      <input 
                        type="text" 
                        placeholder="Meeting Title" 
                        value={meetingTitle}
                        onChange={(e) => setMeetingTitle(e.target.value)}
                        className="w-full rounded-lg border border-red-500/30 dark:border-white/10 bg-white dark:bg-slate-900/80 px-4 py-4 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-slate-900 dark:text-white shadow-sm dark:shadow-none"
                        autoFocus
                      />
                      {createError && <p className="text-red-500 text-sm mt-1">{createError}</p>}
                    </div>
                    <div className="flex gap-2">
                      <button 
                        type="submit"
                        disabled={isCreating}
                        className="px-6 py-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl shadow-lg transition-all disabled:opacity-50"
                      >
                        {isCreating ? 'Creating...' : 'Start'}
                      </button>
                      <button 
                        type="button"
                        onClick={() => setShowCreateForm(false)}
                        className="px-6 py-4 bg-white dark:bg-white/10 hover:bg-slate-100 dark:hover:bg-white/20 text-slate-800 dark:text-white border border-red-500/30 dark:border-transparent font-semibold rounded-xl transition-all shadow-sm dark:shadow-none"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 w-full justify-center lg:justify-start">
                <Link 
                  to="/register"
                  className="w-full sm:w-auto px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl shadow-lg shadow-red-600/30 transition-all transform hover:-translate-y-1 text-center"
                >
                  Get Started for Free
                </Link>
                <Link 
                  to="/login"
                  className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-white/10 border-2 border-red-500/30 dark:border-white/20 text-slate-800 dark:text-white hover:border-red-500 font-semibold rounded-xl transition-all text-center shadow-sm dark:shadow-none"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Hero Image/Graphic */}
        <div className="flex-1 w-full max-w-lg relative">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-red-400 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-red-600 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-orange-400 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob animation-delay-4000"></div>
          
          <div className="relative rounded-2xl border border-red-500/30 dark:border-white/10 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm p-2 shadow-2xl overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=2070&auto=format&fit=crop" 
              alt="Video Meeting" 
              className="rounded-xl w-full h-auto object-cover opacity-80"
            />
            
            {/* Mock UI Overlay */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-3 px-6 py-3 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur border border-red-500/30 dark:border-white/10 shadow-lg">
              <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white cursor-pointer hover:bg-red-500 transition">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                </svg>
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-white cursor-pointer hover:bg-slate-600 transition">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-red-400 cursor-pointer hover:bg-slate-600 transition">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Recent Meetings Section (Only if logged in) */}
      {user && (
        <div className="max-w-7xl mx-auto px-6 pb-20 relative z-10">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Your Recent Meetings</h2>
            <button onClick={refetch} className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 transition">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>
          
          {isLoadingMeetings ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-40 rounded-2xl bg-white/5 animate-pulse border border-white/5"></div>
              ))}
            </div>
          ) : meetings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {meetings.map((meeting) => (
                <div key={meeting._id} className="rounded-2xl border border-red-500/40 dark:border-red-500/50 bg-white dark:bg-white/5 p-6 hover:border-red-500 dark:hover:bg-white/10 transition-colors flex flex-col justify-between shadow-sm dark:shadow-none">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-semibold truncate pr-2">{meeting.title}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${meeting.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-slate-500/20 text-slate-400'}`}>
                        {meeting.status}
                      </span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">Code: <span className="text-slate-900 dark:text-slate-200 font-mono tracking-wider">{meeting.meetingCode}</span></p>
                    <div className="flex -space-x-2 overflow-hidden mb-4">
                      {meeting.participants.map((p, i) => (
                        <div key={i} className="inline-block h-8 w-8 rounded-full ring-2 ring-slate-900 bg-red-900/50 flex items-center justify-center text-xs font-medium text-white">
                          {p.user?.avatar ? (
                            <img src={p.user.avatar} className="h-full w-full rounded-full object-cover" alt="" />
                          ) : (
                            (p.user?.name || p.user?.email || '?')[0].toUpperCase()
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  {meeting.status === 'active' ? (
                    <Link 
                      to={`/room/${meeting.meetingCode}`}
                      className="w-full py-2 bg-red-50 dark:bg-white/10 hover:bg-red-600 text-red-600 hover:text-white dark:text-white rounded-lg text-center transition-colors text-sm font-medium border border-red-100 dark:border-transparent"
                    >
                      Rejoin Meeting
                    </Link>
                  ) : (
                    <div className="flex flex-col gap-2">
                        <Link 
                          to={`/meeting/${meeting._id}`}
                          className="w-full py-2 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 rounded-lg text-center text-sm font-medium transition-colors border border-slate-200 dark:border-transparent"
                        >
                          View Details
                        </Link>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 rounded-2xl border border-red-500/30 dark:border-white/10 bg-white dark:bg-white/5 shadow-sm dark:shadow-none">
              <p className="text-slate-500 dark:text-slate-400">No recent meetings found.</p>
            </div>
          )}
        </div>
      )}

      {/* Features Section */}
      <div className="bg-white/60 dark:bg-white/5 py-20 border-t border-red-500/20 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-red-900/30 text-red-400 rounded-2xl flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Secure Meetings</h3>
              <p className="text-slate-600 dark:text-slate-400">End-to-end encryption guarantees that your meetings are completely private and secure.</p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-red-900/30 text-red-400 rounded-2xl flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Lightning Fast</h3>
              <p className="text-slate-600 dark:text-slate-400">Optimized WebRTC connections ensure crystal-clear video with minimal latency worldwide.</p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-red-900/30 text-red-400 rounded-2xl flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Collaborate Easily</h3>
              <p className="text-slate-600 dark:text-slate-400">Join instantly with a simple room code. No downloads required, just share the link and meet.</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default HomePage;