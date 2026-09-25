import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import { BadRequestException, NotFoundException } from "./common";
import {
  authController,
  chatController,
  commentController,
  postController,
  requestController,
  userController
} from "./Modules";
import { connectDB } from "./DB/connection";
import { redisConnect } from "./DB/Models/redis.connect";
import { pipeline } from "node:stream";
import { promisify } from "node:util";
import { s3CloudProvider } from "./common/cloud/s3/init";
import { firebasePushNotificationProvider } from "./common/notification/firebase/init";
import cors from "cors";
import { createHandler } from "graphql-http/lib/use/express";
import { GraphQLObjectType, GraphQLSchema } from "graphql";
import { userGQLQuery } from "./Modules/User/graphql/user.gql.query";
import { postGQLQuery } from "./Modules/Post/graphql/post.gql.query";
import { commentGQLQuery } from "./Modules/Comment/graphql/comment.query.gql";
import { postMutationGql } from "./Modules/Post/graphql/post.mutation.gql";
import { RealtimeGateway } from "./common/realtime-gateway/realtime.gateway";
import path from 'path';

const pipelinePromise = promisify(pipeline);

// انشاء الـ app برا عشان نعملها export لـ Vercel
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(process.cwd(), 'views'));

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
app.use(express.json());
app.use(cors({ origin: "*" }));

app.get('/', (req, res) => {
  res.json({ message: 'Social App API is running ', docs: '/docs', status: 'Ready' });
});

app.get('/uploads/{*paths}', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const pathsParam = (req.params as any).paths;
    let key: string = Array.isArray(pathsParam) ? pathsParam.join('/') : pathsParam;
    const fileExist = await s3CloudProvider.getFile(key);
    if (!fileExist) throw new NotFoundException('File not found');
    await pipelinePromise(fileExist as any, res);
  } catch (err) {
    next(err);
  }
});

const query = new GraphQLObjectType({
  name: "RootQuery",
  fields: { ...userGQLQuery, ...postGQLQuery, ...commentGQLQuery }
});
const mutation = new GraphQLObjectType({
  name: "RootMutation",
  fields: { ...postMutationGql }
});
const schema = new GraphQLSchema({ query, mutation });

app.get('/docs', (req, res) => { res.render('docs'); });

app.all('/graphql', createHandler({
  schema,
  context: (req: any) => ({ x: 1, headers: req.headers }),
  formatError: (error: any) => ({
    message: error.message,
    success: false,
    statusCode: error.originalError?.cause || error.extensions?.cause || 400
  } as any)
}));

app.post('/send-notification', async (req: Request, res: Response): Promise<void> => {
  let fcmToken: any = req.body.token;
  await firebasePushNotificationProvider.send(fcmToken, {
    body: `welcome at ${new Date()}`,
    title: "firebase notification"
  });
  res.sendStatus(204);
});

app.use('/auth', authController);
app.use('/user', userController);
app.use('/post', postController);
app.use('/comment', commentController);
app.use('/request', requestController);
app.use('/chat', chatController);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found", success: false });
});

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  return res.status((error.cause as number) || 500).json({
    message: error.message,
    success: false,
    details: error instanceof BadRequestException ? error.details : undefined,
  });
});

export async function bootstrap() {
  const port = Number(process.env.PORT) || 3000;
  await connectDB();
  await redisConnect();
  
  if (!process.env.VERCEL) {
    const server = app.listen(port, (): void => {
      console.log("application is running on port", port);
    });
    new RealtimeGateway(server);
  } else {
    app.listen(port, () => console.log("Running on Vercel", port));
  }
}


export default app;