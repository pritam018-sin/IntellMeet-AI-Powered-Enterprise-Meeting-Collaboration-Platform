import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Video, PlusCircle, ArrowRight, Calendar, Clock, BarChart2, CheckCircle2, ChevronRight, MessageSquare, Award } from 'lucide-react';

export default function Dashboard({ user }) {
  const navigate = useNavigate();
  const [meetingIdInput, setMeetingIdInput] = useState('');
  const [selectedMeeting, setSelectedMeeting] = useState(null);

  // Mock past meetings with AI intelligence output
  const mockMeetings = [
    {
      id: 'meet-9831-2911',
      title: 'Q2 Sprint Planning',
      date: 'June 12, 2026',
      duration: '45 mins',
      participants: 5,
      summary: 'Discussed timeline adjustments, updated the sprint backlog, and allocated feature tasks to Sarah and Marcus. Identified deployment blockers.',
      actionItems: [
        { task: 'Finalize Q2 project backlog sheet', owner: 'Sarah', status: 'completed' },
        { task: 'Prepare slide deck for marketing team', owner: 'Marcus', status: 'pending' },
        { task: 'Configure testing environment paths', owner: 'Dave', status: 'pending' }
      ]
    },
    {
      id: 'meet-1284-8842',
      title: 'AI Product Alignment Meeting',
      date: 'June 10, 2026',
      duration: '30 mins',
      participants: 3,
      summary: 'Reviewed Whisper transcription options and GPT API token optimizations. Established latency limits for the real-time websocket connections.',
      actionItems: [
        { task: 'Optimize OpenAI Whisper token compression', owner: 'Alice', status: 'completed' },
        { task: 'Test Socket.io server connection bottlenecks', owner: 'Bob', status: 'completed' }
      ]
    },
    {
      id: 'meet-4552-3118',
      title: 'Marketing Weekly Sync',
      date: 'June 08, 2026',
      duration: '50 mins',
      participants: 8,
      summary: 'Reviewed newsletter open rates, updated product landing graphics, and scheduled post-launch LinkedIn posts.',
      actionItems: [
        { task: 'Review new newsletter graphic layouts', owner: 'Clara', status: 'pending' },
        { task: 'Draft LinkedIn launch press release', owner: 'Alex', status: 'pending' }
      ]
    }
  ];

  const createMeeting = () => {
    // Generate a random meeting code: meet-xxxx-xxxx
    const randPart1 = Math.floor(1000 + Math.random() * 9000);
    const randPart2 = Math.floor(1000 + Math.random() * 9000);
    const generatedId = `meet-${randPart1}-${randPart2}`;
    navigate(`/room/${generatedId}`);
  };

  const handleJoinMeeting = (e) => {
    e.preventDefault();
    if (meetingIdInput.trim()) {
      navigate(`/room/${meetingIdInput.trim()}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 text-left">
      {/* Top Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 animate-fade-in">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Welcome, {user?.name || 'User'}!</h1>
          <p className="text-slate-400 mt-1 text-sm">Organize and join meetings, review AI transcriptions, and check team tasks.</p>
        </div>
        
        {/* User Card */}
        <div className="flex items-center gap-3.5 glass-panel p-3.5 rounded-xl border border-white/5 bg-slate-900/40">
          {user?.avatar ? (
            <img src={user.avatar} alt="Avatar" className="h-10 w-10 rounded-full object-cover border border-white/10" />
          ) : (
            <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-indigo-400">
              {user?.name ? user.name[0].toUpperCase() : 'U'}
            </div>
          )}
          <div>
            <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Role Access</div>
            <div className="text-sm font-bold text-white flex items-center gap-1">
              <Award className="h-3.5 w-3.5 text-indigo-400" />
              {user?.role === 'admin' ? 'Workspace Admin' : 'Workspace Member'}
            </div>
          </div>
        </div>
      </div>

      {/* Main Core Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        
        {/* Left/Center widgets: Quick actions & Meetings Log */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Quick Actions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Create Room Card */}
            <div className="glass-panel p-6 rounded-2xl border border-white/5 relative overflow-hidden group hover:border-indigo-500/25 transition-all">
              <div className="absolute top-0 right-0 p-8 opacity-5 shrink-0">
                <Video className="h-24 w-24 text-indigo-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Create New Meeting</h3>
              <p className="text-xs text-slate-400 mb-6 leading-relaxed">Instant HD audio/video room with real-time AI transcription, whiteboard, and collaborative notes.</p>
              <button
                onClick={createMeeting}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold bg-indigo-600 hover:bg-indigo-500 transition-all text-white shadow-lg shadow-indigo-600/10 cursor-pointer"
              >
                <PlusCircle className="h-4.5 w-4.5" />
                Start Meeting
              </button>
            </div>

            {/* Join Room Card */}
            <div className="glass-panel p-6 rounded-2xl border border-white/5 relative overflow-hidden group hover:border-indigo-500/25 transition-all">
              <div className="absolute top-0 right-0 p-8 opacity-5 shrink-0">
                <ArrowRight className="h-24 w-24 text-indigo-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Join with Meeting ID</h3>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">Enter an active meeting room code or invite link to join your team members instantly.</p>
              
              <form onSubmit={handleJoinMeeting} className="flex gap-2">
                <input
                  type="text"
                  required
                  placeholder="meet-xxxx-xxxx"
                  value={meetingIdInput}
                  onChange={(e) => setMeetingIdInput(e.target.value)}
                  className="flex-1 px-4 py-2.5 bg-slate-950/60 border border-white/5 focus:border-indigo-500 rounded-xl text-xs text-white placeholder-slate-600 outline-none"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 transition-all text-slate-200 border border-white/10"
                >
                  Join Room
                </button>
              </form>
            </div>

          </div>

          {/* Past Meetings & Transcripts log */}
          <div className="glass-panel p-6 rounded-2xl border border-white/5">
            <h3 className="text-lg font-bold text-white mb-6">Recent Meetings & AI Insights</h3>
            
            <div className="space-y-4">
              {mockMeetings.map((meet) => (
                <div
                  key={meet.id}
                  onClick={() => setSelectedMeeting(meet)}
                  className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-slate-950/20 hover:bg-slate-950/60 hover:border-indigo-500/20 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-center text-indigo-400">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">
                        {meet.title}
                      </h4>
                      <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                        <span>{meet.date}</span>
                        <span>•</span>
                        <span>{meet.duration}</span>
                        <span>•</span>
                        <span>{meet.participants} participants</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/20">
                      AI Summarized
                    </span>
                    <ChevronRight className="h-4 w-4 text-slate-500 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right side: Analytics & Scheduled Events summary */}
        <div className="space-y-8">
          
          {/* Analytics Overview */}
          <div className="glass-panel p-6 rounded-2xl border border-white/5 text-left">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <BarChart2 className="h-5 w-5 text-indigo-400" />
                Productivity Metrics
              </h3>
              <span className="text-xs text-slate-400">Weekly</span>
            </div>

            <div className="space-y-6">
              {/* Graphic Mock Stats */}
              <div className="flex items-end justify-between h-28 px-4 border-b border-white/5 pb-2">
                <div className="w-6 bg-slate-800 rounded-t h-[40%] relative group">
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity mb-1 whitespace-nowrap">2 hrs</div>
                </div>
                <div className="w-6 bg-slate-800 rounded-t h-[60%] relative group">
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity mb-1 whitespace-nowrap">3.5 hrs</div>
                </div>
                <div className="w-6 bg-indigo-600 rounded-t h-[85%] relative group">
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity mb-1 whitespace-nowrap">4.8 hrs</div>
                </div>
                <div className="w-6 bg-slate-800 rounded-t h-[50%] relative group">
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity mb-1 whitespace-nowrap">3 hrs</div>
                </div>
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 font-mono px-2">
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
              </div>

              {/* Data list summary */}
              <div className="space-y-3 pt-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Total Meeting Hours</span>
                  <span className="text-white font-bold">13.3 hrs</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">AI Transcripts Processed</span>
                  <span className="text-white font-bold">12 sessions</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Tasks Delegated from AI</span>
                  <span className="text-emerald-400 font-bold">7 tasks</span>
                </div>
              </div>
            </div>
          </div>

          {/* Scheduled items timeline */}
          <div className="glass-panel p-6 rounded-2xl border border-white/5 text-left">
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-6">
              <Calendar className="h-5 w-5 text-purple-400" />
              Scheduled Meetings
            </h3>
            
            <div className="space-y-4">
              <div className="p-3 bg-slate-950/20 border-l-2 border-indigo-500 rounded-r-lg">
                <div className="text-xs font-bold text-white">Q2 Project Wrap-up</div>
                <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1.5">
                  <Clock className="h-3 w-3" />
                  Today, 3:30 PM - 4:15 PM
                </div>
              </div>
              <div className="p-3 bg-slate-950/20 border-l-2 border-purple-500 rounded-r-lg">
                <div className="text-xs font-bold text-white">Security & API Auditing</div>
                <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1.5">
                  <Clock className="h-3 w-3" />
                  Tomorrow, 10:00 AM - 11:00 AM
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Selected Meeting Details Overlay Panel */}
      {selectedMeeting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-2xl glass-panel rounded-2xl p-6 border border-white/10 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start border-b border-white/5 pb-4 mb-6">
              <div>
                <h3 className="text-xl font-bold text-indigo-400">{selectedMeeting.title}</h3>
                <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                  <span>{selectedMeeting.date}</span>
                  <span>•</span>
                  <span>{selectedMeeting.duration}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedMeeting(null)}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                Close
              </button>
            </div>

            {/* AI Summary block */}
            <div className="mb-6 bg-indigo-600/5 p-4 rounded-xl border border-indigo-500/10">
              <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-1.5">
                <MessageSquare className="h-4.5 w-4.5 text-indigo-400 animate-pulse-slow" />
                AI Generated Meeting Summary
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">{selectedMeeting.summary}</p>
            </div>

            {/* Tasks / Action Items checklist */}
            <div>
              <h4 className="text-sm font-bold text-white mb-3.5 flex items-center gap-1.5">
                <CheckCircle2 className="h-4.5 w-4.5 text-emerald-400" />
                Extracted Action Items ({selectedMeeting.actionItems.length})
              </h4>
              <div className="space-y-2.5">
                {selectedMeeting.actionItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3.5 rounded-lg bg-slate-950/40 border border-white/5"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`h-4.5 w-4.5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        item.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-slate-900 border border-slate-700 text-transparent'
                      }`}>
                        {item.status === 'completed' && '✓'}
                      </div>
                      <span className={`text-xs ${item.status === 'completed' ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                        {item.task}
                      </span>
                    </div>
                    
                    <span className="text-[10px] font-semibold bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded">
                      Assignee: {item.owner}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
