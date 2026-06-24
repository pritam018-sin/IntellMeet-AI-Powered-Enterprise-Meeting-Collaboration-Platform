import React from 'react';
import { X } from 'lucide-react';
import ChatPanel from '../panels/ChatPanel';
import ParticipantsPanel from '../panels/ParticipantsPanel';
import SettingsPanel from '../panels/SettingsPanel';
import NotesPanel from '../panels/NotesPanel';
import TasksPanel from '../panels/TasksPanel';

const Sidebar = ({ mode, onClose, messages, onSendMessage, participants, isHost, onRemoveParticipant, onMuteParticipant, onMuteAll, onEndMeeting, canRecord, onToggleRecordingPermission, notes, onNotesChange, tasks, onAddTask, projects, onCreateProject }) => {
  return (
    <div className="flex flex-col h-full w-full bg-black/80 backdrop-blur-md shadow-2xl border-l border-red-950/50">
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-4 border-b border-red-950/50 bg-transparent z-10">
        <h2 className="text-lg font-semibold text-slate-200 capitalize">
          {mode}
        </h2>
        <button 
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          aria-label="Close sidebar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Sidebar Content Area */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden relative">
        {mode === 'chat' && <ChatPanel messages={messages} onSendMessage={onSendMessage} />}
        {mode === 'participants' && <ParticipantsPanel participants={participants} isHost={isHost} onRemoveParticipant={onRemoveParticipant} onMuteParticipant={onMuteParticipant} canRecord={canRecord} onToggleRecordingPermission={onToggleRecordingPermission} />}
        {mode === 'settings' && <SettingsPanel isHost={isHost} onEndMeeting={onEndMeeting} onMuteAll={onMuteAll} canRecord={canRecord} onToggleRecordingPermission={onToggleRecordingPermission} />}
        {mode === 'notes' && <NotesPanel notes={notes} onNotesChange={onNotesChange} />}
        {mode === 'tasks' && <TasksPanel tasks={tasks} onAddTask={onAddTask} projects={projects} onCreateProject={onCreateProject} />}
      </div>
    </div>
  );
};

export default Sidebar;
