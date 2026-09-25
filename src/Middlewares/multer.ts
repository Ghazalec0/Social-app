import multer from "multer";
import path from "path";
import fs from "fs";
import { randomUUID } from "crypto"; 
import os from "os";

// في Vercel لازم نكتب في /tmp، في اللوكال نكتب في uploads عادي
const uploadPath = process.env.VERCEL 
  ? path.join("/tmp", "uploads") 
  : path.join(process.cwd(), "uploads");

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${randomUUID()}${path.extname(file.originalname)}`);
  },
});

export const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 },
});