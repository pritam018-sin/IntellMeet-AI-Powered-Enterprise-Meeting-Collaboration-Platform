import express from "express";
import { generateSummary } from "../controllers/ai.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/:meetingCode/summary", verifyJWT, generateSummary);

export default router;
