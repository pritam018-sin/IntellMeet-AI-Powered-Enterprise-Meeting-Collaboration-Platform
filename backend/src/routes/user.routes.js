import {Router} from "express";
import {
    registerUser
} from "../controllers/user.controller.js";
import {upload} from "../middleware/multer.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.route('/register').post(upload.single('avatar'), registerUser);

export default router;