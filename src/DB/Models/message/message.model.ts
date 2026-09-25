import { model, Schema } from "mongoose";
import { IMessage } from "../../../common/interfaces/message.interface";

const schema = new Schema<IMessage>({
    content: String,
    sender: {type: Schema.Types.ObjectId, ref: "User", required: true},
    chat: {type: Schema.Types.ObjectId, ref: "Chat", required: true},
    // todo >> some features related in case group
}, {timestamps: true});

export const Message = model<IMessage>("Message", schema);