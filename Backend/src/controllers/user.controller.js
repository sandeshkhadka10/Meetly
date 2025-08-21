import httpStatus from "http-status";
import { User } from "../models/user.models.js";
import bcrypt from "bcrypt";
import { Meeting } from "../models/meeting.models.js";
import { createSecretToken } from "../util/SecretToken.js";
import dotenv from "dotenv";

dotenv.config();

export const register = async (req, res) => {
  const { name, username, password } = req.body;
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.status(httpStatus.FOUND).json({ message: "User already exits" });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({
    name: name,
    username: username,
    password: hashedPassword,
  });

  await newUser.save();
  
  const token = createSecretToken(newUser._id);
  res.cookie("token", token, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000
  });
  res.status(httpStatus.CREATED).json({ message: "User Registered", newUser });
};

export const login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(httpStatus.NOT_FOUND).json({ message: "User not found" });
  }

  let isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    return res
      .status(httpStatus.UNAUTHORIZED)
      .json({ message: "Incorrect email or password" });
  }
  const token = createSecretToken(user._id);
  res.cookie("token", token, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
  });
  res
    .status(httpStatus.CREATED)
    .json({ message: "User logged in successfully" });
};

export const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
  });
  res.status(httpStatus.CREATED).json({ message: "Logged out successfully" });
};

export const addToHistory = async (req, res) => {
  const {meeting_code } = req.body;

  // userVerification is already attached to the user
  const user = req.user;
  if(!user){
    return res.status(httpStatus.UNAUTHORIZED).json({message:"Unauthorized User"});
  }
  
  const newMeeting = new Meeting({
    user_id: req.body.username || req.user.username,
    meetingCode: meeting_code,
  });

  await newMeeting.save();

  return res
    .status(httpStatus.CREATED)
    .json({ message: "Added code to history" });
};

export const getUserHistory = async (req, res) => {
  const user = req.user;
  if(!user){
    return res.status(httpStatus.UNAUTHORIZED).json({message:"Unauthorized User"});
  }
  const meeting = await Meeting.find({ user_id: user.username });
  res.json(meeting);
};
