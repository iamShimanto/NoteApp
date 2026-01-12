import { Router } from "express";
import * as user from "../controllers/auth.controller";
import * as auth from "../middleware/auth.middleware";

const router = Router();

router.post("/register", user.userRegister);
router.post("/login", user.userLogin);
router.get("/getprofile", auth.authMiddleware, user.getUserProfile);

export default router;
