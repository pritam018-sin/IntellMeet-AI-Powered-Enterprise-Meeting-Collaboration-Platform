import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  createWorkspace,
  getMyWorkspaces,
  getWorkspaceById,
  updateWorkspace,
  deleteWorkspace,
} from "../controllers/workspace.controller.js";

const router = Router();

router.use(verifyJWT);

router.route("/").post(createWorkspace).get(getMyWorkspaces);
router.route("/:id").get(getWorkspaceById).put(updateWorkspace).delete(deleteWorkspace);

export default router;
