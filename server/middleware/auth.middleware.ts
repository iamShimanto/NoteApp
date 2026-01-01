import type { RequestHandler } from "express";
import { verifyToken } from "../utils/token.ts";

export const authMiddleware: RequestHandler = (req, res, next) => {
  try {
    const token: string = req.cookies.token;
    const decoded = verifyToken(token);

    req.user = decoded;
    next();
  } catch (error) {
    next(error);
  }
};
