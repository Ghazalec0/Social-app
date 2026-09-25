import app from '../dist/app.controller.js';
import { connectDB } from '../dist/DB/connection.js';

export default async function handler(req, res) {
  try {
    await connectDB();
    return app(req, res);
  } catch (err) {
    console.error("API_HANDLER_ERROR:", err);
    return res.status(500).json({ message: err.message, stack: err.stack });
  }
}
