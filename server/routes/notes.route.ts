import { Router } from "express";
import * as note from "../controllers/note.controller";
import * as auth from "../middleware/auth.middleware";
const router = Router();

router.get("/", auth.authMiddleware, note.getNotes);
router.post("/create", auth.authMiddleware, note.createNotes);
router.delete("/completed", auth.authMiddleware, note.deleteCompletedNotes);
router.post("/bulk-delete", auth.authMiddleware, note.bulkDeleteNotes);
router.get("/:id", auth.authMiddleware, note.getSingleNote);
router.put("/:id", auth.authMiddleware, note.updateNote);
router.delete("/:id", auth.authMiddleware, note.deleteNote);

export default router;
