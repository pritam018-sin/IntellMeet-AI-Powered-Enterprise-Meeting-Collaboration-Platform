import React from 'react';
import { useGridLayout } from '../../../hooks/useGridLayout';
import VideoTile from '../video/VideoTile';

/**
 * Dynamically sizes the grid based on the number of participants.
 */
const VideoGrid = ({ participants, onPinParticipant }) => {
  const { gridCols, gridRows } = useGridLayout(participants.length);

  return (
    <div className="flex-1 p-2 sm:p-4 overflow-hidden flex items-center justify-center bg-slate-950">
      <div 
        className="w-full h-full max-w-[1920px] max-h-[1080px] grid gap-2 sm:gap-4 transition-all duration-300"
        style={{
          gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${gridRows}, minmax(0, 1fr))`
        }}
      >
        {participants.map((participant) => (
          <div key={participant.id} className="w-full h-full min-h-0 min-w-0 cursor-pointer" onDoubleClick={() => onPinParticipant && onPinParticipant(participant.id)}>
             <VideoTile participant={participant} isActiveSpeaker={false} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoGrid;
