import Joi from "joi";

// for register
export const usersRegisterSchema = Joi.object({
    name:Joi.string().required(),
    username:Joi.string().required(),
    password:Joi.string().required()
});

// for login
export const usersLoginSchema = Joi.object({
    username:Joi.string().required(),
    password:Joi.string().required()
});

// for meeting
export const usersMeetingSchema = Joi.object({
    token:Joi.string().required(),
    meetingCode:Joi.string().required()
});