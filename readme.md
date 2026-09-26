# 🌐 SocialApp — Realtime Social Platform

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-20-339933?style=for-the-badge&logo=nodedotjs" />
  <img src="https://img.shields.io/badge/TypeScript-5.5-3178C6?style=for-the-badge&logo=typescript" />
  <img src="https://img.shields.io/badge/Express-5.2-000000?style=for-the-badge&logo=express" />
  <img src="https://img.shields.io/badge/MongoDB-Mongoose_9-47A248?style=for-the-badge&logo=mongodb" />
  <img src="https://img.shields.io/badge/Socket.IO-4.8-010101?style=for-the-badge&logo=socketdotio" />
  <img src="https://img.shields.io/badge/AWS_S3-Storage-FF9900?style=for-the-badge&logo=amazons3" />
</p>

<p align="center">
  <b>Production-ready social backend — REST + GraphQL + Socket.IO + Redis + S3 + Firebase Push + EJS Docs with real fetch testing.</b><br/>
  <code>src/main.ts</code> → Express + Socket.IO + GraphQL + /uploads S3 streaming
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-getting-started">Quick Start</a> •
  <a href="#-api-reference">API</a> •
  <a href="#-socketio-realtime">Realtime</a> •
  <a href="#-graphql">GraphQL</a> •
  <a href="#-env">ENV</a>
</p>

---

## ✨ Features

- **🔐 Auth:** signup, login, verify-account (OTP), send-otp, reset-password — JWT access + refresh, bcrypt, nodemailer via Gmail App Password
- **👤 User:** GET /user/, profile + friends, upload avatar `multer` → S3, profile-pic
- **📝 Post:** create, reaction (`/post/:postId/reaction`) — PostModel + postGQLQuery
- **💬 Comment:** threaded comments, reactions, `POST /comment/:postId`, `GET /comment/:postId`, `DELETE /comment/:id`, `POST /comment/:id/reaction` — commentGQLQuery
- **🤝 Request:** friend system — `POST /request/:receiverId`, accept, decline, remove — request collection
- **💭 Chat:** 1-1 & group — `GET /chat/:userId`, `GET /chat/group/:groupId`, clear for me, delete — chatModel + chatGQL + messageInterface
- **⚡ Realtime Gateway:** `src/common/realtime-gateway/realtime.gateway.ts` — Socket.IO with `isAuthenticated` for sockets, Redis registry (`redis.connect`), events: `sendMessage`, `sendGroupMessage`, `typing`, `join_room`, `deleteChat`, `chatDeleted`, `newMessage`
- **☁️ Storage:** `s3CloudProvider` (`@aws-sdk/client-s3`, `@aws-sdk/s3-request-presigner`), route `GET /uploads/*paths` streams from S3 via `multer.ts`
- **🔔 Push:** Firebase Admin (`firebase-admin`) — `POST /send-notification` in `appcontroller.ts`, `notificationInterface`, `notification.ts`
- **🧠 GraphQL:** `graphql-http` at `POST /graphql` — `userGQLQuery`, `postGQLQuery`, `commentGQLQuery`, `chatGQL`, `requestGQL`
- **📄 Docs:** Luxury calm docs at `GET /docs` → `views/docs.ejs` — EJS view, fully editable Base URL / Full URL / Path params / JSON body / Headers, real `fetch()` to `http://localhost:3000`, distinct colors for request vs response, shadows, animations
- **🛡️ Validation & Middleware:** `zod` + `auth.validation.ts`, `user.validation.ts`, `isValid`, `isAuthenticated`, `authentication.middleware.ts`, `multer.middleware.ts`

---

## 🧱 Tech Stack

**From your `package.json`:**
```json
"@aws-sdk/client-s3": "^3.1134.0",
"@aws-sdk/s3-request-presigner": "^3.1136.0",
"bcrypt": "^6.0.0",
"cors": "^2.8.6",
"dotenv": "^17.4.2",
"ejs": "^6.0.1",
"express": "^5.2.1",
"firebase-admin": "^14.4.0",
"graphql": "^17.0.2",
"graphql-http": "^1.23.0",
"mongoose": "^9.10.0",
"multer": "^2.4.0",
"nodemailer": "^10.0.10",
"redis": "^6.2.1",
"socket.io": "^4.8.3",
"zod": "^4.6.4"
```

- **Build:** `typescript` target ES2020, module Node16, `tsc-alias`, `tsx watch`, `concurrently`
- **DB:** `DB/Models/` — `user.model`, `post.model`, `comment.model`, `chat.model`, `request.model`, `user-friend.model`, `user-reaction.model` + `abstract.repository.ts`, `chat.repository.ts`

---

## 📁 Folder Structure (from your screenshot)

