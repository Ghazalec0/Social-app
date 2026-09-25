import mongoose from "mongoose";
import { DB_URI } from "../config";

export function connectDB() {
    mongoose
    .connect(DB_URI)
    .then(() => console.log("DB Connected successfully"))
    .catch((err) => console.log("fail to connect to DB", err.message));
}