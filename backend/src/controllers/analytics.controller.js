import Meeting from "../models/meeting.model.js";
import Task from "../models/task.model.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// @desc    Get dashboard analytics (Meeting stats, task completion rates)
// @route   GET /api/v1/analytics/dashboard
export const getDashboardAnalytics = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // 1. Meeting Stats
  const meetings = await Meeting.find({
    $or: [{ host: userId }, { "participants.user": userId }],
  });

  const totalMeetings = meetings.length;
  const activeMeetings = meetings.filter((m) => m.status === "active").length;
  const completedMeetings = meetings.filter((m) => m.status === "ended").length;

  // Group meetings by month for charting
  const meetingsByMonth = {};
  meetings.forEach((m) => {
    const month = m.createdAt.toLocaleString("default", { month: "short", year: "numeric" });
    meetingsByMonth[month] = (meetingsByMonth[month] || 0) + 1;
  });

  const meetingChartData = Object.keys(meetingsByMonth).map((key) => ({
    name: key,
    meetings: meetingsByMonth[key],
  }));

  // 2. Task Stats
  const tasks = await Task.find({ assignee: userId });
  
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "done").length;
  const pendingTasks = totalTasks - completedTasks;

  const taskChartData = [
    { name: "Done", value: completedTasks },
    { name: "Pending", value: pendingTasks },
  ];

  return res.status(200).json(
    new ApiResponse(
      200,
      "Analytics retrieved successfully",
      {
        totalMeetings,
        activeMeetings,
        completedMeetings,
        meetingChartData,
        totalTasks,
        completedTasks,
        pendingTasks,
        taskChartData,
      }
    )
  );
});
