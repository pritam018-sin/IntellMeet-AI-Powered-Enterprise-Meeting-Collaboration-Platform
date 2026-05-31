import {Router} from "express";
import {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    getCurrentUser,
    updateAccountDetails,
    updateAvatar,
    changeCurrentPassword,

} from "../controllers/user.controller.js";
import {upload} from "../middleware/multer.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.route('/register').post(upload.single('avatar'), registerUser);
router.route('/login').post(loginUser);
router.route('/logout').post(verifyJWT, logoutUser);
router.route('/refresh-token').post(refreshAccessToken);
router.route('/me').get(verifyJWT, getCurrentUser);
router.route('/update-account').put(verifyJWT, updateAccountDetails);
router.route('/update-avatar').put(verifyJWT, upload.single('avatar'), updateAvatar);
router.route('/change-password').put(verifyJWT, changeCurrentPassword);


export default router;