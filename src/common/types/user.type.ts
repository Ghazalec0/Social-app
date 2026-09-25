import { HydratedDocument } from "mongoose";
import { IUser } from "../interfaces";

export type UserDocument = HydratedDocument<IUser>;
// export type UserDocument = IUser & Document;
