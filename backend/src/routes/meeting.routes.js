import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";

import {
  createMeeting,
  joinMeeting,
  getMyMeetings,
  leaveMeeting,
  endMeeting,
  getMeetingById,
  deleteMeeting,
  uploadRecording,
} from "../controllers/meeting.controller.js";
import { upload } from "../middleware/multer.middleware.js";

const router = Router();

router.route("/create").post(verifyJWT, createMeeting);

router.route("/join").post(verifyJWT, joinMeeting);

router.route("/my-meetings").get(
  verifyJWT,
  getMyMeetings
);

router.route("/leave").post(
  verifyJWT,
  leaveMeeting
);

router.route("/end/:meetingCode").patch(
  verifyJWT,
  endMeeting
);

router.route("/:meetingId")
  .get(verifyJWT, getMeetingById)
  .delete(verifyJWT, deleteMeeting);

router.route("/upload-recording/:meetingCode").post(
  verifyJWT,
  upload.single("video"),
  uploadRecording
);

export default router;

