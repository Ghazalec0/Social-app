import { PostTypeGql } from "./post.type.gql";
import postService from "../post.service";
import { Types } from "mongoose";

export const postGQLQuery = {
    post: {
        type: PostTypeGql,
        resolve: async () => {
            return await postService.getPost(new Types.ObjectId("6aa855e42f3bd53d76ea978c"));
        }
    }
}