import Workspace from "../models/workspace.model.js";
import ApiError from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// @desc    Create a new workspace
// @route   POST /api/v1/workspaces
export const createWorkspace = asyncHandler(async (req, res) => {
  const { name } = req.body;

  if (!name) {
    throw new ApiError(400, "Workspace name is required");
  }

  const workspace = await Workspace.create({
    name,
    owner: req.user._id,
    members: [{ user: req.user._id, role: "admin" }],
  });

  return res.status(201).json(new ApiResponse(201, "Workspace created successfully", workspace));
});

// @desc    Get all workspaces for the logged in user
// @route   GET /api/v1/workspaces
export const getMyWorkspaces = asyncHandler(async (req, res) => {
  const workspaces = await Workspace.find({ "members.user": req.user._id })
    .populate("owner", "name email avatar")
    .populate("members.user", "name email avatar");

  return res.status(200).json(new ApiResponse(200, "Workspaces retrieved successfully", workspaces));
});

// @desc    Get workspace by ID
// @route   GET /api/v1/workspaces/:id
export const getWorkspaceById = asyncHandler(async (req, res) => {
  const workspace = await Workspace.findById(req.params.id)
    .populate("owner", "name email avatar")
    .populate("members.user", "name email avatar");

  if (!workspace) {
    throw new ApiError(404, "Workspace not found");
  }

  // Check if user is a member
  const isMember = workspace.members.some((m) => m.user._id.toString() === req.user._id.toString());
  if (!isMember) {
    throw new ApiError(403, "Not authorized to access this workspace");
  }

  return res.status(200).json(new ApiResponse(200, "Workspace retrieved successfully", workspace));
});

// @desc    Update workspace
// @route   PUT /api/v1/workspaces/:id
export const updateWorkspace = asyncHandler(async (req, res) => {
  const { name } = req.body;
  let workspace = await Workspace.findById(req.params.id);

  if (!workspace) throw new ApiError(404, "Workspace not found");
  
  if (workspace.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Only the owner can update the workspace");
  }

  workspace.name = name || workspace.name;
  await workspace.save();

  return res.status(200).json(new ApiResponse(200, "Workspace updated successfully", workspace));
});

// @desc    Delete workspace
// @route   DELETE /api/v1/workspaces/:id
export const deleteWorkspace = asyncHandler(async (req, res) => {
  const workspace = await Workspace.findById(req.params.id);

  if (!workspace) throw new ApiError(404, "Workspace not found");

  if (workspace.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Only the owner can delete the workspace");
  }

  await workspace.deleteOne();
  return res.status(200).json(new ApiResponse(200, "Workspace deleted successfully", null));
});