```
TS_SocialApp/
├── src/
│   ├── common/
│   │   ├── cache/redis/redis.connect, redis.interface
│   │   ├── media/media.service
│   │   ├── cloud/s3/cloudinary + s3/ + cloud.interface + dbt.ts + dto.ts
│   │   ├── email/email.controller, secure, common.interface
│   │   ├── notification/firebase/init + notification.interface + notification.ts
│   │   ├── realtime-gateway/realtime.gateway.ts
│   │   └── services/chat.service.ts + express.ts + index.ts
│   ├── utils/
│   │   ├── index.ts + appError.ts
│   │   └── config/index.ts
│   ├── DB/
│   │   ├── Models/ (user, post, message, comment, chat, user-friend, user-reaction, abstract.repository, chat.repository, chat.models, common.interface...)
│   │   ├── connection.ts
│   │   └── chat.model.ts
│   ├── Middlewares/
│   │   ├── abstract.repository, authentication.middleware, authorization.middleware, validation.middleware, multer.middleware
│   ├── Modules/
│   │   ├── Auth/ (auth.controller, auth.service, auth.validation)
│   │   ├── User/ (user.controller, user.service, user.validation + graphql + user-friend.model)
│   │   ├── Post/ (post.controller, post.service + graphql)
│   │   ├── Comment/ (comment.controller, comment.service + graphql + docs)
│   │   ├── Chat/ (chat.controller, chat.service)
│   │   └── Request/ (request.controller, request.service + graphql)
│   ├── app.controller.ts (uploads/*paths S3 streaming + /graphql + /send-notification + docs route)
│   └── main.ts (bootstrap)
├── views/
│   └── docs.ejs ← calm luxury docs, editable, real fetch, no /api/v1 prefix
├── dist/ (outDir from tsconfig)
├── .env
├── tsconfig.json (rootDir ./src, outDir ./dist, ES2020, Node16, strict, noUncheckedIndexedAccess)
└── package.json
```

---

## 🔧 ENV — Professional Version

Your current `.env` is missing critical vars. Replace with:

```env
# App
NODE_ENV=development
PORT=3000
BASE_URL=http://localhost:3000
FRONTEND_URL=http://localhost:5173

# DB
DB_URI=mongodb://localhost:27017/SocialApp
REDIS_URL=redis://localhost:6379
# REDIS_URL=rediss://default:gQAAAAAA...@host:6380

# Auth — generate strong
ACCESS_TOKEN_SECRET=PUT_64_CHAR_HEX_HERE
REFRESH_TOKEN_SECRET=PUT_ANOTHER_64_CHAR_HEX_HERE
ACCESS_TOKEN_EXPIRE=15m
REFRESH_TOKEN_EXPIRE=7d
BCRYPT_SALT_ROUNDS=12

# OTP / Mail (Gmail App Password)
SEND_MAIL_USER=dev.ghazaleco@gmail.com
SEND_MAIL_PASS=zigu ubcg icrt owqq
OTP_EXPIRE_MINUTES=5

# AWS S3
AWS_REGION=eu-north-1
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
AWS_S3_BUCKET=socialapp-uploads

# Firebase Admin (from serviceAccount JSON)
FIREBASE_PROJECT_ID=socialapp-xxxxx
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-...@...iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

Generate secrets:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## 🚀 Getting Started

```bash
# clone
git clone <repo>
cd TS_SocialApp

# install
npm install

# env
cp .env.example .env
# fill DB_URI, REDIS_URL, AWS_*, FIREBASE_*, SEND_MAIL_*

# dev - uses tsx watch src/main.ts (from your scripts)
npm run dev
# or your concurrent build
npm run start:dev
# → tsc --watch + node --watch --env-file=.env --experimental-specifier-resolution=node

# prod
npm run build   # tsc --watch (change to tsc in package.json for prod)
npm start       # cross-env NODE_ENV=prod node .

