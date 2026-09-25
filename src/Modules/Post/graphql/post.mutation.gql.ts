import { GraphQLList, GraphQLString, GraphQLBoolean, GraphQLNonNull } from "graphql";
import { Types } from "mongoose";
import postService from "../post.service";
import { PostTypeGql } from './post.type.gql'; 
import { postRepository } from '../../../DB/Models/post/post.repository';
import { isAuthGQL, isValidGQL } from "../../../Middlewares";
import { createPostSchema } from "../post.dto";

export const postMutationGql = {
    addPost: {
        type: PostTypeGql,
        args: {
            content: { type: GraphQLString },
            title: { type: GraphQLString },
            attachments: { type: new GraphQLList(GraphQLString) },
        },
        resolve: async (_: any, args: { content: string, title?: string, attachments?: string[] }, context: any) => {
            isAuthGQL(context);
            await isValidGQL(createPostSchema, args);
            const userId = new Types.ObjectId(context.payload.id);
            return await postService.create(args, userId);
        }
    },

    updatePost: {
        type: PostTypeGql,
        args: {
            content: { type: GraphQLString },
            title: { type: GraphQLString },
            attachments: { type: new GraphQLList(GraphQLString) },
            postId: { type: new GraphQLNonNull(GraphQLString) },
        },
        resolve: async (_: any, args: { content?: string, title?: string, attachments?: string[], postId: string }, context: any) => {
            isAuthGQL(context);
            const userId = new Types.ObjectId(context.payload.id);

            // التحديث مباشرة باستخدام الـ Repository مع التأكد أن البوست يخص هذا المستخدم
            return await postRepository.updateOne(
                { _id: args.postId, userId },
                { 
                    content: args.content, 
                    title: args.title, 
                    attachments: args.attachments 
                },
                { new: true } // لإرجاع النسخة المحدثة
            );
        }
    },

    deletePost: {
        type: GraphQLBoolean,
        args: {
            postId: { type: new GraphQLNonNull(GraphQLString) },
        },
        resolve: async (_: any, args: { postId: string }, context: any): Promise<boolean> => {
            isAuthGQL(context);
            const userId = new Types.ObjectId(context.payload.id);

            // الحذف مباشرة باستخدام الـ Repository مع التأكد من الملكية
            const { deletedCount } = await postRepository.deleteOne({ _id: args.postId, userId });
            return !!deletedCount;
        }
    },
};