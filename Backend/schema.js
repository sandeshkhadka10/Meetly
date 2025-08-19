const Joi = require("joi");

// for register
module.exports.usersRegisterSchema = Joi.object({
    name:Joi.string().required(),
    username:Joi.string().required(),
    password:Joi.string().required()
});

// for login
module.exports.usersLoginSchema = Joi.object({
    username:Joi.string().required(),
    password:Joi.string().required()
});

// for meeting
module.exports.meetingsSchema = Joi.object({
    user_id:Joi.string().required(),
    meetingCode:Joi.string().required()
});