# URLs
# API: http://localhost:3000
# Docs: http://localhost:3000/docs  (or /api/v1/docs per app.controller.ts)
# GraphQL: http://localhost:3000/graphql
# Uploads: http://localhost:3000/uploads/<path>
```

Your `tsconfig.json`:
- `rootDir: ./src`, `outDir: ./dist`, `target: ES2020`, `module: Node16`, `strict: true`, `noUncheckedIndexedAccess: true`, `exactOptionalPropertyTypes: true`

---

## 📡 API Reference — Real Routes (no /api/v1 prefix per your request)

Base `http://localhost:3000`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /auth/signup | No | { userName, email, password, gender } → OTP mail |
| POST | /auth/login | No | { email, password } → access + refresh |
| POST | /auth/verify-account | No | { email, otp } |
| POST | /auth/send-otp | No | { email } resend |
| PATCH | /auth/reset-password | No | { email, otp, newPassword } |
| GET | /user/ | Yes | my profile + friends list |
| POST | /user/upload-avatar | Yes | form-data `avatar` multer → S3 |
| POST | /user/profile-pic | Yes | profile-pic → S3 |
| POST | /post/create | Yes | { content, privacy, images? } |
| POST | /post/:postId/reaction | Yes | { type: like/love } |
| POST | /comment/:postId | Yes | { content, replyTo? } |
| GET | /comment/:postId | Yes | threaded |
| DELETE | /comment/:id | Yes | owner only |
| POST | /comment/:id/reaction | Yes | react to comment |
| POST | /request/:receiverId | Yes | send friend request |
| POST | /request/accept/:id | Yes | accept |
| DELETE | /request/decline/:id | Yes | decline |
| DELETE | /request/remove/:friendId | Yes | unfriend |
| GET | /chat/:userId | Yes | 1-1 history |
| GET | /chat/group/:groupId | Yes | group history |
| DELETE | /chat/:userId | Yes | delete chat |
| PATCH | /chat/clear/:chatId | Yes | clear for me |
| GET | /uploads/*paths | No | stream via s3CloudProvider.getFile |
| POST | /graphql | Yes/No | userGQLQuery, postGQLQuery... |
| POST | /send-notification | Yes | Firebase push |

Test from docs: open `views/docs.ejs` — editable Base URL `http://localhost:3000`, Full URL `http://localhost:3000/auth/login`, JSON body fully editable, Headers editable, real fetch().

---

## 🔌 Socket.IO Realtime

`src/common/realtime-gateway/realtime.gateway.ts`

```js
import { io } from "socket.io-client";
const socket = io("http://localhost:3000", {
  auth: { authorization: `Bearer ${accessToken}` }
});

socket.on("connect", () => console.log(socket.id));
socket.on("newMessage", (msg) => {});
socket.on("typing", ({ from, isTyping }) => {});
socket.on("chatDeleted", () => {});

socket.emit("sendMessage", { content: "hi", sendTo: userId });
socket.emit("sendGroupMessage", { content: "hello group", groupId });
socket.emit("typing", { sendTo: userId, isTyping: true });
socket.emit("join_room", { roomId: groupId });
socket.emit("deleteChat", { sendTo: userId });
```

Redis stores `socketId` per user for horizontal scale.

---

## 🧠 GraphQL

Endpoint `POST /graphql` via `graphql-http`. Queries from `src/Modules/*/graphql/`:

```graphql
query {
  userGQLQuery { id userName email friends }
  postGQLQuery { id content author reactions }
  commentGQLQuery(postId: "...") { id content replies }
}
```

Playground: `GRAPHQL_PLAYGROUND=true` + open `/graphql`

---

## 📄 Docs UI — Quiet Luxury

`views/docs.ejs`:
- Light theme #fcfcf9, no particles, serif headings, mono code
- Sidebar modules with counts: Auth 5, User 3, Chat 4, Post 2, Comment 4, Request 4, Core 3, Realtime 5
- Distinct tints: Auth violet #faf5ff, User blue #eff6ff, Chat emerald #ecfdf5, Post amber #fffbeb etc + soft shadows + hover lift
- Try modal: Base URL editable, Full URL editable, path params inputs, query string editable, JSON body dark #111110 editable with validation, Headers editable, Response warm #fdf8f0 distinct from body
- Real `fetch(BASE_URL + path)` — no mock

Route in `src/app.controller.ts`:
```ts
app.set('view engine', 'ejs');
app.set('views', path.join(process.cwd(), 'views'));
app.get('/docs', (req,res) => res.render('docs'));
// or res.sendFile(path.join(process.cwd(),'views','docs.ejs'))
```

---

## 🛡️ Security Notes

- Your `ACCESS_TOKEN_SECRET=login1234567` is weak — replace immediately with 64-char hex.
- Add `REFRESH_TOKEN_SECRET` different from access.
- Your `.env` in screenshot shows `DB_URI=mongodb://ghazaleco:NlmWYXZaKV3xTyEx@ac-` — rotate if leaked.
- `SEND_MAIL_PASS=zigu ubcg icrt owqq` is Gmail App Password — don't commit `.env`.
- In `main.ts` you have `cors({ origin: "*" })` — set to `FRONTEND_URL` in prod.
- Add rate-limit to `/auth/*`.

---

## 📦 Scripts

```json
"start:dev": "concurrently \"tsc --watch\" \"node --watch --env-file=.env --experimental-specifier-resolution=node ./\"",
"dev": "cross-env NODE_ENV=dev tsx watch src/main.ts",
"build": "tsc --watch",
"start": "cross-env NODE_ENV=prod node ."
```
> Fix: change `build` to `tsc && tsc-alias` for prod.

---

## 👨‍💻 Author

SocialApp — built with Express 5, Mongoose 9, Redis 6, Socket.IO 4, S3, Firebase.

Docs: `views/docs.ejs` — SocialApp branding, social bubble logo gradient violet→indigo.
