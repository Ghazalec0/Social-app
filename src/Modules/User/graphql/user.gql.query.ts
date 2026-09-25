import {UserGqlType} from "./user.gql.type";
import userService from "../user.service";
import {Types} from "mongoose";

export const userGQLQuery = {
    user: {
        type: UserGqlType,
        resolve: async () => {
            return await userService.profile(new Types.ObjectId("6aa81da08413dba36fa7746b"));
        }
    }
}