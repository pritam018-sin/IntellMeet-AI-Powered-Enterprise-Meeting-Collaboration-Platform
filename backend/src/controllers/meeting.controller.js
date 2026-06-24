import Meeting from "../models/meeting.model.js";
import ApiError from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const generateMeetingCode = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

  return Array.from(
    { length: 8 },
    () => chars[Math.floor(Math.random() * chars.length)]
  ).join("");
};

const createUniqueMeetingCode = async () => {
  let code;
  let exists = true;

  while (exists) {
    code = generateMeetingCode();
    exists = await Meeting.exists({ meetingCode: code });
  }

  return code;
};

const createMeeting = asyncHandler(async (req, res) => {
  const { title } = req.body;

  if (!title?.trim()) {
    throw new ApiError(400, "Meeting title is required");
  }

  const meetingCode = await createUniqueMeetingCode();

  const meeting = await Meeting.create({
    title,
    meetingCode,
    host: req.user._id,
    status: "active",
    participants: [
      {
        user: req.user._id,
        role: "host",
      },
    ],
  });

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        "Meeting created successfully",
        meeting
      )
    );
});

const joinMeeting = asyncHandler(async (req, res) => {
  const { meetingCode } = req.body;

  if (!meetingCode?.trim()) {
    throw new ApiError(400, "Meeting code is required");
  }

  const meeting = await Meeting.findOne({
    meetingCode: meetingCode.toUpperCase(),
  });

  if (!meeting) {
    throw new ApiError(404, "Meeting not found");
  }

  if (meeting.status === "ended") {
    throw new ApiError(400, "This meeting has already ended");
  }

  const alreadyJoined = meeting.participants.some((participant) =>
    participant.user.equals(req.user._id)
  );

  if (!alreadyJoined) {
    meeting.participants.push({
      user: req.user._id,
      role: "member",
    });
    await meeting.save();
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Joined meeting successfully",
        meeting
      )
    );
});

const getMyMeetings = asyncHandler(async (req, res) => {
  const meetings = await Meeting.find({
    $or: [
      { host: req.user._id },
      { "participants.user": req.user._id },
    ],
  })
    .populate("host", "name email avatar")
    .populate("participants.user", "name email avatar")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Meetings fetched successfully",
        meetings
      )
    );
});

const leaveMeeting = asyncHandler(async (req, res) => {
  const { meetingCode } = req.body;

  const meeting = await Meeting.findOne({
    meetingCode: meetingCode.toUpperCase(),
  });

  if (!meeting) {
    throw new ApiError(404, "Meeting not found");
  }

  // We do not remove the participant from the array because they need to retain access to the meeting history, notes, and recordings.
  // Real-time presence is handled by Socket.IO.
  
  // Optionally, we could record a 'leftAt' timestamp here, but for now we just return success.

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Left meeting successfully",
        meeting
      )
    );
});

const endMeeting = asyncHandler(async (req, res) => {
  const { meetingCode } = req.params;
  const { sharedNotes } = req.body;

  const meeting = await Meeting.findOne({ meetingCode: meetingCode.toUpperCase() });

  if (!meeting) {
    throw new ApiError(404, "Meeting not found");
  }

  if (!meeting.host.equals(req.user._id)) {
    throw new ApiError(
      403,
      "Only host can end this meeting"
    );
  }

  meeting.status = "ended";
  if (sharedNotes !== undefined) {
    meeting.sharedNotes = sharedNotes;
  }

  await meeting.save();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Meeting ended successfully",
        meeting
      )
    );
});

const getMeetingById = asyncHandler(async (req, res) => {
  const { meetingId } = req.params;
  const meeting = await Meeting.findById(meetingId)
    .populate("host", "name email avatar")
    .populate("participants.user", "name email avatar");

  if (!meeting) {
    throw new ApiError(404, "Meeting not found");
  }

  // Ensure only host or participants can view it
  const isHost = meeting.host._id.equals(req.user._id);
  const isParticipant = meeting.participants.some((p) => p.user._id.equals(req.user._id));

  if (!isHost && !isParticipant) {
    throw new ApiError(403, "Not authorized to view this meeting details");
  }

  return res.status(200).json(new ApiResponse(200, "Meeting fetched successfully", meeting));
});

const deleteMeeting = asyncHandler(async (req, res) => {
  const { meetingId } = req.params;
  const meeting = await Meeting.findById(meetingId);

  if (!meeting) {
    throw new ApiError(404, "Meeting not found");
  }

  if (!meeting.host.equals(req.user._id)) {
    throw new ApiError(403, "Only the host can delete this meeting");
  }

  await meeting.deleteOne();

  return res.status(200).json(new ApiResponse(200, "Meeting deleted successfully", {}));
});

import { cloudinaryUploadVideo } from "../utils/cloudinaryService.js";

const uploadRecording = asyncHandler(async (req, res) => {
  const { meetingCode } = req.params;

  if (!req.file) {
    throw new ApiError(400, "No video file provided");
  }

  const meeting = await Meeting.findOne({ meetingCode: meetingCode.toUpperCase() });
  if (!meeting) {
    throw new ApiError(404, "Meeting not found");
  }

  if (!meeting.host.equals(req.user._id)) {
    throw new ApiError(403, "Only the host can upload the recording");
  }

  const uploadResponse = await cloudinaryUploadVideo(req.file.path);
  if (!uploadResponse) {
    throw new ApiError(500, "Failed to upload recording to Cloudinary");
  }

  meeting.recordingUrl = uploadResponse.secure_url;
  await meeting.save();

  return res.status(200).json(new ApiResponse(200, "Recording uploaded successfully", meeting));
});

export {
  createMeeting,
  joinMeeting,
  getMyMeetings,
  leaveMeeting,
  endMeeting,
  getMeetingById,
  deleteMeeting,
  uploadRecording
};
