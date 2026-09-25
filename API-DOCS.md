# 📚 TS_SocialApp - API Docs
> Generated: 2026-09-25 | Base URL: `http://localhost:3000`

This is a full manual documentation generated from your actual controllers.

---

## 🔐 Authentication

Most routes require JWT.  
**Header:** `Authorization: Bearer <token>`

---

## 1) Auth Module - `/auth`

**File:** `auth.controller.ts` (public)

| Method | Endpoint | Validation | Description |
|--------|----------|------------|-------------|
| POST | `/auth/signup` | `signupSchema` | Create new user |
| POST | `/auth/login` | `loginSchema` | Login returns `data: { token, user }` |
| POST | `/auth/verify-account` | - | Verify account with OTP |
| POST | `/auth/send-otp` | - | Resend OTP |
| PATCH | `/auth/reset-password` | - | Reset password |

**Example - Signup:**
```json
POST /auth/signup
{
  "userName": "ahmed",
  "email": "a@test.com",
  "password": "123456",
  "gender": "male"
}
```

---

## 2) User Module - `/user`

**File:** `user.controller.ts` - all require `isAuthenticated`

| Method | Endpoint | Middleware | Description |
|--------|----------|------------|-------------|
| POST | `/user/upload-avatar` | `upload.single("avatar")` | Upload avatar (field: avatar) - saves filename to `User.profilePicture` |
| POST | `/user/profile-pic` | `multerUploadFile().single("profile-pic")` | Upload via S3 service `userService.uploadProfilePic` |
| GET | `/user/` | - | Get my profile + friends list |

**Response GET /user/:**
```json
{
  "success": true,
  "data": { "user": {...}, "friends": [...] }
}
```

---

## 3) Chat Module - `/chat`

**File:** `chat.controller.ts` - all require `isAuthenticated`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/chat/group/:groupId` | Get group chat. `Cache-Control: no-store` |
| GET | `/chat/:userId` | Get 1-1 chat with user. Special check: if userId == 'group' => 400 |
| DELETE | `/chat/:userId` | Delete chat between me and other user |
| PATCH | `/chat/clear/:chatId` | Clear chat for me only |

**Auth:** Uses `req.user.sub` as `ObjectId`

---

## 4) Post Module - `/post`

**File:** `post.controller.ts`

| Method | Endpoint | Middlewares | Description |
|--------|----------|-------------|-------------|
| POST | `/post/create` | `isAuthenticated, isValid(createPostSchema)` | Create post. Body: `{ content, images? }` -> `userId = req.user.sub` |
| POST | `/post/:postId/reaction` | `isAuthenticated` | Add/remove reaction. Body: `{ type: "like" | "love" etc }` => 204 |
| USE | `/post/:postId/comment` | `commentController` | Nested comment routes (see below) |

**Plus GraphQL:**
```graphql
query { ...userGQLQuery, ...postGQLQuery, ...commentGQLQuery }
mutation { ...postMutationGql }
```

---

## 5) Comment Module - `/comment` + `/post/:postId/comment`

**File:** `comment.controller.ts` - `mergeParams: true`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/comment/:id/reaction` | Add reaction to comment. Uses `commentRepo` |
| POST | `/comment/:postId` | Create comment on post |
| POST | `/comment/:postId/:parentId` | Create reply (nested) - your route pattern `/:postId{/:parentId}` |
| GET | `/comment/:postId` | Get all comments for post |
| GET | `/comment/:postId/:parentId` | Get replies for parent |
| DELETE | `/comment/:id` | Delete comment |

**Note:** Because of `router.use("/:postId/comment")` in postController, same endpoints also work as:
`POST /post/:postId/comment/:postId` etc. Prefer `/comment` version.

---

## 6) Request / Friends Module - `/request`

