import httpStatus from "http-status";
import {User} from "../models/user.models.js";
import bcrypt,{hash} from "bcrypt";
import crypto from "crypto";
import { Meeting } from "../models/meeting.models.js";

const register = async(req,res)=>{
    const {name, username,password} = req.body;
    try{
        const existingUser = await User.findOne({username});
        if(existingUser){
            return res.status(httpStatus.FOUND).json({message:"User already exits"});
        }
        const hashedPassword = await bcrypt.hash(password,10);
        const newUser = new User({
            name:name,
            username:username,
            password:hashedPassword
        });
        await newUser.save();
        res.status(httpStatus.CREATED).json({message:"User Registered"});
    }catch(error){
        res.json({message:`Something went wrong ${error}`});
    }
};

const login = async(req,res)=>{
    const {username,password} = req.body;
    if(!username || !password){
        return res.status(400).json({message:"Please input the value"});
    }
    try{
        const user = await User.findOne({username});
        if(!user){
            return res.status(httpStatus.NOT_FOUND).json({message:"User not found"});
        }
        if(bcrypt.compare(password,user.password)){
            // generating a secure random token which is often used for things like password reset links, email verifications, or session tokens.
            let token = crypto.randomBytes(20).toString("hex");
            user.token = token;
            await user.save();
            return res.status(httpStatus.OK).json({token:token});
        }
    }catch(error){
        return res.status(500).json({message:`Something went wrong ${error}`});
    }
};

const addToHistory = async(req,res)=>{
    const {token,meeting_code} = req.body;
    try{
        const user = await User.findOne({token:token});

        const newMeeting = new Meeting({
            user_id:user.username,
            meetingCode:meeting_code
        });

        await newMeeting.save();

        return res.status(httpStatus.CREATED).json({message:"Added code to history"});

    }catch(error){
        return res.status(500).json({message:`Something went wrong ${error}`});
    }
};

const getUserHistory = async(req,res)=>{
    const {token} = req.query;
    try{
        const user = await User.findOne({token:token});
        const meeting = await Meeting.find({user_id:user.username});
        res.json(meeting);
    }catch(error){
        return res.status(500).json({message:`Something went wrong ${error}`});
    }
}

export {register,login,addToHistory,getUserHistory};