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
    return res.status(httpStatus.CONFLICT).json({ message: "User already exits" });
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

  if (!username && !password) {
    return res.status(httpStatus.BAD_REQUEST).json({ message: "Username and Password are required" });
  }else if(!username){
    return res.status(httpStatus.BAD_REQUEST).json({message:"Username is required"});
  }else if(!password){
    return res.status(httpStatus.BAD_REQUEST).json({message:"Password is required"});
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
  
  // these is done to avoid multiple login by same user
  if(user.isLoggedIn){
    return res.status(httpStatus.FORBIDDEN).json({message:"These user is already loggedIn"});
  }
  user.isLoggedIn = true;
  await user.save();

  const token = createSecretToken(user._id);
  res.cookie("token", token, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
  });
  res
    .status(httpStatus.CREATED)
    .json({ message: "User logged in successfully" });
};

export const logout = async(req, res) => {
  const user = await User.findById(req.user._id);
  if(user){
    user.isLoggedIn = false;
    await user.save();
  }
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
    user_id: req.user.username,
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
