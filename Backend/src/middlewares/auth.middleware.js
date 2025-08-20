import {User} from "../models/user.models.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import httpStatus from "http-status";

dotenv.config();

export const userVerification = async(req,res,next)=>{
    const token = req.cookies.token;
    if(!token){
        return res.status(httpStatus.UNAUTHORIZED).json({status:false,message:"No token found"})
    }
    jwt.verify(token.process.env.TOKEN_KEY,async(err,data)=>{
        if(err){
            return res.status(httpStatus.FORBIDDEN).json({status:false,message:"Invalid Token"});
        }

        const existingUser = await UsersModel.findById(data._id);
        if(existingUser){
            return res.status(httpStatus.NOT_FOUND).json({status:false,message:"User not found"});
        }

        req.user = existingUser;
        next();
    });
};