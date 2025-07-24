import {Router} from "express";
import {register,login} from "../controllers/usersControllers.js";

const router = Router();

router.route("/register")
  .post(register);

router.route("/login")
  .post(login);

router.route("/add_to_activity")

router.route("/get_all_activity")

export default router;