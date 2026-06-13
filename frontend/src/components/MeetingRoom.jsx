import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Mic, MicOff, Video as VideoIcon, VideoOff, Monitor, PhoneOff, MessageSquare, Users, Sparkles, Send, Play, Square, UserMinus } from 'lucide-react';

export default function MeetingRoom({ user }) {
  const { roomId } = useParams();
  const navigate = useNavigate();

  // Toolbar toggles
  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);
  const [screenShare, setScreenShare] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [activeTab, setActiveTab] = useState('chat'); // chat, participants, transcript, ai

  // Chat & Transcript States
  const [chatMessages, setChatMessages] = useState([
    { sender: 'Sarah', text: 'Hey guys, ready for the alignment session?', time: '3:30 PM' },
    { sender: 'Marcus', text: 'Yeah, let me share the updated designs soon.', time: '3:31 PM' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  
  const [transcripts, setTranscripts] = useState([
    { sender: 'Sarah', text: 'Let us start by aligning the team on the Q2 release backlog.' },
    { sender: 'Marcus', text: 'Sure, I have updated the Kanban board with Alice\'s card for the Whisper token compression.' }
  ]);

  // AI assistant states
  const [aiActionItems, setAiActionItems] = useState([
    { id: 'a-1', task: 'Finalize Q2 project backlog sheet', owner: 'Sarah', done: true },
    { id: 'a-2', task: 'Prepare slide deck for marketing team', owner: 'Marcus', done: false },
    { id: 'a-3', task: 'Benchmark Socket.io connection bottlenecks', owner: 'Bob', done: false }
  ]);

  // Local camera stream reference
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Simulated transcription stream
  useEffect(() => {
    const mockSentences = [
      { sender: 'Sarah', text: 'We need to make sure the latency is lower than 200 milliseconds.' },
      { sender: 'Marcus', text: 'I am using redis caching to improve connection speeds.' },
      { sender: 'Sarah', text: 'Perfect. Dave will review the PDF document structures for the report export.' },
      { sender: 'Marcus', text: 'I will write down the task in the workspace backlog board.' }
    ];
    let sentenceIdx = 0;

    const interval = setInterval(() => {
      if (sentenceIdx < mockSentences.length) {
        const item = mockSentences[sentenceIdx];
        setTranscripts(prev => [...prev, item]);
        
        // Simulating AI assistant picking up action items
        if (item.text.includes('Dave will review')) {
          setAiActionItems(prev => [
            ...prev,
            { id: `a-${Date.now()}`, task: 'Review PDF document structures', owner: 'Dave', done: false }
          ]);
        }
        sentenceIdx++;
      }
    }, 12000);

    return () => clearInterval(interval);
  }, []);

  // Web camera setup
  useEffect(() => {
    if (videoOn) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch(err => {
          console.warn('Camera stream request rejected/unavailable:', err);
        });
    } else {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    }
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [videoOn]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    setChatMessages(prev => [
      ...prev,
      {
        sender: user?.name || 'Jane',
        text: inputMessage.trim(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setInputMessage('');
  };

  const toggleActionItem = (id) => {
    setAiActionItems(prev =>
      prev.map(item => item.id === id ? { ...item, done: !item.done } : item)
    );
  };

  return (
    <div className="h-[90vh] flex flex-col bg-dark-bg relative overflow-hidden">
      {/* Top Banner Row */}
      <div className="px-6 py-4 glass-panel border-b border-white/5 flex items-center justify-between z-10 shrink-0">
        <div>
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500 animate-ping" />
            Meeting Room: {roomId}
          </h2>
          <p className="text-[10px] text-slate-400 mt-0.5">Enterprise domain • Real-time AI Summary active</p>
        </div>

        {/* Recording Indicator */}
        {isRecording && (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/25 text-red-400 text-xs font-semibold">
            <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
            REC
          </div>
        )}
      </div>

      {/* Main layout container */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0 relative">
        
        {/* Left pane: Video streams */}
        <div className="flex-1 p-6 flex flex-col justify-between overflow-y-auto relative min-w-0">
          
          {/* Active Speakers HD Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-auto max-w-4xl mx-auto w-full">
            
            {/* User stream card */}
            <div className={`aspect-[16/10] rounded-2xl glass-panel relative overflow-hidden flex flex-col justify-end border ${
              micOn ? 'active-speaker-ring border-emerald-500' : 'border-white/5'
            }`}>
              <div className="absolute top-3 right-3 z-10 bg-slate-950/80 px-3 py-1 rounded-full text-xs font-bold text-slate-300">
                {user?.name || 'You'} (Self)
              </div>
              
              {videoOn ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="h-full w-full object-cover rounded-xl"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-900/60">
                  <VideoOff className="h-10 w-10 text-slate-600 animate-pulse" />
                </div>
              )}
            </div>

            {/* Remote Participant 1 */}
            <div className="aspect-[16/10] rounded-2xl glass-panel border border-white/5 relative overflow-hidden flex flex-col justify-end">
              <div className="absolute top-3 right-3 z-10 bg-slate-950/80 px-3 py-1 rounded-full text-xs font-bold text-slate-300">
                Sarah
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-indigo-950/40 to-slate-950/60 flex flex-col items-center justify-center p-4">
                <div className="h-14 w-14 rounded-full bg-indigo-500/15 border border-indigo-500 flex items-center justify-center font-bold text-white text-lg">S</div>
                <span className="text-[10px] text-emerald-400 mt-2 flex items-center gap-1 font-semibold">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Muted
                </span>
              </div>
            </div>

            {/* Remote Participant 2 */}
            <div className="aspect-[16/10] rounded-2xl glass-panel border border-white/5 relative overflow-hidden flex flex-col justify-end">
              <div className="absolute top-3 right-3 z-10 bg-slate-950/80 px-3 py-1 rounded-full text-xs font-bold text-slate-300">
                Marcus
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-purple-950/40 to-slate-950/60 flex flex-col items-center justify-center p-4">
                <div className="h-14 w-14 rounded-full bg-purple-500/15 border border-purple-500 flex items-center justify-center font-bold text-white text-lg">M</div>
                <span className="text-[10px] text-slate-500 mt-2">Connecting...</span>
              </div>
            </div>

            {/* Simulated Screen Share overlay */}
            {screenShare && (
              <div className="aspect-[16/10] rounded-2xl glass-panel border border-indigo-500/30 bg-slate-950/90 relative overflow-hidden flex flex-col justify-end p-4">
                <div className="absolute top-3 right-3 z-10 bg-indigo-600 px-3 py-1 rounded-full text-xs font-bold text-white">
                  Sharing Screen
                </div>
                <div className="h-full w-full flex flex-col items-center justify-center text-slate-400">
                  <Monitor className="h-12 w-12 text-indigo-400 mb-2 animate-bounce" />
                  <span className="text-xs">Simulating Screen Stream</span>
                </div>
              </div>
            )}

          </div>

          {/* Meeting toolbar controls */}
          <div className="mt-8 flex justify-center shrink-0">
            <div className="flex items-center gap-4 bg-slate-950/80 p-4 rounded-2xl border border-white/5 shadow-2xl">
              
              {/* Mic toggle */}
              <button
                onClick={() => setMicOn(!micOn)}
                className={`h-11 w-11 rounded-xl flex items-center justify-center transition-colors cursor-pointer border ${
                  micOn ? 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-white/5' : 'bg-red-500/15 border-red-500/30 text-red-400'
                }`}
              >
                {micOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
              </button>

              {/* Video toggle */}
              <button
                onClick={() => setVideoOn(!videoOn)}
                className={`h-11 w-11 rounded-xl flex items-center justify-center transition-colors cursor-pointer border ${
                  videoOn ? 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-white/5' : 'bg-red-500/15 border-red-500/30 text-red-400'
                }`}
              >
                {videoOn ? <VideoIcon className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
              </button>

              {/* Share screen */}
              <button
                onClick={() => setScreenShare(!screenShare)}
                className={`h-11 w-11 rounded-xl flex items-center justify-center transition-colors cursor-pointer border ${
                  screenShare ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border-white/5'
                }`}
              >
                <Monitor className="h-5 w-5" />
              </button>

              {/* Record buttons */}
              <button
                onClick={() => setIsRecording(!isRecording)}
                className={`h-11 w-11 rounded-xl flex items-center justify-center transition-colors cursor-pointer border ${
                  isRecording ? 'bg-red-600 border-red-500 text-white' : 'bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border-white/5'
                }`}
              >
                {isRecording ? <Square className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              </button>

              <div className="h-6 w-px bg-white/5" />

              {/* Hangup button */}
              <button
                onClick={() => navigate('/dashboard')}
                className="h-11 px-5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold flex items-center gap-1.5 cursor-pointer text-xs uppercase tracking-wide"
              >
                <PhoneOff className="h-4.5 w-4.5" />
                Leave
              </button>

            </div>
          </div>

        </div>

        {/* Right pane: Collaborative Side bar container */}
        <div className="w-full md:w-[380px] border-t md:border-t-0 md:border-l border-white/5 bg-slate-950/70 flex flex-col shrink-0 min-h-0">
          
          {/* Tab selector bar */}
          <div className="grid grid-cols-4 border-b border-white/5 bg-slate-950 shrink-0">
            <button
              onClick={() => setActiveTab('chat')}
              className={`py-3.5 text-xs font-bold transition-colors ${
                activeTab === 'chat' ? 'text-indigo-400 border-b-2 border-indigo-500' : 'text-slate-500 hover:text-white'
              }`}
            >
              <div className="flex flex-col items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                Chat
              </div>
            </button>
            <button
              onClick={() => setActiveTab('participants')}
              className={`py-3.5 text-xs font-bold transition-colors ${
                activeTab === 'participants' ? 'text-indigo-400 border-b-2 border-indigo-500' : 'text-slate-500 hover:text-white'
              }`}
            >
              <div className="flex flex-col items-center gap-1">
                <Users className="h-4 w-4" />
                People
              </div>
            </button>
            <button
              onClick={() => setActiveTab('transcript')}
              className={`py-3.5 text-xs font-bold transition-colors ${
                activeTab === 'transcript' ? 'text-indigo-400 border-b-2 border-indigo-500' : 'text-slate-500 hover:text-white'
              }`}
            >
              <div className="flex flex-col items-center gap-1">
                <Mic className="h-4 w-4" />
                Live Feed
              </div>
            </button>
            <button
              onClick={() => setActiveTab('ai')}
              className={`py-3.5 text-xs font-bold transition-colors ${
                activeTab === 'ai' ? 'text-indigo-400 border-b-2 border-indigo-500' : 'text-slate-500 hover:text-white'
              }`}
            >
              <div className="flex flex-col items-center gap-1">
                <Sparkles className="h-4 w-4" />
                AI Notes
              </div>
            </button>
          </div>

          {/* Dynamic Tab Body */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col justify-between min-h-0 text-left">
            
            {/* Tab: CHAT */}
            {activeTab === 'chat' && (
              <div className="flex flex-col h-full justify-between">
                <div className="space-y-4 overflow-y-auto flex-1 pr-1">
                  {chatMessages.map((msg, index) => (
                    <div key={index} className="bg-slate-900/60 p-3 rounded-xl border border-white/5">
                      <div className="flex justify-between items-center text-[10px] text-slate-400 mb-1">
                        <span className="font-bold text-slate-200">{msg.sender}</span>
                        <span>{msg.time}</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">{msg.text}</p>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendMessage} className="flex gap-2 border-t border-white/5 pt-4 mt-4 shrink-0">
                  <input
                    type="text"
                    required
                    placeholder="Send a message..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    className="flex-1 px-3 py-2 bg-slate-950/60 border border-white/5 focus:border-indigo-500 rounded-xl text-xs text-white placeholder-slate-600 outline-none"
                  />
                  <button
                    type="submit"
                    className="h-8 w-8 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center shrink-0"
                  >
                    <Send className="h-3.5 w-3.5" />
                  </button>
                </form>
              </div>
            )}

            {/* Tab: PARTICIPANTS */}
            {activeTab === 'participants' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs text-slate-400 mb-2">
                  <span>Room Members</span>
                  <span>3 Active</span>
                </div>
                
                <div className="space-y-2.5">
                  <div className="flex justify-between items-center p-2 rounded-xl bg-slate-900/40 border border-white/5">
                    <span className="text-xs text-white font-bold">{user?.name || 'You'}</span>
                    <span className="text-[9px] uppercase font-semibold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">Owner</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded-xl bg-slate-900/40 border border-white/5">
                    <span className="text-xs text-slate-200">Sarah</span>
                    <span className="text-[9px] uppercase text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded">Muted</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded-xl bg-slate-900/40 border border-white/5">
                    <span className="text-xs text-slate-200">Marcus</span>
                    <span className="text-[9px] uppercase text-slate-500">Idle</span>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: TRANSCRIPT */}
            {activeTab === 'transcript' && (
              <div className="space-y-4 h-full flex flex-col justify-between">
                <div className="flex-1 overflow-y-auto space-y-3.5 font-mono text-[10px] text-slate-300 pr-1">
                  {transcripts.map((t, idx) => (
                    <div key={idx} className="p-2 rounded bg-black/40 border-l border-indigo-500/35">
                      <strong className="text-indigo-400">{t.sender}:</strong> {t.text}
                    </div>
                  ))}
                </div>
                <div className="text-[9px] text-slate-500 text-center uppercase tracking-wider shrink-0 border-t border-white/5 pt-3">
                  Auto-transcribing audio inputs...
                </div>
              </div>
            )}

            {/* Tab: AI NOTES */}
            {activeTab === 'ai' && (
              <div className="space-y-5">
                <div className="bg-indigo-600/5 p-3.5 rounded-xl border border-indigo-500/15">
                  <h4 className="text-xs font-bold text-white mb-1.5 flex items-center gap-1">
                    <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                    AI Summary Takeaways
                  </h4>
                  <p className="text-[10px] text-slate-300 leading-relaxed">
                    Aligning team backlog items. Discussing WebRTC latency configurations (<span className="text-indigo-400 font-semibold">&lt;200ms</span> targets) and Redis session limits.
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-white mb-2 flex items-center gap-1">
                    <Users className="h-3.5 w-3.5 text-purple-400" />
                    Extracted Action Items
                  </h4>
                  <div className="space-y-2.5">
                    {aiActionItems.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => toggleActionItem(item.id)}
                        className="p-3 bg-slate-900/60 rounded-xl border border-white/5 hover:border-indigo-500/20 cursor-pointer flex justify-between items-center"
                      >
                        <div className="flex items-center gap-2 max-w-[70%]">
                          <div className={`h-4 w-4 rounded flex items-center justify-center text-[10px] font-bold shrink-0 ${
                            item.done ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-slate-950 border border-slate-700 text-transparent'
                          }`}>
                            {item.done && '✓'}
                          </div>
                          <span className={`text-[10px] leading-snug ${item.done ? 'line-through text-slate-500' : 'text-slate-300'}`}>
                            {item.task}
                          </span>
                        </div>
                        <span className="text-[9px] font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/25 px-1.5 py-0.5 rounded shrink-0">
                          {item.owner}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
