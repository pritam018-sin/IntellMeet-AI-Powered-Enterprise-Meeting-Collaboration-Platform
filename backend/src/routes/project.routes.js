import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  createProject,
  getProjectsByWorkspace,
  getProjectById,
  updateProject,
  deleteProject,
} from "../controllers/project.controller.js";

const router = Router();

router.use(verifyJWT);

router.route("/").post(createProject);
router.route("/workspace/:workspaceId").get(getProjectsByWorkspace);
router.route("/:id").get(getProjectById).put(updateProject).delete(deleteProject);

export default router;
