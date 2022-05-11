import bcrypt from "bcrypt";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
export const loginUser = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    res.status(400).json({ error: "data is missing, fill everthing please" });
  const user = await User.findOne({ username });
  const passwordCorrect =
    user === null ? false : await bcrypt.compare(password, user.password);
  if (!(user && passwordCorrect))
    res.status(401).json({ error: "invalid user or password" });
  const userForToken = {
    username: user.username,
    id: user.id,
  };

  const token = jwt.sign(userForToken, process.env.SECRET, {
    expiresIn: 60 * 60 * 24 * 3,
  });

  res.status(200).json({
    name: user.name,
    username: user.username,
    token,
  });
};
