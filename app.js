import express from "express";
import fileUpload from "express-fileupload";
import imageRoutes from "./routes/image.js";
import userRoutes from "./routes/user.js";
import cors from "cors";
const app = express();

//middlewares
app.use(cors());
app.use(express.json());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "./upload",
  })
);
//routes
app.use("/image", imageRoutes);
app.use("/user", userRoutes);
export default app;
