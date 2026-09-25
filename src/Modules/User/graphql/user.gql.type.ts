import {GraphQLID, GraphQLObjectType, GraphQLString} from "graphql/type";

export const UserGqlType = new GraphQLObjectType({
    name: "UserType",
    fields: {
        _id: {type: GraphQLID},
        userName: {type: GraphQLString},
        email: {type: GraphQLString},
        phoneNumber: {type: GraphQLString},
        password: {type: GraphQLString},
        role: {type: GraphQLString},
        provider: {type: GraphQLString},
        gender: {type: GraphQLString},
        profilePic: {type: GraphQLString},
    }
})