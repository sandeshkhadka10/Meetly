import ExpressError from "../util/ExpressError.js";
import { usersRegisterSchema,usersLoginSchema, usersMeetingSchema } from "../../schema.js";

export const validateRegister = (req,res,next)=>{
    let {error} = usersRegisterSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}

export const validateLogin = (req,res,next)=>{
    let {error} = usersLoginSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}

export const validateMeeting = (req,res,next)=>{
    let {error} = usersMeetingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}