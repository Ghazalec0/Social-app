export interface ICloudProvider {
  uploadFile(file: Express.Multer.File, path: string): Promise<{ url: string; key: string }>;
  deleteFile(key: string): Promise<boolean | undefined>;
  getFile(key: string): Promise<NodeJS.ReadableStream | undefined>;
}

// TODO: cloudinary
// TODO: DO >> search point 