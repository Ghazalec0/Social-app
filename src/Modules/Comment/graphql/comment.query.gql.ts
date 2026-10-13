import { GraphQLID, GraphQLNonNull } from "graphql";
import commentService from "../comment.service";
import { Types } from "mongoose";
import { CommentGqlType } from "./comment.type.gql";

export const commentGQLQuery = {
    comment: {
        type: CommentGqlType,
        args: {
            id: { type: new GraphQLNonNull(GraphQLID) }
        },
        resolve: async (parent: any, args: { id: string }) => {
            if (!Types.ObjectId.isValid(args.id)) throw new Error("Invalid Comment ID");
            return await commentService.getComment(new Types.ObjectId(args.id));
        }
    }
}
