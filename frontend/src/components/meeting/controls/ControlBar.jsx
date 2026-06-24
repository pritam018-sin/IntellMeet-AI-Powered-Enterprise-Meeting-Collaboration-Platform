import React from 'react';
import { Mic, MicOff, Video, VideoOff, MonitorUp, MessageSquare, Users, Settings, Maximize, Minimize, Phone, CircleDot, FileText, CheckSquare } from 'lucide-react';

const ControlButton = ({ icon: Icon, label, onClick, isActive = false, danger = false }) => {
  return (
    <div className="flex flex-col items-center gap-1 group relative">
      <button
        onClick={onClick}
        className={`w-10 h-10 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all duration-200
          ${danger || isActive 
            ? 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-900/50' 
            : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white hover:scale-105 border border-red-950/30'
          }
        `}
      >
        <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>
      {/* Tooltip */}
      <div className="absolute -top-10 scale-0 group-hover:scale-100 transition-transform origin-bottom bg-gray-900 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap z-50 pointer-events-none border border-slate-700">
        {label}
      </div>
    </div>
  );
};

const ControlBar = ({ onToggleMic, onToggleCam, onToggleScreenShare, onToggleRecording, onToggleSidebar, onLeave, onEndMeeting, isHost, state, showControls, onToggleFullscreen }) => {
  return (
    <div className={`absolute bottom-6 w-[95%] sm:w-auto left-1/2 -translate-x-1/2 flex flex-wrap sm:flex-row items-center justify-center gap-2 sm:gap-4 z-30 transition-all duration-500 ease-in-out ${showControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12 pointer-events-none'} bg-slate-900/80 sm:bg-transparent backdrop-blur-md sm:backdrop-blur-none p-3 sm:p-0 rounded-3xl border border-red-950/50 sm:border-transparent shadow-2xl sm:shadow-none`}>
      
      {/* Center: Main Controls */}
      <div className="flex flex-row justify-center items-center gap-2 sm:gap-3">
        <ControlButton 
          icon={state.micEnabled ? Mic : MicOff} 
          label={state.micEnabled ? "Mute" : "Unmute"} 
          onClick={onToggleMic} 
          isActive={!state.micEnabled}
        />
        <ControlButton 
          icon={state.camEnabled ? Video : VideoOff} 
          label={state.camEnabled ? "Stop Video" : "Start Video"} 
          onClick={onToggleCam} 
          isActive={!state.camEnabled}
        />
        <ControlButton 
          icon={MonitorUp} 
          label={state.isScreenSharing ? "Stop Sharing" : "Share Screen"} 
          onClick={onToggleScreenShare} 
          isActive={state.isScreenSharing}
        />
        <ControlButton 
          icon={CircleDot} 
          label={state.isRecording ? "Stop Recording" : "Record Meeting"} 
          onClick={onToggleRecording} 
          isActive={state.isRecording}
        />
      </div>

      {/* Right side: Sidebar Toggles & Leave */}
      <div className="flex flex-row justify-center items-center gap-2 sm:gap-3 sm:ml-2 sm:border-l border-slate-700/50 sm:pl-4">
        <ControlButton 
          icon={state.isFullscreen ? Minimize : Maximize} 
          label={state.isFullscreen ? "Exit Fullscreen" : "Fullscreen"} 
          onClick={onToggleFullscreen} 
        />
        <ControlButton 
          icon={Users} 
          label="Participants" 
          onClick={() => onToggleSidebar('participants')} 
          isActive={state.sidebarMode === 'participants'}
        />
        <ControlButton 
          icon={MessageSquare} 
          label="Chat" 
          onClick={() => onToggleSidebar('chat')} 
          isActive={state.sidebarMode === 'chat'}
        />
        <ControlButton 
          icon={FileText} 
          label="Notes" 
          onClick={() => onToggleSidebar('notes')} 
          isActive={state.sidebarMode === 'notes'}
        />
        <ControlButton 
          icon={CheckSquare} 
          label="Tasks" 
          onClick={() => onToggleSidebar('tasks')} 
          isActive={state.sidebarMode === 'tasks'}
        />
        {isHost && (
          <ControlButton 
            icon={Settings} 
            label="Host Settings" 
            onClick={() => onToggleSidebar('settings')} 
            isActive={state.sidebarMode === 'settings'}
          />
        )}
        <div className="w-px h-8 bg-slate-700 mx-2 hidden sm:block"></div>
        <ControlButton 
          icon={Phone} 
          label="Leave Call" 
          danger={true}
          onClick={onLeave} 
        />
      </div>
    </div>
  );
};

export default ControlBar;
