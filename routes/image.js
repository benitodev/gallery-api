import { Router } from "express";
import userExtractor from "../middleware/userExtractor.js";
import {
  getImage,
  getImages,
  createImage,
  updateImage,
  deleteImage,
  getRandomImages,
} from "../controllers/imageController.js";
const router = Router();
//random images
router.get("/random", getRandomImages);
//one image
router.get("/:id", getImage);
//all images
router.get("/", getImages);

//create
router.post("/", userExtractor, createImage);
//update
router.put("/:id", userExtractor, updateImage);
//delete
router.delete("/:id", userExtractor, deleteImage);

export default router;
