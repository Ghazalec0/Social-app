import { Types } from "mongoose";

export interface IPost {
  userId: Types.ObjectId;
  content?: string;
  attachments?: string[]; // [url, url, ...]
  reactionsCount: number; // calculated field >> user reactions length
  commentsCount: number; // calculated field >> post comments length
  sharesCount:number;
}