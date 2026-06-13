import React, { useState } from 'react';
import { Plus, Trash2, ArrowRight, ArrowLeft, Trello, Calendar, Tag, User } from 'lucide-react';

export default function KanbanBoard() {
  const [activeWorkspace, setActiveWorkspace] = useState('web-dev');
  const [columns, setColumns] = useState({
    todo: [
      { id: 't-1', title: 'Optimize OpenAI Whisper token compression', desc: 'Implement token reduction in backend audio stream handler.', assignee: 'Alice', priority: 'High', date: 'June 18' },
      { id: 't-2', title: 'Finalize meeting PDF report export', desc: 'Format standard multi-page A4 document template output.', assignee: 'Dave', priority: 'Medium', date: 'June 20' }
    ],
    progress: [
      { id: 't-3', title: 'Set up Socket.io connection bottlenecks', desc: 'Benchmark websocket clustering under high load constraints.', assignee: 'Bob', priority: 'High', date: 'June 15' }
    ],
    done: [
      { id: 't-4', title: 'Integrate Cloudinary photo services', desc: 'Avatar file uploads fully verified on profile creation.', assignee: 'Sarah', priority: 'Medium', date: 'June 12' }
    ]
  });

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskAssignee, setNewTaskAssignee] = useState('Sarah');
  const [newTaskPriority, setNewTaskPriority] = useState('Medium');
  const [showAddForm, setShowAddForm] = useState(false);

  const moveTask = (taskId, sourceCol, destCol) => {
    const task = columns[sourceCol].find(t => t.id === taskId);
    if (!task) return;

    setColumns({
      ...columns,
      [sourceCol]: columns[sourceCol].filter(t => t.id !== taskId),
      [destCol]: [...columns[destCol], task]
    });
  };

  const createTask = (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask = {
      id: `t-${Date.now()}`,
      title: newTaskTitle.trim(),
      desc: newTaskDesc.trim(),
      assignee: newTaskAssignee,
      priority: newTaskPriority,
      date: 'June 24'
    };

    setColumns({
      ...columns,
      todo: [...columns.todo, newTask]
    });

    setNewTaskTitle('');
    setNewTaskDesc('');
    setShowAddForm(false);
  };

  const deleteTask = (taskId, colId) => {
    setColumns({
      ...columns,
      [colId]: columns[colId].filter(t => t.id !== taskId)
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 text-left">
      {/* Workspace Selection Headers */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10 animate-fade-in">
        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
            <Trello className="text-indigo-500 h-8 w-8" />
            Project Board
          </h1>
          <p className="text-slate-400 mt-1 text-sm">Assign tasks, coordinate status boards, and monitor roadmap completion timelines.</p>
        </div>

        {/* Workspace select toggles */}
        <div className="flex bg-slate-950 p-1.5 rounded-xl border border-white/5">
          <button
            onClick={() => setActiveWorkspace('web-dev')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeWorkspace === 'web-dev' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Web Dev Domain
          </button>
          <button
            onClick={() => setActiveWorkspace('ai-model')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeWorkspace === 'ai-model' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            AI Engineering
          </button>
        </div>
      </div>

      {/* Button to open creation form */}
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Workspace Backlog</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow transition-all cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Create Task Card
        </button>
      </div>

      {/* Dynamic Task Creation Form */}
      {showAddForm && (
        <form onSubmit={createTask} className="glass-panel p-6 rounded-2xl border border-white/10 mb-8 max-w-xl animate-fade-in space-y-4">
          <h3 className="text-sm font-bold text-white">Create Workspace Task Card</h3>
          
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">Task Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Test WebRTC connection latency"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-950/60 border border-white/5 focus:border-indigo-500 rounded-xl text-xs text-white placeholder-slate-600 outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">Description</label>
            <textarea
              placeholder="Detail task acceptance criteria..."
              value={newTaskDesc}
              onChange={(e) => setNewTaskDesc(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-950/60 border border-white/5 focus:border-indigo-500 rounded-xl text-xs text-white placeholder-slate-600 outline-none min-h-[80px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">Assignee</label>
              <select
                value={newTaskAssignee}
                onChange={(e) => setNewTaskAssignee(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950/80 border border-white/5 rounded-xl text-xs text-white focus:border-indigo-500 outline-none"
              >
                <option value="Sarah">Sarah</option>
                <option value="Alice">Alice</option>
                <option value="Bob">Bob</option>
                <option value="Dave">Dave</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">Priority</label>
              <select
                value={newTaskPriority}
                onChange={(e) => setNewTaskPriority(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950/80 border border-white/5 rounded-xl text-xs text-white focus:border-indigo-500 outline-none"
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-950 border border-white/5 text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white"
            >
              Create
            </button>
          </div>
        </form>
      )}

      {/* Kanban Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Column 1: TODO */}
        <div className="glass-panel p-5 rounded-2xl border border-white/5 flex flex-col min-h-[60vh]">
          <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-slate-400" />
              To Do
            </h3>
            <span className="text-xs bg-slate-950 border border-white/5 text-slate-400 px-2 py-0.5 rounded-md font-bold">
              {columns.todo.length}
            </span>
          </div>

          <div className="space-y-4 flex-1">
            {columns.todo.map((task) => (
              <div key={task.id} className="p-4 rounded-xl border border-white/5 bg-slate-950/20 group hover:border-indigo-500/20 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded ${
                    task.priority === 'High' ? 'bg-rose-500/10 border border-rose-500/25 text-rose-400' : 'bg-amber-500/10 border border-amber-500/25 text-amber-400'
                  }`}>
                    {task.priority} Priority
                  </span>
                  <button onClick={() => deleteTask(task.id, 'todo')} className="text-slate-500 hover:text-rose-400 transition-colors opacity-0 group-hover:opacity-100">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                <h4 className="text-sm font-bold text-white mb-1">{task.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">{task.desc}</p>

                <div className="flex items-center justify-between border-t border-white/5 pt-3 mt-3">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <User className="h-3.5 w-3.5 text-indigo-400" />
                    <span>{task.assignee}</span>
                  </div>
                  <button
                    onClick={() => moveTask(task.id, 'todo', 'progress')}
                    className="h-7 w-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all cursor-pointer"
                  >
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Column 2: IN PROGRESS */}
        <div className="glass-panel p-5 rounded-2xl border border-white/5 flex flex-col min-h-[60vh]">
          <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
              In Progress
            </h3>
            <span className="text-xs bg-slate-950 border border-white/5 text-indigo-400 px-2 py-0.5 rounded-md font-bold">
              {columns.progress.length}
            </span>
          </div>

          <div className="space-y-4 flex-1">
            {columns.progress.map((task) => (
              <div key={task.id} className="p-4 rounded-xl border border-white/5 bg-slate-950/20 group hover:border-indigo-500/20 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded ${
                    task.priority === 'High' ? 'bg-rose-500/10 border border-rose-500/25 text-rose-400' : 'bg-amber-500/10 border border-amber-500/25 text-amber-400'
                  }`}>
                    {task.priority} Priority
                  </span>
                  <button onClick={() => deleteTask(task.id, 'progress')} className="text-slate-500 hover:text-rose-400 transition-colors opacity-0 group-hover:opacity-100">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                <h4 className="text-sm font-bold text-white mb-1">{task.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">{task.desc}</p>

                <div className="flex items-center justify-between border-t border-white/5 pt-3 mt-3">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <User className="h-3.5 w-3.5 text-indigo-400" />
                    <span>{task.assignee}</span>
                  </div>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => moveTask(task.id, 'progress', 'todo')}
                      className="h-7 w-7 rounded-lg bg-slate-800 border border-white/5 text-slate-400 flex items-center justify-center hover:bg-slate-700 hover:text-white transition-all cursor-pointer"
                    >
                      <ArrowLeft className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => moveTask(task.id, 'progress', 'done')}
                      className="h-7 w-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all cursor-pointer"
                    >
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Column 3: DONE */}
        <div className="glass-panel p-5 rounded-2xl border border-white/5 flex flex-col min-h-[60vh]">
          <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Completed
            </h3>
            <span className="text-xs bg-slate-950 border border-white/5 text-emerald-400 px-2 py-0.5 rounded-md font-bold">
              {columns.done.length}
            </span>
          </div>

          <div className="space-y-4 flex-1">
            {columns.done.map((task) => (
              <div key={task.id} className="p-4 rounded-xl border border-white/5 bg-slate-950/20 group hover:border-indigo-500/20 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/25 text-emerald-400">
                    Completed
                  </span>
                  <button onClick={() => deleteTask(task.id, 'done')} className="text-slate-500 hover:text-rose-400 transition-colors opacity-0 group-hover:opacity-100">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                <h4 className="text-sm font-bold text-white mb-1 line-through text-slate-400">{task.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed mb-4 line-through">{task.desc}</p>

                <div className="flex items-center justify-between border-t border-white/5 pt-3 mt-3">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <User className="h-3.5 w-3.5 text-slate-500" />
                    <span>{task.assignee}</span>
                  </div>
                  <button
                    onClick={() => moveTask(task.id, 'done', 'progress')}
                    className="h-7 w-7 rounded-lg bg-slate-800 border border-white/5 text-slate-400 flex items-center justify-center hover:bg-slate-700 hover:text-white transition-all cursor-pointer"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
