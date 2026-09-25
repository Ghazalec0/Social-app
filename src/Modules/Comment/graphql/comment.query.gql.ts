import commentService from "../comment.service";
import {Types} from "mongoose";
import { CommentGqlType } from "./comment.type.gql";

export const commentGQLQuery = {
    comment: {
        type: CommentGqlType,
        resolve: async () => {
           return await commentService.getComment(new Types.ObjectId("6aa94bebf0f65cfff38bb17d"))
        }
    }
}