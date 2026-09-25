import { Server, Socket } from "socket.io";
import * as http from "http";
import { ACCESS_TOKEN_SECRET } from "../../config";
import { verify, JwtPayload } from "jsonwebtoken";
import { redisCacheProvider } from "../cache/redis/init";
import { Types } from "mongoose";
import chatService from "../../Modules/chat/chat.service";

interface SocketUser extends JwtPayload {
  sub: string;
  email: string;
  profilePicture?: string;
  userName?: string;
}

export class RealtimeGateway {
  private readonly _io: Server;
  private readonly cacheProvider = redisCacheProvider;

  constructor(server: http.Server) {
    this._io = new Server(server, { cors: { origin: "*" } });
    this.establishConnection();
  }

  public establishConnection(): void {
    this._io.use((socket: Socket, next): void => {
      const token = socket.handshake.auth?.authorization;
      if (!token) return next(new Error("Access token is required"));
      try {
        const decoded = verify(token, ACCESS_TOKEN_SECRET) as SocketUser;
        socket.data = decoded;
        next();
      } catch (error) {
        next(new Error("Invalid access token"));
      }
    });

    this._io.on("connection", async (socket: Socket): Promise<void> => {
      const user = socket.data as SocketUser;
      const socketIdsLoginUser = `socketIds:${user.sub}`;
      await this.cacheProvider.addToSet(socketIdsLoginUser, socket.id);
      socket.join(user.sub);

      socket.on("sendMessage", async (data) => {
        try {
          const { content, sendTo } = data;
          if (!content?.trim() || !sendTo) return;

          const senderId = new Types.ObjectId(user.sub);
          const recipientId = new Types.ObjectId(sendTo);

          const savedMessage: any = await chatService.createMessage(senderId, recipientId, content.trim());

          const messagePayload = {
            _id: savedMessage._id,
            content: savedMessage.content,
            text: savedMessage.content,
            createdAt: savedMessage.createdAt,
            chat: savedMessage.chat,
            sender: {
              _id: savedMessage.sender._id,
              userName: savedMessage.sender.userName,
              profilePicture: savedMessage.sender.profilePicture || "",
            },
            from: {
              _id: savedMessage.sender._id,
              userName: savedMessage.sender.userName,
              profilePicture: savedMessage.sender.profilePicture || "",
            }
          };

          const recipientSocketIds = await this.cacheProvider.getAllFromSet(`socketIds:${sendTo}`);
          if (recipientSocketIds?.length) {
            recipientSocketIds.forEach((id) => this._io.to(id).emit("newMessage", messagePayload));
          } else {
            this._io.to(sendTo).emit("newMessage", messagePayload);
          }

          socket.emit("successMessage", { content: savedMessage.content, sendTo, message: messagePayload });

        } catch (error) {
          console.log("Error in sendMessage:", error);
          socket.emit("custom_error", { message: "Failed to send message" });
        }
      });

      socket.on("sendGroupMessage", async (data) => {
        try {
          const { content, groupId } = data;
          if (!content?.trim() || !groupId) return;

          const senderId = new Types.ObjectId(user.sub);
          const savedMessage: any = await chatService.createGroupMessage(senderId, new Types.ObjectId(groupId), content.trim());

          const messagePayload = {
            _id: savedMessage._id,
            content: savedMessage.content,
            text: savedMessage.content,
            groupId,
            createdAt: savedMessage.createdAt,
            sender: {
              _id: savedMessage.sender._id,
              userName: savedMessage.sender.userName,
              profilePicture: savedMessage.sender.profilePicture || "",
            },
            from: {
              _id: savedMessage.sender._id,
              userName: savedMessage.sender.userName,
              profilePicture: savedMessage.sender.profilePicture || "",
            }
          };

          this._io.to(groupId).emit("newMessage", messagePayload);
          socket.emit("successMessage", { content: savedMessage.content, sendTo: groupId, message: messagePayload });
        } catch (error) {
          console.log("Error in sendGroupMessage:", error);
        }
      });

      // ===== ده اللي كان ناقص - typing indicator =====
      socket.on("typing", async (data: { sendTo?: string; groupId?: string; isTyping: boolean }) => {
        try {
          const { sendTo, groupId, isTyping } = data;
          const target = groupId || sendTo;
          if (!target) return;

          const payload = {
            from: user.sub,
            sender: {
              _id: user.sub,
              userName: user.userName || "",
              profilePicture: user.profilePicture || "",
            },
            isTyping: !!isTyping,
            groupId: groupId || null,
          };

          if (groupId) {
            // جروب: ابعت لكل اللي في الروم ما عدا اللي بيكتب
            socket.to(groupId).emit("typing", payload);
          } else if (sendTo) {
            // خاص: ابعت للشخص التاني بس
            const recipientSocketIds = await this.cacheProvider.getAllFromSet(`socketIds:${sendTo}`);
            if (recipientSocketIds?.length) {
              recipientSocketIds.forEach((id) => {
                if (id !== socket.id) this._io.to(id).emit("typing", payload);
              });
            } else {
              this._io.to(sendTo).emit("typing", payload);
            }
          }
        } catch (e) {
          console.log("typing error", e);
        }
      });

      socket.on("join_room", (data) => {
        if (data?.roomId) socket.join(data.roomId);
      });

      socket.on("disconnect", async (): Promise<void> => {
        await this.cacheProvider.rmSet(socketIdsLoginUser, socket.id);
      });
      socket.on("deleteChat", async ({ sendTo }) => {
      const ids = await this.cacheProvider.getAllFromSet(`socketIds:${sendTo}`);
      if(ids?.length){
        ids.forEach(id => this._io.to(id).emit("chatDeleted", { from: user.sub }));
      } else {
        this._io.to(sendTo).emit("chatDeleted", { from: user.sub });
      }
    });
    });
  }

  public get io(): Server { return this._io; }
}