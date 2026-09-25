
import { model, Schema } from "mongoose";
import { IUserFriend, SUS_USER_RELATION } from "../../../common";

const schema = new Schema<IUserFriend>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  friend: { type: Schema.Types.ObjectId, ref: "User", required: true },
  relationship: { type: String, enum: Object.values(SUS_USER_RELATION) },
  closeFriend: { type: Boolean, default: false },
}, { timestamps: true });

export const UserFriend = model<IUserFriend>('UserFriend', schema);