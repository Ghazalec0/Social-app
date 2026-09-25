import { Types } from "mongoose";
import { SYS_REACTION } from "../enums";

export interface AddReactionDTO {
  id: Types.ObjectId;
  reaction: SYS_REACTION; // 0: like, 1: love, 2: haha, 3: wow, 4: sad, 5: angry
}