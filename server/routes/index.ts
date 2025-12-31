import express from "express";
const router = express.Router();
import noteRoutes from "./notes.route.ts";

router.use("/api/notes", noteRoutes);

export default router;
