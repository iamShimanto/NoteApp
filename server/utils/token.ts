import jwt, { type JwtPayload } from "jsonwebtoken";
import env from "./validEnv";
import type { Types } from "mongoose";

type TokenType = "access" | "refresh";

interface payload {
  userId: string;
  email: string;
  tokenType: TokenType;
}

export const generateAccessToken = (payload: {
  userId: Types.ObjectId;
  email: string;
}): string => {
  const jwtPayload: payload = {
    userId: payload.userId.toString(),
    email: payload.email,
    tokenType: "access",
  };

  const token = jwt.sign(jwtPayload, env.JWT_SECRET, { expiresIn: "15m" });
  return token;
};

export const generateRefreshToken = (payload: {
  userId: Types.ObjectId;
  email: string;
}): string => {
  const jwtPayload: payload = {
    userId: payload.userId.toString(),
    email: payload.email,
    tokenType: "refresh",
  };

  const token = jwt.sign(jwtPayload, env.JWT_SECRET, { expiresIn: "7d" });
  return token;
};

const verifyTypedToken = (
  token: string,
  expectedType: TokenType,
): payload & JwtPayload => {
  const decoded = jwt.verify(token, env.JWT_SECRET);

  if (typeof decoded === "string") {
    throw new Error("Invalid token payload");
  }

  if (
    typeof decoded.userId !== "string" ||
    typeof decoded.email !== "string" ||
    (decoded as any).tokenType !== expectedType
  ) {
    throw new Error("Token missing required field");
  }

  return decoded as payload & JwtPayload;
};

export const verifyAccessToken = (token: string): payload & JwtPayload => {
  return verifyTypedToken(token, "access");
};

export const verifyRefreshToken = (token: string): payload & JwtPayload => {
  return verifyTypedToken(token, "refresh");
};
