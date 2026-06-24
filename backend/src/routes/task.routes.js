import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  createTask,
  getTasksByProject,
  updateTask,
  deleteTask,
} from "../controllers/task.controller.js";

const router = Router();

router.use(verifyJWT);

router.route("/").post(createTask);
router.route("/project/:projectId").get(getTasksByProject);
router.route("/:id").put(updateTask).delete(deleteTask);

export default router;
