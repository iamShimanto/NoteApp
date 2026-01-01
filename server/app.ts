import "dotenv/config";
import express from "express";
const app = express();
import routes from "./routes/index.ts";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import env from "./utils/validEnv.ts";

app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  })
);

app.use(routes);

export default app;
