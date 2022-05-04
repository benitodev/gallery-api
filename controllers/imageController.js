import Image from "../models/Image.js";
import User from "../models/User.js";
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
export const createImage = async (req, res) => {
  try {
    const { name, url, userId } = req.body;
    console.log(userId);
    if (!name || !url || !userId)
      return res.status(400).json({ error: "you must send the all data" });
    const user = await User.findById(userId);
    const newImage = new Image({
      name,
      url,
      userId: user._id,
    });
    const savedImage = await newImage.save();
    console.log(user);
    user.images = user.images.concat(savedImage._id);
    await user.save();
    res
      .status(201)
      .json({ message: "the image was created", content: newImage });
  } catch (err) {
    return res.status(400).json({ error: "Error in create image" });
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
