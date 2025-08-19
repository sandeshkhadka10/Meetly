import {Router} from "express";
import {register,login,addToHistory,getUserHistory} from "../controllers/user.controller.js";
import {validateRegister,validateLogin,validateMeeting} from "../middlewares/validation.middleware.js";
import wrapAsync from "../util/wrapAsync.js";

const router = Router();

router.route("/register")
  .post(validateRegister,wrapAsync(register));

router.route("/login")
  .post(validateLogin,wrapAsync(login));

router.route("/add_to_activity")
  .post(addToHistory);

router.route("/get_all_activity")
  .get(getUserHistory);

export default router;