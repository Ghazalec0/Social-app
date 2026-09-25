

// re-open

import { IUser } from "../interfaces/user.interface";

declare module "express-serve-static-core" {
    export interface Request {
        user:IUserReaction; 
    }}
