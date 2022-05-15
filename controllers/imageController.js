import Image from "../models/Image.js";
import User from "../models/User.js";
import { uploadImage } from "../libs/cloudinary.js";
import fs from "fs-extra";
export const getImage = async (req, res) => {
  try {
    const { id } = req.params;
    const image = await Image.findById(id);
    if (!image) throw new Error("Image doesn't exist. Look the ID");
    res.status(200).json({ content: image });
  } catch (err) {
    console.log(err);
    return res.status(404).json({ error: err.message });
  }
};

export const getImages = async (req, res) => {
  try {
    console.log("hola soy get IMAGES");
    const images = await Image.find({}).populate("user", {
      username: 1,
      name: 1,
      _id: 0,
    });
    console.log(images, "IMAGES");
    res.status(200).json({ content: images });
  } catch (error) {}
};

export const createImage = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).send("no body");
    }

    const { userId } = req;
    const { imageName } = req.body;
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send("no files were uploaded.");
    }

    const cloudinaryRes = await uploadImage(
      req.files.selectedFile.tempFilePath
    );

    await fs.remove(req.files.selectedFile.tempFilePath);

    const cloudinaryImage = {
      url: cloudinaryRes.secure_url,
      public_id: cloudinaryRes.public_id,
    };
    const user = await User.findOne({ userId });
    if (!imageName)
      return res.status(400).json({ error: "you must send the all data" });
    const newImage = new Image({
      name: imageName,
      user: user.id,
      image: cloudinaryImage,
    });
    console.log(newImage);
    const savedImage = await newImage.save();
    user.images = user.images.concat(savedImage._id);
    await user.save();
    res
      .status(201)
      .json({ message: "the image was created", content: newImage });
  } catch (exception) {
    console.log(exception);
  }
};

export const updateImage = async (req, res) => {
  const id = req.params.id;
  try {
    if (Object.keys(req.body).length === 0)
      return res.status(400).json({ error: "missing content" });
    const uptadedImage = await Image.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res
      .status(200)
      .json({ message: "image was updated", content: uptadedImage });
  } catch (err) {
    return res.status(404).json({ error: "Image doesn't exist. Look the ID" });
  }
};
export const deleteImage = async (req, res) => {
  try {
    const id = req.params.id;
    const imageToDelete = await Image.findByIdAndDelete(id);
    console.log(imageToDelete);
    if (!imageToDelete) return res.sendStatus(404);
    res.status(204).json({ message: "image has been deleted" });
  } catch (err) {
    return res.status(404).json({ error: "Image doesn't exist. Look the ID" });
  }
};
