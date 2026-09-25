import { S3CloudProvider } from "./s3.service";
import { S3_ACCESS_KEY_ID, S3_REGION, S3_SECRET_ACCESS_KEY } from "../../../config";

export const s3CloudProvider = new S3CloudProvider({
    region: S3_REGION,
    credentials: {
        accessKeyId: S3_ACCESS_KEY_ID,
        secretAccessKey: S3_SECRET_ACCESS_KEY,
    }
})