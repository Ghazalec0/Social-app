import { model, Schema } from 'mongoose';
import { IChat } from '../../../common/interfaces/chat.interface';
import { ChatType } from "../../../common/types/chat.type";

const schema = new Schema<IChat>({
    participants: { type: [Schema.Types.ObjectId], ref: 'User', required: true },
    chatType: { type: String, enum: ChatType, default: ChatType.PRIVATE },
    group: {
        type: String,
        required: function(this: any) { return this.chatType == ChatType.GROUP; }
    },
    group_image: { type: String },
    roomId: { type: String }, 

    admin: {
        type: [Schema.Types.ObjectId],
        ref: 'User',
        required: function (this: any): boolean {
            return this.chatType == ChatType.GROUP;
        }
    },
}, { timestamps: true });

export const Chat = model<IChat>("Chat", schema);