**File:** `request.controller.ts` - all `isAuthenticated`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/request/:receiverId` | Send friend request => 204 |
| POST | `/request/accept/:id` | Accept request by requestId => 204 |
| DELETE | `/request/decline/:id` | Decline request => 204 (calls `declineRequest2`) |
| DELETE | `/request/remove/:friendId` | Remove friend => 204 |

All use `new Types.ObjectId(req.user.sub)`

---

## 7) Core App Routes - `src/app.ts`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/uploads/*paths` | Stream file from S3 `s3CloudProvider.getFile(key)`. Throws 404 if not found |
| Static | `/uploads` | `express.static('uploads')` |
| ALL | `/graphql` | GraphQL endpoint using `graphql-http`. Context = headers. Queries: `userGQLQuery, postGQLQuery, commentGQLQuery`, Mutation: `postMutationGql` |
| POST | `/send-notification` | Test Firebase. Body: `{ token: fcmToken }` => sends welcome notification => 204 |

**Global middlewares:**
- `express.json()`
- `cors({origin:"*"})`
- `connectDB(), redisConnect()`
- Error handler returns `{ message, success:false, details? }`

**Mounted Routers:**
```ts
app.use('/auth', authController);
app.use('/user', userController);
app.use('/post', postController);
app.use('/comment', commentController);
app.use('/request', requestController);
app.use('/chat', chatController);
```

---

## 8) 💬 Realtime Gateway - Socket.IO

**File:** `realtime.gateway.ts`
**Server:** `new Server(server, {cors:{origin:"*"}})`

### Connection Auth
```js
io.use() checks socket.handshake.auth.authorization
verify(token, ACCESS_TOKEN_SECRET) => socket.data = decoded (sub, email, userName, profilePicture)
```

On connect:
- `redis: socketIds:{userId} -> add socket.id`
- `socket.join(user.sub)`

### Client -> Server Events

| Event | Payload | Description |
|-------|---------|-------------|
| `sendMessage` | `{ content: string, sendTo: userId }` | Creates message via `chatService.createMessage(senderId, recipientId, content)` |
| `sendGroupMessage` | `{ content: string, groupId: string }` | Creates group message `chatService.createGroupMessage` |
| `typing` | `{ sendTo?: string, groupId?: string, isTyping: boolean }` | Typing indicator |
| `join_room` | `{ roomId: string }` | `socket.join(roomId)` |
| `deleteChat` | `{ sendTo: string }` | Notify other user chat deleted |
| `disconnect` | - | Removes socket id from redis |

### Server -> Client Events

| Event | Payload |
|-------|---------|
| `newMessage` | `{ _id, content, text, createdAt, chat, groupId?, sender: {_id, userName, profilePicture}, from: {...} }` |
| `successMessage` | `{ content, sendTo, message: messagePayload }` sent to sender |
| `typing` | `{ from: user.sub, sender: {_id, userName, profilePicture}, isTyping, groupId }` |
| `chatDeleted` | `{ from: user.sub }` |
| `custom_error` | `{ message: "Failed to send message" }` |

**Example Client Usage:**
```js
const socket = io("http://localhost:3000", {
  auth: { authorization: token }
});
socket.emit("sendMessage", { content: "hi", sendTo: "66..." });
socket.on("newMessage", (msg) => console.log(msg));
socket.emit("typing", { sendTo: "66...", isTyping: true });
```

---

## 📦 Summary Table (Quick Copy)

| Module | Method | Path |
|--------|--------|------|
| Auth | POST | /auth/signup |
| Auth | POST | /auth/login |
| Auth | POST | /auth/verify-account |
| Auth | POST | /auth/send-otp |
| Auth | PATCH | /auth/reset-password |
| User | GET | /user/ |
| User | POST | /user/upload-avatar |
| User | POST | /user/profile-pic |
| Chat | GET | /chat/group/:groupId |
| Chat | GET | /chat/:userId |
| Chat | DELETE | /chat/:userId |
| Chat | PATCH | /chat/clear/:chatId |
| Post | POST | /post/create |
| Post | POST | /post/:postId/reaction |
| Comment | POST | /comment/:postId |
| Comment | POST | /comment/:postId/:parentId |
| Comment | GET | /comment/:postId |
| Comment | DELETE | /comment/:id |
| Comment | POST | /comment/:id/reaction |
| Request | POST | /request/:receiverId |
| Request | POST | /request/accept/:id |
| Request | DELETE | /request/decline/:id |
| Request | DELETE | /request/remove/:friendId |
| Core | GET | /uploads/*paths |
| Core | ALL | /graphql |
| Core | POST | /send-notification |
| Socket | - | sendMessage, sendGroupMessage, typing, join_room, deleteChat |

