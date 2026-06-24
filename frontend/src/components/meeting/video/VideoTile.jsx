import React, { useRef, useEffect } from 'react';

const VideoTile = ({ participant, isActiveSpeaker }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && participant.stream) {
      videoRef.current.srcObject = participant.stream;
    }
  }, [participant.stream]);

  return (
    <div 
      className={`relative w-full h-full rounded-xl overflow-hidden bg-slate-800 flex items-center justify-center
        ${isActiveSpeaker ? 'ring-4 ring-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'ring-1 ring-slate-700 hover:ring-slate-600'}
        transition-all duration-300
      `}
    >
      {/* Fallback avatar if no video */}
      {!participant.videoEnabled && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-slate-700 flex items-center justify-center text-3xl sm:text-4xl font-semibold text-slate-300">
            {participant.name?.charAt(0).toUpperCase() || 'U'}
          </div>
        </div>
      )}

      {/* Video Element */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={participant.isLocal} // Mute local video to prevent echo
        className={`w-full h-full object-cover ${!participant.videoEnabled ? 'hidden' : ''}`}
      />

      {/* Overlay Info */}
      <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 right-2 sm:right-4 flex justify-between items-end">
        <div className="flex items-center gap-2 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/10">
          {/* Mic Status Icon (Placeholder for actual SVG) */}
          <span className={`w-2 h-2 rounded-full ${participant.audioEnabled ? 'bg-green-500' : 'bg-red-500'}`}></span>
          <span className="text-sm font-medium text-white truncate max-w-[150px]">{participant.name}</span>
        </div>
        
        {/* Raised Hand Indicator */}
        {participant.handRaised && (
          <div className="bg-yellow-500/80 backdrop-blur-sm p-1.5 rounded-lg border border-yellow-400/50">
             ✋
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoTile;
