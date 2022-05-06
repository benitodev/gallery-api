const errorHandler = (error, req, res, next) => {
  console.log(error.name);

  if (error.name === "CastError") {
    res.status(400).send({ error: "malformatted id" });
  } else if (error.name === "JsonWebTokenError") {
    res.status(401).json({ error: "token missing or invalid" });
  } else if (error.name === "ValidationError") {
    res.status(400).json({ error: error.message });
  } else if (error.name === "TokenExpiredError") {
    res.status(401).json({ error: error.message });
  } else {
    res.status(500).end();
  }

  next(error);
};

export default errorHandler;
