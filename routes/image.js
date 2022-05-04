import { Router } from "express";
import {
  getImage,
  getImages,
  createImage,
  updateImage,
  deleteImage,
} from "../controllers/imageController.js";
const router = Router();
//one image
router.get("/:id", getImage);
//all images
router.get("/", getImages);
//create
router.post("/", createImage);
//update
router.put("/:id", updateImage);
//delete
router.delete("/:id", deleteImage);

export default router;
