import mongoose from "mongoose";
const { Schema } = mongoose;
const imageSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  url: {
    type: String,
    required: true,
    trim: true,
  },
  user: [
    {
      type: String,
      required: true,
      ref: "User",
    },
  ],
});

imageSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Image = mongoose.model("Image", imageSchema);
export default Image;
