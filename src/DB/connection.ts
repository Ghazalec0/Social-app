import mongoose from "mongoose";
import { DB_URI } from "../config";

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(DB_URI, opts).then((mongoose) => {
      console.log("DB Connected successfully");
      return mongoose;
    });
  }
  
  try {
    cached.conn = await cached.promise;
  } catch (e: any) {
    cached.promise = null;
    console.log("fail to connect to DB", e.message);
    throw e;
  }

  return cached.conn;
}