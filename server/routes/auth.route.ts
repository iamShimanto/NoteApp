import { Router } from "express";
import * as user from "../controllers/auth.controller";
import * as auth from "../middleware/auth.middleware";

const router = Router();

router.post("/register", user.userRegister);
router.post("/login", user.userLogin);
router.post("/refresh", user.refreshAccessToken);
router.post("/logout", user.userLogout);
router.get("/getprofile", auth.authMiddleware, user.getUserProfile);
router.put("/profile", auth.authMiddleware, user.updateUserProfile);
router.put("/password", auth.authMiddleware, user.changeUserPassword);

export default router;
