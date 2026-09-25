import crypto from "node:crypto";

export function encrypt(plaintext: string) {
  const iv = crypto.randomBytes(16); // random string
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from("12345678123456781234567812345678"), // env
    iv,
  );
  let encryptedData = cipher.update(plaintext, "utf-8", "hex");
  encryptedData += cipher.final("hex");
  return `${iv.toString("hex")}:${encryptedData}`;
}

export function decrypt(encryptedData: string) {
  // iv:encryptedValue
  const [iv, encryptedValue] = encryptedData.split(":"); // str >> asfkrsjogbifgb >> ["asfkrsio
  const ivBinaryLike = Buffer.from(iv as string, "hex");
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from("12345678123456781234567812345678"),
    ivBinaryLike,
  );

  let decryptedData = decipher.update(encryptedValue as string, "hex", "utf-8");
  decryptedData += decipher.final("utf-8");
  return decryptedData;
}