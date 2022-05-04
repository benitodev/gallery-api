import dotenv from "dotenv";
dotenv.config();

export const DB_URI = process.env.URI;
export const PORT = process.env.PORT || 5000;
export const DB_URI_TEST = process.env.DB_URI_TEST;
export const NODE_ENV = process.env.NODE_ENV;
