import Task from "../models/task.model.js";
import Project from "../models/project.model.js";
import ApiError from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// @desc    Create a new task
// @route   POST /api/v1/tasks
export const createTask = asyncHandler(async (req, res) => {
  const { title, description, projectId, assigneeId, meetingId } = req.body;

  if (!title || !projectId) {
    throw new ApiError(400, "Task title and project ID are required");
  }

  const project = await Project.findById(projectId).populate("workspace");
  if (!project) throw new ApiError(404, "Project not found");

  const isMember = project.workspace.members.some((m) => m.user.toString() === req.user._id.toString());
  
  let isMeetingParticipant = false;
  if (meetingId) {
      const Meeting = (await import("../models/meeting.model.js")).default;
      const meeting = await Meeting.findById(meetingId);
      if (meeting) {
          isMeetingParticipant = meeting.host.equals(req.user._id) || meeting.participants.some(p => p.user.equals(req.user._id));
      }
  }

  if (!isMember && !isMeetingParticipant) throw new ApiError(403, "Not authorized to create tasks in this project");

  const task = await Task.create({
    title,
    description,
    project: projectId,
    assignee: assigneeId || null,
    meeting: meetingId || null,
  });

  return res.status(201).json(new ApiResponse(201, "Task created successfully", task));
});

// @desc    Get tasks by project
// @route   GET /api/v1/tasks/project/:projectId
export const getTasksByProject = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  const project = await Project.findById(projectId).populate("workspace");
  if (!project) throw new ApiError(404, "Project not found");

  const isMember = project.workspace.members.some((m) => m.user.toString() === req.user._id.toString());
  if (!isMember) throw new ApiError(403, "Not authorized");

  const tasks = await Task.find({ project: projectId }).populate("assignee", "name avatar");

  return res.status(200).json(new ApiResponse(200, "Tasks retrieved successfully", tasks));
});

// @desc    Update task (status, assignee, etc)
// @route   PUT /api/v1/tasks/:id
export const updateTask = asyncHandler(async (req, res) => {
  const { title, description, status, assignee, priority, dueDate } = req.body;
  const task = await Task.findById(req.params.id).populate({
    path: "project",
    populate: { path: "workspace" },
  });

  if (!task) throw new ApiError(404, "Task not found");

  const isMember = task.project.workspace.members.some((m) => m.user.toString() === req.user._id.toString());
  if (!isMember) throw new ApiError(403, "Not authorized");

  if (title) task.title = title;
  if (description !== undefined) task.description = description;
  if (status) task.status = status;
  if (assignee) task.assignee = assignee;
  if (priority) task.priority = priority;
  if (dueDate) task.dueDate = dueDate;

  await task.save();

  return res.status(200).json(new ApiResponse(200, "Task updated successfully", task));
});

// @desc    Delete task
// @route   DELETE /api/v1/tasks/:id
export const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id).populate({
    path: "project",
    populate: { path: "workspace" },
  });

  if (!task) throw new ApiError(404, "Task not found");

  const isMember = task.project.workspace.members.some((m) => m.user.toString() === req.user._id.toString());
  if (!isMember) throw new ApiError(403, "Not authorized");

  await task.deleteOne();
  return res.status(200).json(new ApiResponse(200, "Task deleted successfully", null));
});
