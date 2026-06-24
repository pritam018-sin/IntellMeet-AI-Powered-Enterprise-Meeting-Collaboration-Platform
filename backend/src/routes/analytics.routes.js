import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { getDashboardAnalytics } from "../controllers/analytics.controller.js";

const router = Router();

router.use(verifyJWT);

router.route("/dashboard").get(getDashboardAnalytics);

export default router;
