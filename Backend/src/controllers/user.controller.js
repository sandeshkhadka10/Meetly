import httpStatus from "http-status";
import { User } from "../models/user.models.js";
import bcrypt from "bcrypt";
import { Meeting } from "../models/meeting.models.js";
import { createSecretToken } from "../util/SecretToken.js";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service:"gmail",
  auth:{
    user:process.env.EMAIL_USER,
    pass:process.env.EMAIL_PASS
  }
});

export const register = async (req, res) => {
  const { email, username, password } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(httpStatus.CONFLICT).json({ message: "User already exists" });
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    email: email,
    username: username,
    password: hashedPassword,
    isLoggedIn:true
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

export const forgetPassword = async(req,res)=>{
  const {email} = req.body;
  const existingUser = await User.findOne({email});
  if(!existingUser){
    return res.status(httpStatus.NOT_FOUND).json({message:"User doesn't exists"});
  }
  const resetCode = Math.floor(10000 + Math.random()*90000).toString();
  const expires = new Date(Date.now()+1*60*1000);
  existingUser.resetCode = resetCode;
  existingUser.resetCodeExpiry = expires;
  await existingUser.save();

  // Email sending work
  const mailOptions = {
    from:process.env.EMAIL_USER,
    to:email,
    subject:"Password Reset Code",
    text:`Your password reset code is ${resetCode}. It will expire in 1 minute.`
  };
  try{
    await transporter.sendMail(mailOptions);
    res.status(httpStatus.OK).json({message:"Reset code sent to your email"});
  }catch(error){
    console.error("Error while sending email:",error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message:"Failed to send reset code"});
  }
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
    .json({ message: "Added user detail to history" });
};

export const getUserHistory = async (req, res) => {
  const user = req.user;
  if(!user){
    return res.status(httpStatus.UNAUTHORIZED).json({message:"Unauthorized User"});
  }
  // here find will return in array format
  const meeting = await Meeting.find({ user_id: user.username });
  res.json(meeting);
};
