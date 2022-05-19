import bcrypt from "bcrypt";
import User from "../models/User.js";

export const getUser = async (req, res) => {
  try {
    const id = req.params.username;

    const user = await User.findOne({ _id: id });
    if (!user) throw new Error("Image doesn't exist. Look the ID");
    res.status(200).json({ content: user });
  } catch (err) {
    return res.status(404).json({ error: "Error in get user" });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).populate("images", {
      name: 1,
      url: 1,
      _id: 0,
    });
    console.log(users);
    res.status(200).json({ content: users });
  } catch (err) {
    return res.status(404).json({ error: "Error in get users" });
  }
};
export const createUser = async (req, res) => {
  const { username, name, password } = req.body;
  try {
    if (!username && !name && !password)
      return res.status(400).send({
        error: "you must send all data",
      });
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      name,
      password: passwordHash,
    });
    await newUser.save();
    res.status(201).json({ message: "the user has been created" });
  } catch (error) {
    return res.status(400).json({ error: "error in create user" });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const userDeleted = await User.findByIdAndDelete(id);
    if (!userDeleted)
      return res.status(400).send({
        error: "it wasn't possible to delete user",
      });
    return res.status(204).send({
      message: "User was deleted",
    });
  } catch (err) {
    return res.status(404).send({ error: "Error in delete user" });
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user)
      return res.status(400).json({
        message: "this user doesn't exist",
      });

    const userUpdated = await User.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(204).json({
      content: userUpdated,
    });
  } catch (err) {
    return res.status(404).json({ error: "Error in update user" });
  }
};
