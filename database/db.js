import mongoose from "mongoose";
import { DB_URI, DB_URI_TEST, NODE_ENV } from "../config.js";

export const connectDB = async () => {
  try {
    const db = await mongoose.connect(
      NODE_ENV == "test" ? DB_URI_TEST : DB_URI,
      { useNewUrlParser: true, useCreateIndex: true }
    );
    console.log("connect to", db.connection.name);
  } catch (err) {
    console.log(err);
  }
};
