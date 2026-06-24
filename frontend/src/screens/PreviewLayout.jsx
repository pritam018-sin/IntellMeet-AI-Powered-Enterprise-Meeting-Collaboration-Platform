import React, { useState } from 'react';
import MeetingLayout from '../components/meeting/layout/MeetingLayout';
import VideoGrid from '../components/meeting/layout/VideoGrid';
import Sidebar from '../components/meeting/layout/Sidebar';
import ControlBar from '../components/meeting/controls/ControlBar';
import VideoTile from '../components/meeting/video/VideoTile';
import { useGridLayout } from '../hooks/useGridLayout';

const PreviewLayout = () => {
  const [participantCount, setParticipantCount] = useState(6);
  const [sidebarMode, setSidebarMode] = useState(null); // 'chat', 'participants', or null
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [micEnabled, setMicEnabled] = useState(true);
  const [camEnabled, setCamEnabled] = useState(true);

  // Generate dummy participants
  const participants = Array.from({ length: participantCount }, (_, i) => ({
    id: i + 1,
    name: i === 0 ? 'You' : `Participant ${i + 1}`,
    isLocal: i === 0,
    audioEnabled: i % 2 === 0,
    videoEnabled: true,
    handRaised: i === 2,
    stream: null // In a real app, this would be a MediaStream
  }));

  const { gridCols, gridRows } = useGridLayout(participants.length);

  const handleToggleSidebar = (mode) => {
    setSidebarMode(sidebarMode === mode ? null : mode);
  };

  return (
    <MeetingLayout 
      isSidebarOpen={sidebarMode !== null}
      sidebarContent={
        sidebarMode ? (
          <Sidebar 
            mode={sidebarMode} 
            onClose={() => setSidebarMode(null)} 
          />
        ) : null
      }
    >
      {/* Top Testing Controls (Only for this preview) */}
      <div className="absolute top-4 left-4 z-50 bg-black/80 p-4 rounded-lg border border-slate-700 backdrop-blur flex gap-4 text-sm">
        <div className="flex flex-col gap-2">
          <label className="text-slate-300">Participants: {participantCount}</label>
          <input 
            type="range" 
            min="1" 
            max="16" 
            value={participantCount} 
            onChange={(e) => setParticipantCount(Number(e.target.value))}
            className="w-32"
          />
        </div>
      </div>

      {/* Main Video Area */}
      <div className="flex-1 flex flex-col bg-slate-950 relative overflow-hidden">
        {isScreenSharing ? (
          <div className="flex-1 flex flex-col md:flex-row p-2 gap-2">
             {/* Screen Share View */}
             <div className="flex-[3] bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-center text-slate-500 shadow-inner">
               <span className="text-2xl font-semibold text-slate-300">Screen Share Presentation</span>
             </div>
             {/* Filmstrip View for screen sharing */}
             <div className="flex-1 flex flex-row md:flex-col gap-2 overflow-auto max-h-full">
               {participants.slice(0, 4).map(p => (
                 <div key={p.id} className="w-40 md:w-full aspect-video shrink-0">
                   <VideoTile participant={p} isActiveSpeaker={p.id === 2} />
                 </div>
               ))}
             </div>
          </div>
        ) : (
          <div className="flex-1 p-2 sm:p-4 overflow-hidden flex items-center justify-center">
            <div 
              className="w-full h-full max-w-[1920px] max-h-[1080px] grid gap-2 sm:gap-4 transition-all duration-300"
              style={{
                gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))`,
                gridTemplateRows: `repeat(${gridRows}, minmax(0, 1fr))`
              }}
            >
              {participants.map((p) => (
                <div key={p.id} className="w-full h-full min-h-0 min-w-0">
                   <VideoTile participant={p} isActiveSpeaker={p.id === 2 && !isScreenSharing} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Control Bar */}
      <ControlBar 
        state={{
          micEnabled,
          camEnabled,
          isScreenSharing,
          sidebarMode
        }}
        onToggleMic={() => setMicEnabled(!micEnabled)}
        onToggleCam={() => setCamEnabled(!camEnabled)}
        onToggleScreenShare={() => setIsScreenSharing(!isScreenSharing)}
        onToggleSidebar={handleToggleSidebar}
        onLeave={() => window.location.href = '/'}
      />
    </MeetingLayout>
  );
};

export default PreviewLayout;
