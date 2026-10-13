import { GraphQLID, GraphQLNonNull } from "graphql";
import { PostTypeGql } from "./post.type.gql";
import postService from "../post.service";
import { Types } from "mongoose";

export const postGQLQuery = {
    post: {
        type: PostTypeGql,
        args: {
            id: { type: new GraphQLNonNull(GraphQLID) }
        },
        resolve: async (parent: any, args: { id: string }) => {
            if (!Types.ObjectId.isValid(args.id)) throw new Error("Invalid Post ID");
            return await postService.getPost(new Types.ObjectId(args.id));
        }
    }
}
