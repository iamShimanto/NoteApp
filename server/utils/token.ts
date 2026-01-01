import jwt, { type JwtPayload } from "jsonwebtoken";
import env from "./validEnv.ts";
import type { Types } from "mongoose";

interface payload {
  userId: string;
  email: string;
}

export const generateToken = (payload: {
  userId: Types.ObjectId;
  email: string;
}): string => {
  const jwtPayload: payload = {
    userId: payload.userId.toString(),
    email: payload.email,
  };

  const token = jwt.sign(jwtPayload, env.JWT_SECRET);
  return token;
};

export const verifyToken = (token: string): payload & JwtPayload => {
  const decoded = jwt.verify(token, env.JWT_SECRET);

  if (typeof decoded === "string") {
    throw new Error("Invalid token payload");
  }

  if (typeof decoded.userId !== "string" || typeof decoded.email !== "string") {
    throw new Error("Token missing required field");
  }

  return decoded as payload & JwtPayload;
};
