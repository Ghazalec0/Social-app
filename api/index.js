import app from '../src/index.js';
import { connectDB } from '../src/DB/connection.js';

export default async function handler(req, res) {
  await connectDB();
  return app(req, res);
}