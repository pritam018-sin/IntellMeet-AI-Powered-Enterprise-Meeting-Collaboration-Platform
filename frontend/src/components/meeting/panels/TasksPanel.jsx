import React, { useState } from 'react';
import { CheckCircle2, Circle, Clock, FolderGit2 } from 'lucide-react';

const TasksPanel = ({ tasks, onAddTask, projects, onCreateProject }) => {
  const [taskTitle, setTaskTitle] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) return;
    const newProject = await onCreateProject(newProjectName);
    if (newProject) {
        setSelectedProjectId(newProject._id);
    }
    setNewProjectName('');
    setIsCreatingProject(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!taskTitle.trim() || !selectedProjectId) return;
    onAddTask(taskTitle, selectedProjectId);
    setTaskTitle('');
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'in-progress':
        return <span className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30"><Clock className="w-3 h-3" /> In Progress</span>;
      case 'done':
        return <span className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/30"><CheckCircle2 className="w-3 h-3" /> Done</span>;
      case 'todo':
      default:
        return <span className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-500/20 text-slate-400 border border-slate-500/30"><Circle className="w-3 h-3" /> To Do</span>;
    }
  };

  return (
    <div className="h-full flex flex-col p-4 bg-transparent">
      <h3 className="text-white font-semibold mb-6 flex items-center gap-2">
        <CheckCircle2 className="w-5 h-5 text-red-500" />
        Meeting Tasks
      </h3>
      
      <form onSubmit={handleSubmit} className="mb-6 flex flex-col gap-3 bg-white/5 p-4 rounded-xl border border-white/10 shadow-lg">
        <div className="flex justify-between items-center text-xs px-1">
          <span className="text-gray-400 uppercase tracking-wider font-semibold">{isCreatingProject ? 'Create Project' : 'Select Project'}</span>
          <button 
            type="button" 
            onClick={() => setIsCreatingProject(!isCreatingProject)}
            className="text-red-400 hover:text-red-300 transition font-medium"
          >
            {isCreatingProject ? 'Cancel' : '+ New Project'}
          </button>
        </div>

        {isCreatingProject ? (
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Project Name..."
              className="flex-1 bg-black/20 text-white p-2.5 rounded-lg border border-white/10 outline-none focus:border-red-500/50 transition-colors text-sm"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
            />
            <button 
              type="button"
              onClick={handleCreateProject}
              className="bg-red-600 hover:bg-red-500 text-white font-medium px-4 rounded-lg transition-colors whitespace-nowrap text-sm shadow-md"
              disabled={!newProjectName.trim()}
            >
              Save
            </button>
          </div>
        ) : (
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="w-full bg-black/20 text-white p-2.5 rounded-lg border border-white/10 outline-none focus:border-red-500/50 transition-colors text-sm cursor-pointer appearance-none"
          >
            <option value="" disabled className="text-black">Select Project</option>
            {projects?.map(p => (
              <option key={p._id} value={p._id} className="text-black">{p.name}</option>
            ))}
          </select>
        )}
        
        <input
          type="text"
          placeholder="What needs to be done?"
          className="w-full bg-black/20 text-white p-2.5 rounded-lg border border-white/10 outline-none focus:border-red-500/50 transition-colors text-sm"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
        />
        
        <button 
          type="submit"
          className="w-full bg-red-600 hover:bg-red-500 text-white font-medium p-2.5 rounded-lg transition-all shadow-md active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mt-1"
          disabled={!selectedProjectId || !taskTitle.trim() || isCreatingProject}
        >
          Add Task
        </button>
      </form>

      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
        <h4 className="text-gray-400 text-xs font-semibold mb-3 uppercase tracking-wider flex items-center justify-between">
          <span>Recent Tasks</span>
          <span className="bg-white/10 px-2 py-0.5 rounded-full text-[10px]">{tasks.length}</span>
        </h4>
        
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center opacity-50">
            <CheckCircle2 className="w-10 h-10 text-gray-500 mb-2" />
            <p className="text-gray-400 text-sm">No tasks created yet.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {tasks.map((task, idx) => {
              const projName = projects?.find(p => p._id === (task.project?._id || task.project))?.name || 'Unknown';
              return (
                <div key={idx} className="group bg-white/5 hover:bg-white/10 p-3.5 rounded-xl border border-white/10 transition-all shadow-sm">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <p className="text-white text-sm font-medium leading-tight">{task.title}</p>
                    {getStatusBadge(task.status || 'todo')}
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-400 text-xs mt-2 bg-black/20 w-fit px-2 py-1 rounded border border-white/5">
                    <FolderGit2 className="w-3 h-3" />
                    <span className="truncate max-w-[150px]">{projName}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default TasksPanel;
