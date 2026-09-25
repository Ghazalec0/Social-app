import { Types } from "mongoose";
import { ON_MODEL, SYS_REACTION } from "../enums";

export interface IUserReaction {
  userId: Types.ObjectId;
  refId: Types.ObjectId; // postId or commentId or reelId or storyId
  onModel: ON_MODEL; // to know which collection to reference
  reaction: SYS_REACTION; // 0: like, 1: love, 2: haha, 3: wow, 4: sad, 5: angry
}