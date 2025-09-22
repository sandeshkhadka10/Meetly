import ExpressError from "../util/ExpressError.js";
import { usersRegisterSchema,usersLoginSchema,forgetPasswordSchema,resetPasswordSchema,usersMeetingSchema } from "../../schema.js";

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

export const validateForgetPassword = (req,res,next)=>{
    let {error} = forgetPasswordSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}

export const validateResetPassword = (req,res,next)=>{
    let {error} = resetPasswordSchema.validate(req.body);
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