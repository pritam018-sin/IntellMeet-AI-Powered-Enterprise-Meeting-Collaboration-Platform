import Project from "../models/project.model.js";
import Workspace from "../models/workspace.model.js";
import ApiError from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// @desc    Create a new project
// @route   POST /api/v1/projects
export const createProject = asyncHandler(async (req, res) => {
  const { name, description, workspaceId } = req.body;

  if (!name || !workspaceId) {
    throw new ApiError(400, "Project name and workspace ID are required");
  }

  // Check if workspace exists and user is a member
  const workspace = await Workspace.findById(workspaceId);
  if (!workspace) throw new ApiError(404, "Workspace not found");

  const isMember = workspace.members.some((m) => m.user.toString() === req.user._id.toString());
  if (!isMember) {
    throw new ApiError(403, "You must be a member of the workspace to create a project");
  }

  const project = await Project.create({
    name,
    description,
    workspace: workspaceId,
  });

  return res.status(201).json(new ApiResponse(201, "Project created successfully", project));
});

// @desc    Get all projects for a workspace
// @route   GET /api/v1/projects/workspace/:workspaceId
export const getProjectsByWorkspace = asyncHandler(async (req, res) => {
  const { workspaceId } = req.params;

  const workspace = await Workspace.findById(workspaceId);
  if (!workspace) throw new ApiError(404, "Workspace not found");

  const isMember = workspace.members.some((m) => m.user.toString() === req.user._id.toString());
  if (!isMember) throw new ApiError(403, "Not authorized");

  const projects = await Project.find({ workspace: workspaceId });

  return res.status(200).json(new ApiResponse(200, "Projects retrieved successfully", projects));
});

// @desc    Get project by ID
// @route   GET /api/v1/projects/:id
export const getProjectById = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id).populate("workspace");
  if (!project) throw new ApiError(404, "Project not found");

  const isMember = project.workspace.members.some((m) => m.user.toString() === req.user._id.toString());
  if (!isMember) throw new ApiError(403, "Not authorized");

  return res.status(200).json(new ApiResponse(200, "Project retrieved successfully", project));
});

// @desc    Update project
// @route   PUT /api/v1/projects/:id
export const updateProject = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const project = await Project.findById(req.params.id).populate("workspace");

  if (!project) throw new ApiError(404, "Project not found");

  const isMember = project.workspace.members.some((m) => m.user.toString() === req.user._id.toString());
  if (!isMember) throw new ApiError(403, "Not authorized");

  project.name = name || project.name;
  project.description = description !== undefined ? description : project.description;
  await project.save();

  return res.status(200).json(new ApiResponse(200, "Project updated successfully", project));
});

// @desc    Delete project
// @route   DELETE /api/v1/projects/:id
export const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id).populate("workspace");

  if (!project) throw new ApiError(404, "Project not found");

  // Only workspace admin/owner can delete? For now, checking member role.
  const isOwner = project.workspace.owner.toString() === req.user._id.toString();
  if (!isOwner) throw new ApiError(403, "Only workspace owner can delete projects");

  await project.deleteOne();
  return res.status(200).json(new ApiResponse(200, "Project deleted successfully", null));
});
