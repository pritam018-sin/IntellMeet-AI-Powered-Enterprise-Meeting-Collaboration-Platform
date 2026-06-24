import React from 'react';
import { Phone, VolumeX, CircleDot } from 'lucide-react';

const SettingsPanel = ({ isHost, onEndMeeting, onMuteAll, canRecord, onToggleRecordingPermission }) => {
  if (!isHost) {
    return (
      <div className="flex flex-col h-full bg-black/40 text-slate-300 p-6 items-center justify-center text-center">
        <p>You do not have host privileges.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-black/40 text-slate-300 p-4">
      <h3 className="text-sm font-semibold text-red-200 mb-4 uppercase tracking-wider">Host Controls</h3>
      
      <div className="space-y-4">
        {/* Recording Permission */}
        <div className="bg-black/60 border border-red-950/50 p-4 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-900/30 rounded-lg text-red-400">
              <CircleDot className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-white">Allow Recording</span>
              <span className="text-xs text-slate-500">Let participants record the meeting</span>
            </div>
          </div>
          <button 
            onClick={onToggleRecordingPermission}
            className={`w-10 h-5 rounded-full relative transition-colors ${canRecord ? 'bg-red-600' : 'bg-slate-700'}`}
          >
            <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all ${canRecord ? 'left-5' : 'left-1'}`}></div>
          </button>
        </div>

        {/* Mute All */}
        <button 
          onClick={onMuteAll}
          className="w-full bg-black/60 hover:bg-white/5 border border-red-950/50 p-4 rounded-xl flex items-center gap-3 transition-colors text-left"
        >
          <div className="p-2 bg-slate-800 rounded-lg text-slate-300">
            <VolumeX className="w-5 h-5" />
          </div>
          <div className="flex flex-col flex-1">
            <span className="text-sm font-medium text-white">Force Mute All</span>
            <span className="text-xs text-slate-500">Mute all participants</span>
          </div>
        </button>

        {/* End Meeting */}
        <button 
          onClick={onEndMeeting}
          className="w-full bg-red-900/20 hover:bg-red-900/40 border border-red-800/50 p-4 rounded-xl flex items-center gap-3 transition-colors text-left group"
        >
          <div className="p-2 bg-red-600 group-hover:bg-red-500 rounded-lg text-white transition-colors">
            <Phone className="w-5 h-5" />
          </div>
          <div className="flex flex-col flex-1">
            <span className="text-sm font-medium text-red-200 group-hover:text-white">End Meeting for All</span>
            <span className="text-xs text-red-400/70">Permanently close this room</span>
          </div>
        </button>

      </div>
    </div>
  );
};

export default SettingsPanel;
