import {Router} from "express";
import {register,login,addToHistory,getUserHistory} from "../controllers/user.controller.js";

const router = Router();

router.route("/register")
  .post(register);

router.route("/login")
  .post(login);

router.route("/add_to_activity")
  .post(addToHistory);

router.route("/get_all_activity")
  .get(getUserHistory);

export default router;