import Image from "../models/Image.js";
import User from "../models/User.js";
import { uploadImage } from "../libs/cloudinary.js";
import fs from "fs-extra";
export const getImage = async (req, res) => {
  try {
    const { id } = req.params;
    const image = await Image.findById(id);
    if (!image)
      res
        .status(404)
        .json({ error: "the image doesn't exist or ID is missing" });
    res.status(200).json({ content: image });
  } catch (err) {
    console.log(err);
    return res.status(404).json({ error: err.message });
  }
};

export const getImages = async (req, res) => {
  try {
    const images = await Image.find({});
    res.status(200).json({ content: images });
  } catch (err) {
    return res.status(404).json({ error: err.message });
  }
};

export const getRandomImages = async (req, res) => {
  try {
    const images = await Image.find({}).limit(3);
    console.log(images);
    res.status(200).json({ content: images });
  } catch (err) {
    return res.status(404).json({ error: err.message });
  }
};

export const createImage = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({ error: "you must send the filename" });
    }
    const { userId } = req;

    const { imageName } = req.body;
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ error: "no files were uploaded." });
    }

    const cloudinaryRes = await uploadImage(
      req.files.selectedFile.tempFilePath
    );

    await fs.remove(req.files.selectedFile.tempFilePath);

    const cloudinaryImage = {
      url: cloudinaryRes.secure_url,
      public_id: cloudinaryRes.public_id,
    };
    const user = await User.findOne({ _id: userId });
    console.log(user);
    if (!imageName)
      return res.status(404).json({ error: "you must send the all data" });
    const newImage = new Image({
      name: imageName,
      user: user.id,
      image: cloudinaryImage,
    });
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
    const getBody = async () => {
      let body = {};
      if (req.files && req.body) {
        const image = req.files.image;
        const cloudinaryRes = await uploadImage(image.tempFilePath);

        await fs.remove(image.tempFilePath);

        const cloudinaryImage = {
          url: cloudinaryRes.secure_url,
          public_id: cloudinaryRes.public_id,
        };
        const name = req.body.name;
        body = { image: cloudinaryImage, name };

        return body;
      }
      if (req.files) {
        const image = req.files.image;
        const cloudinaryRes = await uploadImage(image.tempFilePath);

        await fs.remove(image.tempFilePath);

        const cloudinaryImage = {
          url: cloudinaryRes.secure_url,
          public_id: cloudinaryRes.public_id,
        };
        body = { image: cloudinaryImage };
        return body;
      }
      if (Object.keys(req.body).length > 0) {
        const name = req.body.name;
        body = { name };
        return body;
      }
    };
    const dataToUpdate = await getBody();
    console.log(dataToUpdate);
    const uptadedImage = await Image.findByIdAndUpdate(id, dataToUpdate, {
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
    if (!req.body) {
      return res.status(400).send("no body");
    }
    const { userId } = req;
    const imageId = req.params.id;
    const imageToDelete = await Image.findByIdAndDelete(imageId);
    // if (!imageToDelete) return res.sendStatus(404);
    const user = await User.findById({ _id: userId });
    let itemToRemove = user.images.find((image) => image == imageId);

    console.log(itemToRemove);
    if (itemToRemove) {
      user.images.pull(itemToRemove);
      await user.save();
    }

    res.status(204).json({ message: "image has been deleted" });
  } catch (err) {
    return res.status(404).json({ error: "Image doesn't exist. Look the ID" });
  }
};
