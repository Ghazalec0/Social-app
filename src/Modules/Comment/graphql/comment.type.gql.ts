import {GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString} from "graphql/type";
import { UserGqlType, } from "../../User/graphql/user.gql.type";
import { PostTypeGql } from "../../Post/graphql/post.type.gql";
export const CommentGqlType = new GraphQLObjectType({
    name: "CommentType",
    fields: {
        user: {
            type:UserGqlType,
            resolve: (parent: any): any => {
                return parent.userId
            }
    },
        post: {
        type: PostTypeGql,
        resolve: (parent: any): any => {
            return parent.postId
        }
    },   
        content: {type: GraphQLString},
        attachment: {type: GraphQLString},
        mentions: {type: new GraphQLList(UserGqlType)},
        reactionsCount: {type: GraphQLInt}
    }
})