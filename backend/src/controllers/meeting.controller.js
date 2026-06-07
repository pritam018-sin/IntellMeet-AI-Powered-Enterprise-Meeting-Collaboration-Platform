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

  if (alreadyJoined) {
    throw new ApiError(400, "You have already joined this meeting");
  }

  meeting.participants.push({
    user: req.user._id,
    role: "member",
  });

  await meeting.save();

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

  meeting.participants = meeting.participants.filter(
    (participant) =>
      !participant.user.equals(req.user._id)
  );

  await meeting.save();

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
  const { meetingId } = req.params;

  const meeting = await Meeting.findById(meetingId);

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

export {
  createMeeting,
  joinMeeting,
  getMyMeetings,
  leaveMeeting,
  endMeeting,
};
