import { Router } from "express";
import {
  register,
  login,
  logout,
  addToHistory,
  getUserHistory,
} from "../controllers/user.controller.js";
import {
  validateRegister,
  validateLogin,
  validateMeeting,
} from "../middlewares/validation.middleware.js";
import wrapAsync from "../util/wrapAsync.js";
import { userVerification } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(validateRegister, wrapAsync(register));

router.route("/login").post(validateLogin, wrapAsync(login));

router.route("/logout").get(logout);

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
