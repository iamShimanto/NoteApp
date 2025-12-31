import express from "express";
import { getNotes } from "../controllers/note.controller.ts";
const router = express.Router();

router.get("/", getNotes);

export default router;
