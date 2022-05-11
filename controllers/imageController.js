import Image from "../models/Image.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
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
    const images = await Image.find({}).populate("userId", {
      username: 1,
      name: 1,
      _id: 0,
    });
    res.status(200).json({ content: images });
  } catch (error) {}
};
export const createImage = async (req, res, next) => {
  try {
    const { userId } = req;
    const { name, url } = req.body;
    const user = await User.findById(userId);

    if (!name || !url)
      return res.status(400).json({ error: "you must send the all data" });
    const newImage = new Image({
      name,
      url,
      user: user.username,
    });
    const savedImage = await newImage.save();
    user.images = user.images.concat(savedImage._id);
    await user.save();
    res
      .status(201)
      .json({ message: "the image was created", content: newImage });
  } catch (exception) {
    next(exception);
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
