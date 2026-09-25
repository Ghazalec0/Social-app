import { Types } from "mongoose";

// IRequest >> Requests Table
export interface IRequest {
  sender: Types.ObjectId;
  receiver: Types.ObjectId;
}