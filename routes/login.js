import { Router } from "express";
import { loginUser } from "../controllers/loginController.js";

const router = Router();

router.post("/", loginUser);
export default router;
