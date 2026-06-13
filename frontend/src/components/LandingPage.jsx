import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Video, Bot, Sparkles, MessageSquare, CheckSquare, Calendar, ChevronRight, Zap } from 'lucide-react';

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState('transcription');
  const [typedText, setTypedText] = useState('');
  
  const mockTranscript = [
    { sender: "Sarah", text: "We need to wrap up the Q2 project roadmap by Friday." },
    { sender: "AI Assistant", text: "Adding action item: Sarah to finalize Q2 project roadmap. Due Friday." },
    { sender: "Marcus", text: "I can prepare the slide deck for the marketing alignment." },
    { sender: "AI Assistant", text: "Adding action item: Marcus to draft marketing slide deck. Due Friday." }
  ];

  // Auto-typing animation effect for the AI transcript showcase
  useEffect(() => {
    let currentLine = 0;
    let currentChar = 0;
    let interval;

    const type = () => {
      if (currentLine >= mockTranscript.length) {
        currentLine = 0;
        setTypedText('');
      }
      
      const lineObj = mockTranscript[currentLine];
      if (!lineObj) return;

      const prefix = `[${lineObj.sender}]: `;
      const fullText = prefix + lineObj.text;

      if (currentChar < fullText.length) {
        setTypedText(prev => prev + fullText[currentChar]);
        currentChar++;
      } else {
        setTypedText(prev => prev + '\n');
        currentLine++;
        currentChar = 0;
      }
    };

    interval = setInterval(type, 80);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen bg-dark-bg text-slate-100 overflow-hidden">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500/10 blur-[120px]" />

      {/* Hero Section */}
      <header className="max-w-7xl mx-auto px-6 pt-20 pb-16 text-center relative z-10 animate-fade-in">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-400 text-xs font-semibold mb-6 animate-pulse-slow">
          <Sparkles className="h-3.5 w-3.5" />
          Enterprise-Ready Meeting Intelligence
        </div>
        
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-[1.15] mb-6">
          Transform Meetings into{' '}
          <span className="text-gradient font-black">Actionable Events</span>
        </h1>
        
        <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          IntellMeet combines real-time HD video meetings, instant AI transcriptions, smart action-item extraction, and Kanban project boards.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link
            to="/register"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-bold bg-indigo-600 hover:bg-indigo-500 shadow-xl shadow-indigo-600/20 hover:scale-[1.02] transition-all text-white"
          >
            Start Free Trial
            <ChevronRight className="h-5 w-5" />
          </Link>
          <a
            href="#features"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-semibold glass-button hover:scale-[1.02]"
          >
            Explore Features
          </a>
        </div>

        {/* Hero Demo Sandbox Mock */}
        <div className="max-w-5xl mx-auto rounded-2xl glass-panel p-2 shadow-2xl relative border border-white/10 animate-slide-up">
          <div className="rounded-xl overflow-hidden bg-slate-950/60 aspect-[16/9] flex flex-col md:flex-row">
            
            {/* Left Column: Simulated HD Video Stream Grid */}
            <div className="flex-1 p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/5 relative">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-slate-400 bg-slate-900/60 px-2.5 py-1 rounded-full border border-white/5 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                  Live Meeting: Q2 Sprint Planning
                </span>
                <span className="text-xs text-indigo-400 font-semibold bg-indigo-500/10 px-2 py-0.5 rounded">08:24</span>
              </div>

              {/* Video Grid Grid Mock */}
              <div className="grid grid-cols-2 gap-3 my-auto">
                <div className="aspect-[4/3] rounded-lg bg-slate-800/80 flex flex-col justify-end p-2 relative overflow-hidden border border-white/5">
                  <div className="absolute top-2 right-2 bg-slate-900/80 px-2 py-0.5 rounded text-[10px] text-slate-300">Sarah (Speaker)</div>
                  <div className="h-full w-full flex items-center justify-center">
                    <div className="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-white">S</div>
                  </div>
                </div>
                <div className="aspect-[4/3] rounded-lg bg-slate-800/80 flex flex-col justify-end p-2 relative overflow-hidden border border-white/5">
                  <div className="absolute top-2 right-2 bg-slate-900/80 px-2 py-0.5 rounded text-[10px] text-slate-300">Marcus</div>
                  <div className="h-full w-full flex items-center justify-center">
                    <div className="h-10 w-10 rounded-full bg-purple-500 flex items-center justify-center font-bold text-white">M</div>
                  </div>
                </div>
              </div>

              {/* Video bar */}
              <div className="flex items-center justify-center gap-3 mt-4">
                <div className="h-8 w-8 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center cursor-pointer border border-red-500/30">Mute</div>
                <div className="h-8 w-8 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center cursor-pointer border border-white/5">Cam</div>
                <div className="h-8 w-8 rounded-full bg-indigo-600 text-white flex items-center justify-center cursor-pointer">Share</div>
              </div>
            </div>

            {/* Right Column: Real-Time AI Processing Feed */}
            <div className="w-full md:w-[350px] p-6 flex flex-col justify-between bg-slate-950/80">
              <div className="border-b border-white/5 pb-3">
                <h3 className="text-sm font-semibold flex items-center gap-2 text-indigo-400">
                  <Bot className="h-4 w-4 animate-bounce" />
                  AI Intelligence Assistant
                </h3>
              </div>

              <div className="flex-1 my-4 text-left font-mono text-xs text-indigo-300 whitespace-pre-wrap overflow-y-auto leading-relaxed max-h-[180px] bg-black/40 p-3 rounded-lg border border-white/5">
                {typedText || "Analyzing microphone feed..."}
              </div>

              <div className="bg-slate-900/60 p-3 rounded-xl border border-white/5 text-left">
                <h4 className="text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
                  <CheckSquare className="h-3.5 w-3.5 text-emerald-400" />
                  Extracted Action Items
                </h4>
                <div className="space-y-1.5">
                  <div className="text-[10px] text-slate-400 flex items-center gap-2">
                    <div className="h-3 w-3 rounded border border-indigo-500/40 bg-indigo-500/10 flex items-center justify-center text-white font-bold text-[8px]">✓</div>
                    Sarah: Finalize Q2 roadmap
                  </div>
                  <div className="text-[10px] text-slate-400 flex items-center gap-2">
                    <div className="h-3 w-3 rounded border border-indigo-500/40 bg-indigo-500/10 flex items-center justify-center text-white font-bold text-[8px]">✓</div>
                    Marcus: Draft slide deck
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </header>

      {/* Features Grid Section */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-20 relative z-10 border-t border-white/5">
        <h2 className="text-3xl font-bold text-center mb-4">Core Platform Capabilities</h2>
        <p className="text-slate-400 text-center max-w-xl mx-auto mb-16">
          Everything enterprise teams need to streamline collaboration before, during, and after meetings.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-panel glass-panel-hover p-8 rounded-2xl text-left">
            <div className="h-12 w-12 rounded-xl bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-center text-indigo-400 mb-6">
              <Video className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Ultra-HD Video & WebRTC</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Crystal clear conferencing with screen sharing and integrated recording. Peer connection scaling optimized for lag-free performance.
            </p>
          </div>

          <div className="glass-panel glass-panel-hover p-8 rounded-2xl text-left">
            <div className="h-12 w-12 rounded-xl bg-purple-500/10 border border-purple-500/25 flex items-center justify-center text-purple-400 mb-6">
              <Bot className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">AI Summarization</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Automatic Whisper-based transcription and GPT summaries generate concise meeting notes, highlighting major decisions and follow-ups.
            </p>
          </div>

          <div className="glass-panel glass-panel-hover p-8 rounded-2xl text-left">
            <div className="h-12 w-12 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 mb-6">
              <CheckSquare className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Kanban Board Sync</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Directly map meeting outcomes to drag-and-drop workspace task cards, complete with due dates and project boards mapping status.
            </p>
          </div>
        </div>
      </section>

      {/* Analytics Callout Section */}
      <section className="bg-slate-950/40 border-t border-b border-white/5 py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-12 text-left">
          <div className="flex-1">
            <div className="h-8 w-8 rounded bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-4">
              <Zap className="h-4 w-4" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4 leading-tight">Advanced Analytics & Insights</h2>
            <p className="text-slate-400 leading-relaxed mb-6">
              Track productivity gains, analyze team frequencies, and optimize meeting schedules. IntellMeet provides exportable metrics reports showcasing enterprise alignment.
            </p>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="text-2xl font-bold text-indigo-400">40-60%</div>
                <div className="text-xs text-slate-400 uppercase tracking-wide">Follow-up Reduction</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-400">25-40%</div>
                <div className="text-xs text-slate-400 uppercase tracking-wide">Productivity Increase</div>
              </div>
            </div>
          </div>
          <div className="flex-1 w-full glass-panel p-6 rounded-2xl border border-white/10 relative overflow-hidden">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Productivity Gain Metrics</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-300">AI Transcription Accuracy</span>
                  <span className="text-emerald-400 font-semibold">94%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-900 overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '94%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-300">Action Item Tracking Sync</span>
                  <span className="text-indigo-400 font-semibold">88%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-900 overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: '88%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-300">Meeting Overload Reduction</span>
                  <span className="text-purple-400 font-semibold">55%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-900 overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full" style={{ width: '55%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
