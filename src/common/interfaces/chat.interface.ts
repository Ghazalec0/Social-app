import {Types} from "mongoose";
import {ChatType} from "../types/chat.type";

export interface IChat {
    participants: Types.ObjectId[];
    chatType: ChatType
    admin?: Types.ObjectId[];// features
    groupImage?: string
    groupName?: string
    groupId: string;// send message to socketIds for each user
    group?: string;
    group_image?: string;
    roomId?: string;
}