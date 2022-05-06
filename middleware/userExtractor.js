import jwt from "jsonwebtoken";
const getTokenFrom = (req) => {
  const authorization = req.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer")) {
    return authorization.split(" ")[1];
  }
  return null;
};

const userExtractor = (req, res, next) => {
  const token = getTokenFrom(req);
  const decodedToken = jwt.verify(token, process.env.SECRET);
  if (!token || !decodedToken.id) {
    return res.status(401).json({ error: "invalid token" });
  }

  const { id: userId } = decodedToken;
  req.userId = userId;
  next();
};
export default userExtractor;
