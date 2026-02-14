import "dotenv/config";
import express from "express";
const app = express();
import path from "path";
import routes from "./routes/index";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import env from "./utils/validEnv";

app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  }),
);

app.use(routes);

if (process.env.NODE_ENV === "production") {
  const clientDistPath = path.resolve(__dirname, "..", "..", "client", "dist");
  app.use(express.static(clientDistPath));

  app.get("*", (req, res) => {
    if (req.path.startsWith("/api/")) {
      return res.status(404).send({ message: "Endpoint not found" });
    }
    return res.sendFile(path.join(clientDistPath, "index.html"));
  });
}

export default app;
