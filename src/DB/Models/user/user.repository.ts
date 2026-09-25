import { IUser } from "../../../common";
import { AbstractRepository } from "../../abstract.repository";
import { User } from "./user.model";

export class UserRepository extends AbstractRepository<IUser> {
  constructor() {
    super(User);
  }
}

export const userRepo = new UserRepository();


