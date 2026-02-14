import type { RequestHandler } from "express";
import { verifyAccessToken } from "../utils/token";

export const authMiddleware: RequestHandler = (req, res, next) => {
  try {
    const token = req.cookies?.access_token;
    if (!token || typeof token !== "string") {
      return res.status(401).send({ message: "Unauthorized" });
    }

    const decoded = verifyAccessToken(token);

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).send({ message: "Unauthorized" });
  }
};
