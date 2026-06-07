import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";

import {
  createMeeting,
  joinMeeting,
  getMyMeetings,
  leaveMeeting,
  endMeeting,
} from "../controllers/meeting.controller.js";

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

router.route("/end/:meetingId").patch(
  verifyJWT,
  endMeeting
);

export default router;

