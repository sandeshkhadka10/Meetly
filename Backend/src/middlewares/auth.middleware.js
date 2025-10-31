import {User} from "../models/user.models.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import httpStatus from "http-status";

dotenv.config();

export const userVerification = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!req.session.user || req.session.user.token !== token) {
    return res.status(httpStatus.UNAUTHORIZED).json({ status: false, message: "Session expired or invalid" });
  }

    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    // console.log("Decoded JWT:", decoded);

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(httpStatus.UNAUTHORIZED).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Auth error:", err.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
