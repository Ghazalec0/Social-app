
import {Types} from "mongoose";
import {SUS_USER_RELATION} from "../enums";

export interface IUserFriend {
  user: Types.ObjectId;
  friend: Types.ObjectId;
  closeFriend: boolean;
  relationship?: SUS_USER_RELATION; // todo >> enum ['son','sister']
}