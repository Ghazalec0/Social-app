import { Types } from "mongoose";
import { IPost } from "./post.interface";

export interface IComment {
  userId: Types.ObjectId;
  postId: Types.ObjectId | IPost[];
  parentId?: Types.ObjectId | undefined;
  content?: string;
  attachment?: string;
  mentions?: Types.ObjectId[];
  reactionsCount : number;
}