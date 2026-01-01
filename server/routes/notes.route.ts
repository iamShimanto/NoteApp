import { Router } from "express";
import * as note from "../controllers/note.controller.ts";
import * as auth from "../middleware/auth.middleware.ts";
const router = Router();

router.get("/", auth.authMiddleware, note.getNotes);
router.post("/create", auth.authMiddleware, note.createNotes);

export default router;
