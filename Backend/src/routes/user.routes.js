import {Router} from "express";
import {register,login,addToHistory,getUserHistory} from "../controllers/user.controller.js";
import {validateRegister,validateLogin,validateMeeting} from "../middlewares/validation.middleware.js";
import wrapAsync from "../util/wrapAsync.js";
import {userVerification} from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register")
  .post(validateRegister,wrapAsync(register));

router.route("/login")
  .post(validateLogin,wrapAsync(login));

router.route("/add_to_activity")
  .post(userVerification,wrapAsync(addToHistory));

router.route("/get_all_activity")
  .get(userVerification,wrapAsync(getUserHistory));

export default router;