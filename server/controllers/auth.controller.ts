import type { RequestHandler } from "express";
import { isValidEmail } from "../utils/validator.ts";
import UserModel from "../models/auth.schema.ts";
import { generateToken } from "../utils/token.ts";

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

    const token = generateToken(payload);
    res.cookie("token", token);

    res.status(200).send({ message: "User Login Successfully" });
  } catch (error) {
    next(error);
  }
};

export const getUserProfile: RequestHandler = async (req, res, next) => {
  try {
    const id = req.user.userId;

    const user = await UserModel.findById(id).select("-password");
    if (!user) return res.status(400).send({ message: "Unauthorized Access" });

    res
      .status(200)
      .send({ message: "User Profile Fetched Successfully", user });
  } catch (error) {
    next(error);
  }
};
