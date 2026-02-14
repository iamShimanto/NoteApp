import type { RequestHandler } from "express";
import { isValidEmail } from "../utils/validator";
import UserModel from "../models/auth.schema";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/token";

export const userRegister: RequestHandler = async (req, res, next) => {
  try {
    const { fullName, email, password } = req.body;
    if (!fullName)
      return res.status(400).send({ message: "FullName is required" });
    if (!email) return res.status(400).send({ message: "Email is required" });
    if (!isValidEmail(email))
      return res.status(400).send({ message: "Enter a valid Email" });
    if (!password)
      return res.status(400).send({ message: "Password is required" });
    if (password.length < 6)
      return res.status(400).send({ message: "Password Must be 6 Characters" });

    const existUser = await UserModel.findOne({ email });
    if (existUser)
      return res.status(400).send({ message: "User already exist!" });

    const user = new UserModel({
      fullName,
      email,
      password,
    });
    await user.save();

    res.status(201).send({ message: "User Registration Successfully" });
  } catch (error) {
    next(error);
  }
};

export const userLogin: RequestHandler = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email) return res.status(400).send({ message: "Email is required" });
    if (!isValidEmail(email))
      return res.status(400).send({ message: "Enter a valid email" });
    if (!password)
      return res.status(400).send({ message: "Password is required" });

    const user = await UserModel.findOne({ email });

    if (!user) return res.status(404).send({ message: "User not found" });

    const checkPassword = await user.comparePassword(password);
    if (!checkPassword)
      return res.status(401).send({ message: "Unauthorized Access" });

    const payload = {
      userId: user._id,
      email: user.email,
    };

    const isProd = process.env.NODE_ENV === "production";

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    res.cookie("access_token", accessToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      maxAge: 15 * 60 * 1000,
      path: "/",
    });

    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    res.status(200).send({ message: "User Login Successfully" });
  } catch (error) {
    next(error);
  }
};

export const refreshAccessToken: RequestHandler = async (req, res, next) => {
  try {
    const token = req.cookies?.refresh_token;
    if (!token || typeof token !== "string") {
      return res.status(401).send({ message: "Unauthorized" });
    }

    const decoded = verifyRefreshToken(token);

    const user = await UserModel.findOne({ email: decoded.email });
    if (!user) return res.status(401).send({ message: "Unauthorized" });

    const payload = { userId: user._id, email: user.email };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);
    const isProd = process.env.NODE_ENV === "production";

    res.cookie("access_token", accessToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      maxAge: 15 * 60 * 1000,
      path: "/",
    });

    // Rotate refresh token (simple rotation)
    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    return res.status(200).send({ message: "Token refreshed" });
  } catch (error) {
    return res.status(401).send({ message: "Unauthorized" });
  }
};

export const getUserProfile: RequestHandler = async (req, res, next) => {
  try {
    const id = req.user.userId;

    const user = await UserModel.findById(id).select("-password");
    if (!user) return res.status(400).send({ message: "Unauthorized Access" });

    res.status(200).send({
      message: "User Profile Fetched Successfully",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserProfile: RequestHandler = async (req, res, next) => {
  try {
    const id = req.user.userId;
    const { fullName } = req.body as { fullName?: string };

    if (
      !fullName ||
      typeof fullName !== "string" ||
      fullName.trim().length < 2
    ) {
      return res.status(400).send({ message: "FullName is required" });
    }

    const user = await UserModel.findById(id);
    if (!user) return res.status(401).send({ message: "Unauthorized" });

    user.fullName = fullName.trim();
    await user.save();

    return res.status(200).send({
      message: "Profile updated",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const changeUserPassword: RequestHandler = async (req, res, next) => {
  try {
    const id = req.user.userId;
    const { currentPassword, newPassword } = req.body as {
      currentPassword?: string;
      newPassword?: string;
    };

    if (!currentPassword || typeof currentPassword !== "string") {
      return res.status(400).send({ message: "Current password is required" });
    }

    if (!newPassword || typeof newPassword !== "string") {
      return res.status(400).send({ message: "New password is required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).send({ message: "Password Must be 6 Characters" });
    }

    const user = await UserModel.findById(id);
    if (!user) return res.status(401).send({ message: "Unauthorized" });

    const ok = await user.comparePassword(currentPassword);
    if (!ok) return res.status(400).send({ message: "Wrong password" });

    user.password = newPassword;
    await user.save();

    return res.status(200).send({ message: "Password updated" });
  } catch (error) {
    next(error);
  }
};

export const userLogout: RequestHandler = async (req, res) => {
  const isProd = process.env.NODE_ENV === "production";

  res.clearCookie("access_token", {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    path: "/",
  });

  res.clearCookie("refresh_token", {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    path: "/",
  });

  return res.status(200).send({ message: "Logged out" });
};
