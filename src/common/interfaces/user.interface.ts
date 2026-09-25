import { SYS_GENDER, SYS_PROVIDER, SYS_ROLE } from "../enums";

export interface IUser {
  userName: string;
  email: string;
  phoneNumber?: string;
  password: string;
  role: SYS_ROLE; // 0 1 2
  gender: SYS_GENDER | undefined; // 0 1
  provider: SYS_PROVIDER; // 0 >> system , 1 >> google
  profilePicture?: string;
}