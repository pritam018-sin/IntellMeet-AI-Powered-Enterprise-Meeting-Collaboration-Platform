import React, { useState } from 'react';
import { Mic, MicOff, Video, VideoOff, Hand, VolumeX, X, Link } from 'lucide-react';

const ParticipantsPanel = ({ participants = [], isHost, onRemoveParticipant, onMuteParticipant, canRecord, onToggleRecordingPermission }) => {

  return (
    <div className="flex flex-col h-full bg-black/40 text-slate-300">
      {/* Search Bar */}
      <div className="p-4 border-b border-red-950/50">
        <input 
          type="text" 
          placeholder="Search participants" 
          className="w-full bg-white/5 border border-red-950/50 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-red-600 focus:bg-white/10 transition-all text-white placeholder-slate-500"
        />
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-2">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-2 py-2">
          In Call ({participants.length})
        </div>
        
        <ul className="space-y-1">
          {participants.map((p) => (
            <li key={p.id} className="flex items-center justify-between p-2 hover:bg-white/5 rounded-lg group transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-red-900/40 border border-red-800/50 flex items-center justify-center font-semibold text-red-200">
                  {p.name.charAt(0)}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-slate-200">
                    {p.name} {p.isHost && <span className="text-xs text-slate-500 ml-1">(Host)</span>}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                {p.handRaised && <Hand className="w-4 h-4 text-yellow-500" title="Hand Raised" />}
                {p.audioEnabled ? <Mic className="w-4 h-4" title="Mic On" /> : <MicOff className="w-4 h-4" title="Mic Off" />}
                {p.videoEnabled ? <Video className="w-4 h-4" title="Cam On" /> : <VideoOff className="w-4 h-4" title="Cam Off" />}
                
                {isHost && !p.isLocal && (
                  <div className="hidden group-hover:flex items-center gap-1 ml-2 bg-transparent pl-2">
                    <button onClick={() => onMuteParticipant(p.socketId)} className="p-1.5 hover:bg-white/10 rounded text-slate-300" title="Mute User"><VolumeX className="w-4 h-4" /></button>
                    <button onClick={() => onRemoveParticipant(p.socketId)} className="p-1.5 hover:bg-red-900/50 rounded text-red-400" title="Remove User"><X className="w-4 h-4" /></button>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ParticipantsPanel;
