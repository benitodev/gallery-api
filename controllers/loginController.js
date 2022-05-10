import bcrypt from "bcrypt";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
export const loginUser = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    res.status(400).json({ error: "data is missing, fill everthing please" });
  const user = await User.findOne({ username });
  console.log(user);
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
    id: _id,
    name: user.name,
    username: user.username,
    token,
  });
};

//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImJlbml0b2thIiwiaWQiOiI2MjcwOWMxZTI2OWE2NzdhY2QzYzE0Y2IiLCJpYXQiOjE2NTE3ODkzMTJ9.4v_8oaQOQhS3XWJ9IiZ1UOfqPAo4vsKOn1gPSC5QTaU
