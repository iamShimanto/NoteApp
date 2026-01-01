import {
  Router,
  type NextFunction,
  type Request,
  type Response,
} from "express";
const router = Router();
import noteRoutes from "./notes.route.ts";
import authRoutes from "./auth.route.ts";

router.use("/api/auth", authRoutes);
router.use("/api/notes", noteRoutes);

router.get("/", (req, res) => {
  res.send("Server is running");
});

router.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ message: "Endpoint not found" });
  next();
});

router.use(
  (error: unknown, req: Request, res: Response, next: NextFunction) => {
    console.log(error);
    let errorMessage = "Internal server error";
    if (error instanceof Error) errorMessage = error.message;
    res.status(500).json({ message: errorMessage });
    next();
  }
);

export default router;
