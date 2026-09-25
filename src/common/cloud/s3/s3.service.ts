import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3_BUCKET_NAME } from "../../../config";
import {ICloudProvider} from "../cloud.interface";
import {DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client} from "@aws-sdk/client-s3";

interface S3Config {
  region: string;
  credentials: {
    accessKeyId: string;
    secretAccessKey: string;
  };
}

export class S3CloudProvider implements ICloudProvider {

  private client: S3Client;

 constructor(config: S3Config) {
  this.client = new S3Client({
    region: config.region,
    credentials: config.credentials
  });
}

  async deleteFile(key: string): Promise<boolean | undefined> {
    let command: DeleteObjectCommand = new DeleteObjectCommand({
        Key: key,
        Bucket: S3_BUCKET_NAME
    })

    const {DeleteMarker} = await this.client.send(command)
    return DeleteMarker;
}

  async getFile(key: string): Promise<NodeJS.ReadableStream | undefined> {
    let command: GetObjectCommand = new GetObjectCommand({
        Key: key,
        Bucket: S3_BUCKET_NAME
    })

    const {Body} = await this.client.send(command);
    return Body as NodeJS.ReadableStream;
}

  // handle files
// 1. busboy for parsing files
// 2. multer for upload file into storage [hard disk, (ram) memory]

async uploadFile(file: Express.Multer.File, path: string): Promise<{ url: string; key: string }> {
    let command: PutObjectCommand = new PutObjectCommand({
        Bucket: S3_BUCKET_NAME,
        Key: `social-app-c45-g3/${path}/${Date.now()}_${file.originalname}`, 
        ACL: "private",
        Body: file.buffer
    });

    const url = await getSignedUrl(this.client, command, { expiresIn: 1800 });
    return { url, key: command.input.Key as string };
}

}