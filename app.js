import express from "express";
import fileUpload from "express-fileupload";
import imageRoutes from "./routes/image.js";
import userRoutes from "./routes/user.js";
import loginRoutes from "./routes/login.js";
import cors from "cors";
import errorHandler from "./middleware/errorHandler.js";

const app = express();

//middlewares
app.use(express.json({ limit: "25mb" }));
app.use(cors());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "./upload",
  })
);

//routes
app.use("/login", loginRoutes);
app.use("/image", imageRoutes);
app.use("/user", userRoutes);
//error handling
app.use(errorHandler);
export default app;
