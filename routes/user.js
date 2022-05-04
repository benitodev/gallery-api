import { Router } from "express";
import {
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getUsers,
} from "../controllers/userController.js";
const router = Router();

//user routes
router.get("/:id", getUser);
router.post("/", createUser);
router.put("/:id", updateUser);
router.get("/", getUsers);
router.delete("/:id", deleteUser);
export default router;
