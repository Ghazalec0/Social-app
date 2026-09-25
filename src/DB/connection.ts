import mongoose from "mongoose";
import { DB_URI } from "../config";

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(DB_URI, { bufferCommands: false }).then(m => {
      console.log("DB Connected");
      return m;
    });
  }
  try {
    cached.conn = await cached.promise;
  } catch (e: any) {
    cached.promise = null;
    throw e;
  }
  return cached.conn;
}