import { Types } from "mongoose";
import { chatRepo, ChatRepository } from "../../DB/Models/chat/chat.repository";
import { messageRepo, MessageRepository } from "../../DB/Models/message/message.repository";
import { ChatType } from "../../common/types/chat.type";

export class ChatService {
    constructor(
        private readonly chatRepository: ChatRepository,
        private readonly messageRepository: MessageRepository
    ) {}

    async getChat(userId: Types.ObjectId, loginUser: Types.ObjectId): Promise<any> {
        let chat: any = await this.chatRepository.getOne(
            { participants: { $all: [userId, loginUser] }, chatType: ChatType.PRIVATE },
            {},
            { populate: [{ path: "participants", select: "userName profilePicture" }] }
        );

        if (!chat) {
            const newChat = await this.chatRepository.create({
                participants: [userId, loginUser],
                chatType: ChatType.PRIVATE
            });
            chat = await this.chatRepository.getOne(
                { _id: newChat._id },
                {},
                { populate: [{ path: "participants", select: "userName profilePicture" }] }
            );
        }

        const messages = await this.getMessages(chat._id);
        return { chat, messages };
    }

    async getGroupChat(groupId: Types.ObjectId, loginUser: Types.ObjectId): Promise<any> {
        const chat: any = await this.chatRepository.getOne(
            { _id: groupId, participants: { $in: [loginUser] } },
            {},
            { populate: [
                { path: "participants", select: "userName profilePicture" },
                { path: "admin", select: "userName profilePicture" }
            ]}
        );
        if (!chat) throw new Error("Group not found or you are not a member");

        const messages = await this.getMessages(chat._id);
        return { chat, messages };
    }

    async createMessage(senderId: Types.ObjectId, recipientId: Types.ObjectId, content: string): Promise<any> {
        let chat: any = await this.chatRepository.getOne({
            participants: { $all: [senderId, recipientId] },
            chatType: ChatType.PRIVATE
        });

        if (!chat) {
            chat = await this.chatRepository.create({
                participants: [senderId, recipientId],
                chatType: ChatType.PRIVATE
            });
        }

        const message = await this.messageRepository.create({
            content,
            sender: senderId,
            chat: chat._id
        });

        const populatedMessage = await this.messageRepository.getOne(
            { _id: message._id },
            {},
            { populate: [{ path: "sender", select: "userName profilePicture" }] }
        );

        return populatedMessage;
    }

    async createGroupMessage(senderId: Types.ObjectId, groupId: Types.ObjectId, content: string): Promise<any> {
        const chat: any = await this.chatRepository.getOne({
            _id: groupId,
            participants: { $in: [senderId] }
        });

        if (!chat) throw new Error("Group not found");

        const message = await this.messageRepository.create({
            content,
            sender: senderId,
            chat: groupId
        });

        const populatedMessage = await this.messageRepository.getOne(
            { _id: message._id },
            {},
            { populate: [{ path: "sender", select: "userName profilePicture" }] }
        );

        return populatedMessage;
    }

    private async getMessages(chatId: Types.ObjectId): Promise<any> {
        return await this.messageRepository.getAll(
            { chat: chatId },
            {},
            {
                populate: [{ path: "sender", select: "userName profilePicture" }],
                limit: 100,
                sort: { createdAt: 1 }
            }
        );
    }
    async deleteChat(userId: Types.ObjectId, otherUserId: Types.ObjectId) {
        const chat: any = await this.chatRepository.getOne({
            participants: { $all: [userId, otherUserId] },
            chatType: ChatType.PRIVATE
        });

        if (!chat) return { deleted: false, message: "Chat not found" };

        await this.messageRepository.deleteMany({ chat: chat._id });

        await this.chatRepository.deleteOne({ _id: chat._id });

        return { deleted: true };
    }

    async clearChatForMe(userId: Types.ObjectId, chatId: Types.ObjectId) {
        await this.chatRepository.updateOne(
            { _id: chatId },
            { $addToSet: { deletedFor: userId } }
        );
        return { cleared: true };
    }
}
export default new ChatService(chatRepo, messageRepo);