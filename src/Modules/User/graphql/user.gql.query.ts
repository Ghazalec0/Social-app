import { GraphQLID, GraphQLNonNull } from "graphql";
import { UserGqlType } from "./user.gql.type";
import userService from "../user.service";
import { Types } from "mongoose";

export const userGQLQuery = {
    user: {
        type: UserGqlType,
        args: {
            id: { type: new GraphQLNonNull(GraphQLID) } 
        },
        resolve: async (parent: any, args: { id: string }) => {
            return await userService.profile(new Types.ObjectId(args.id));
        }
    }
}
