import "dotenv/config";
import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
const app = express();
import routes from "./routes/index.ts";

app.use(routes);

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ message: "Endpoint not found" });
  next();
});

app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  console.log(error);
  let errorMessage = "Internal server error";
  if (error instanceof Error) errorMessage = error.message;
  res.status(500).json({ message: errorMessage });
  next();
});

export default app;
