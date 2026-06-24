import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useGetProjectsByWorkspaceQuery, useGetTasksByProjectQuery, useUpdateTaskMutation, useGetMyWorkspacesQuery, useCreateTaskMutation } from '../redux/api/projectApi';
import { CheckCircle2, Circle, Clock, Plus, GripVertical, FolderGit2 } from 'lucide-react';
import toast from 'react-hot-toast';

const ProjectManagement = () => {
  const { data: workspacesResponse } = useGetMyWorkspacesQuery();
  const workspaces = workspacesResponse?.data;
  
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const { data: projectsResponse } = useGetProjectsByWorkspaceQuery(selectedWorkspaceId, { skip: !selectedWorkspaceId });
  const projects = projectsResponse?.data;

  const { data: tasksResponse, refetch: refetchTasks } = useGetTasksByProjectQuery(selectedProjectId, { skip: !selectedProjectId });
  const tasks = tasksResponse?.data;

  const [updateTask] = useUpdateTaskMutation();
  const [createTask] = useCreateTaskMutation();

  const [columns, setColumns] = useState({
    'todo': { id: 'todo', title: 'To Do', taskIds: [] },
    'in-progress': { id: 'in-progress', title: 'In Progress', taskIds: [] },
    'done': { id: 'done', title: 'Done', taskIds: [] }
  });

  useEffect(() => {
    if (workspaces && workspaces.length > 0 && !selectedWorkspaceId) {
      setSelectedWorkspaceId(workspaces[0]._id);
    }
  }, [workspaces, selectedWorkspaceId]);

  useEffect(() => {
    if (projects && projects.length > 0 && !selectedProjectId) {
      setSelectedProjectId(projects[0]._id);
    }
  }, [projects, selectedProjectId]);

  useEffect(() => {
    if (tasks) {
      const newColumns = {
        'todo': { id: 'todo', title: 'To Do', taskIds: [] },
        'in-progress': { id: 'in-progress', title: 'In Progress', taskIds: [] },
        'done': { id: 'done', title: 'Done', taskIds: [] }
      };

      tasks.forEach(task => {
        if (newColumns[task.status]) {
          newColumns[task.status].taskIds.push(task);
        }
      });
      setColumns(newColumns);
    }
  }, [tasks]);

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const sourceCol = columns[source.droppableId];
    const destCol = columns[destination.droppableId];

    const sourceTaskIds = Array.from(sourceCol.taskIds);
    const [removed] = sourceTaskIds.splice(source.index, 1);
    
    // Update locally for optimistic UI
    if (source.droppableId === destination.droppableId) {
      sourceTaskIds.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: { ...sourceCol, taskIds: sourceTaskIds }
      });
    } else {
      const destTaskIds = Array.from(destCol.taskIds);
      destTaskIds.splice(destination.index, 0, removed);
      
      setColumns({
        ...columns,
        [source.droppableId]: { ...sourceCol, taskIds: sourceTaskIds },
        [destination.droppableId]: { ...destCol, taskIds: destTaskIds }
      });

      // Update backend
      try {
        await updateTask({ id: draggableId, status: destination.droppableId }).unwrap();
      } catch (error) {
        console.error("Failed to update task status:", error);
        toast.error("Failed to update task status");
        refetchTasks();
      }
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || !selectedProjectId) return;

    try {
      await createTask({
        title: newTaskTitle,
        projectId: selectedProjectId
      }).unwrap();
      setNewTaskTitle('');
      toast.success("Task added");
    } catch (error) {
      console.error("Failed to create task", error);
      toast.error("Failed to create task");
    }
  };

  const getColumnIcon = (id) => {
    switch(id) {
      case 'todo': return <Circle className="w-5 h-5 text-slate-400" />;
      case 'in-progress': return <Clock className="w-5 h-5 text-blue-500" />;
      case 'done': return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      default: return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 h-full flex flex-col bg-transparent">
      <div className="flex justify-between items-center mb-8 flex-wrap gap-4 bg-white/50 dark:bg-white/5 p-4 rounded-2xl border border-slate-200 dark:border-white/10 backdrop-blur-md shadow-sm">
        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">Project Boards</h1>
        
        <div className="flex gap-4">
          <select 
            value={selectedWorkspaceId} 
            onChange={(e) => { setSelectedWorkspaceId(e.target.value); setSelectedProjectId(''); }}
            className="px-4 py-2 border rounded-xl bg-white dark:bg-black/40 border-slate-200 dark:border-white/10 text-slate-900 dark:text-white shadow-sm focus:ring-2 focus:ring-red-500/50 outline-none transition-all cursor-pointer"
          >
            <option value="" disabled>Select Workspace</option>
            {workspaces?.map(w => (
              <option key={w._id} value={w._id}>{w.name}</option>
            ))}
          </select>

          <select 
            value={selectedProjectId} 
            onChange={(e) => setSelectedProjectId(e.target.value)}
            disabled={!selectedWorkspaceId || !projects || projects.length === 0}
            className="px-4 py-2 border rounded-xl bg-white dark:bg-black/40 border-slate-200 dark:border-white/10 text-slate-900 dark:text-white shadow-sm focus:ring-2 focus:ring-red-500/50 outline-none transition-all disabled:opacity-50 cursor-pointer"
          >
            <option value="" disabled>Select Project</option>
            {projects?.map(p => (
              <option key={p._id} value={p._id}>{p.name}</option>
            ))}
          </select>
        </div>
      </div>

      {!selectedProjectId ? (
        <div className="flex-1 flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 opacity-70">
           <FolderGit2 className="w-16 h-16 mb-4 text-slate-300 dark:text-slate-600" />
           <p className="text-lg">Please select a workspace and project to view the board.</p>
        </div>
      ) : (
        <>
          <form onSubmit={handleCreateTask} className="mb-8 flex gap-3">
            <input 
              type="text" 
              placeholder="What needs to be done?" 
              className="flex-1 px-5 py-3 border rounded-xl bg-white dark:bg-black/40 border-slate-200 dark:border-white/10 text-slate-900 dark:text-white shadow-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
            />
            <button type="submit" className="px-6 py-3 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 transition-colors shadow-md shadow-red-600/20 flex items-center gap-2 active:scale-95">
              <Plus className="w-5 h-5" />
              Add Task
            </button>
          </form>

          <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex gap-6 overflow-x-auto pb-4 flex-1 custom-scrollbar items-start">
              {Object.values(columns).map(column => (
                <div key={column.id} className="bg-slate-50/80 dark:bg-black/40 w-80 rounded-2xl p-4 flex flex-col shrink-0 border border-slate-200/60 dark:border-white/5 backdrop-blur-xl shadow-sm">
                  <div className="flex items-center justify-between mb-5 px-2">
                    <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                      {getColumnIcon(column.id)}
                      {column.title}
                    </h3>
                    <span className="bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-300 text-xs font-bold px-2.5 py-1 rounded-full">
                      {column.taskIds.length}
                    </span>
                  </div>
                  
                  <Droppable droppableId={column.id}>
                    {(provided, snapshot) => (
                      <div 
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`flex-1 transition-colors rounded-xl min-h-[150px] ${snapshot.isDraggingOver ? 'bg-slate-200/50 dark:bg-white/5 ring-1 ring-inset ring-slate-300 dark:ring-white/10' : ''}`}
                      >
                        {column.taskIds.map((task, index) => (
                          <Draggable key={task._id} draggableId={task._id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`mb-3 p-4 bg-white dark:bg-[#1a1a1a] rounded-xl shadow-sm border border-slate-200 dark:border-white/10 group hover:border-red-500/50 dark:hover:border-red-500/50 transition-all ${snapshot.isDragging ? 'shadow-xl shadow-red-900/20 ring-2 ring-red-500 rotate-2 scale-105 z-50 cursor-grabbing' : 'cursor-grab'}`}
                              >
                                <div className="flex items-start gap-3">
                                  <div className="mt-0.5 opacity-0 group-hover:opacity-40 transition-opacity text-slate-400">
                                    <GripVertical className="w-4 h-4" />
                                  </div>
                                  <div className="flex-1">
                                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 leading-snug">{task.title}</p>
                                    {task.description && (
                                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">{task.description}</p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              ))}
            </div>
          </DragDropContext>
        </>
      )}
    </div>
  );
};

export default ProjectManagement;
