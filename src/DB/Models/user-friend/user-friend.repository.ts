
import { IUserFriend } from "../../../common";
import { AbstractRepository } from "../../abstract.repository";
import { UserFriend } from "./user-friend.model";

export class UserFriendRepository extends AbstractRepository<IUserFriend> {
  constructor() {
    super(UserFriend);
  }
}

export const userFriendRepo = new UserFriendRepository();