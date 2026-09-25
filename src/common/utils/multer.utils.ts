import multer, {memoryStorage, Multer} from "multer";

// todo: why to use diskStorage instead of memoryStorage
export function multerUploadFile(): Multer {
    return multer({storage: memoryStorage()});
}