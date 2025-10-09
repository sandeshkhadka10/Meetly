import { Router } from "express";
import {
  register,
  login,
  logout,
  forgetPassword,
  resetPassword,
  addToHistory,
  getUserHistory,
} from "../controllers/user.controller.js";
import {
  validateRegister,
  validateLogin,
  validateForgetPassword,
  validateResetPassword
} from "../middlewares/validation.middleware.js";
import wrapAsync from "../util/wrapAsync.js";
import { userVerification } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(validateRegister, wrapAsync(register));

router.route("/login").post(validateLogin, wrapAsync(login));

router.route("/logout").get(userVerification,logout);

router.route("/forgetPassword").post(validateForgetPassword,wrapAsync(forgetPassword));

router.route("/resetPassword").post(validateResetPassword,wrapAsync(resetPassword));

router
  .route("/add_to_activity")
  .post(userVerification, wrapAsync(addToHistory));

router
  .route("/get_all_activity")
  .get(userVerification, wrapAsync(getUserHistory));

router.route("/auth/verify")
  .get(userVerification,(req,res)=>{
    res.json({status:true,user:req.user});
  });

export default router;
