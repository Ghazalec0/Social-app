import { GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString } from "graphql";
import { UserGqlType } from "../../User/graphql/user.gql.type";

export const PostTypeGql = new GraphQLObjectType({
    name: "PostType",
    fields: {
        content: {type: GraphQLString},
        attachments: {type: new GraphQLList(GraphQLString)},
        reactionsCount: {type: GraphQLInt},
        commentsCount: {type: GraphQLInt},
        sharesCount: {type: GraphQLInt},
        user: {
            type: UserGqlType,
            resolve: (parent: any): any => {
                return parent.userId;
            }
        },
    }
})