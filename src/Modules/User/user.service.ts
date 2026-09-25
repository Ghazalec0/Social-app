import { Types } from "mongoose";
import { ICloudProvider } from "../../common/cloud/cloud.interface";
import { s3CloudProvider } from "../../common/cloud/s3/init";
import { UserRepository } from "../../DB/Models/user/user.repository";
import { userFriendRepo, UserFriendRepository } from "../../DB/Models/user-friend/user-friend.repository"
import { User } from "../../DB/Models/user/user.model";

class UserService {
  constructor(
    private readonly cloudProvider: ICloudProvider,
    private readonly userRepository: UserRepository,
    private readonly UserFriendRepository: UserFriendRepository
  ) {}

  async uploadProfilePic(file: Express.Multer.File, userId: Types.ObjectId) {
    return await this.cloudProvider.uploadFile(file, `users/${userId.toString()}`);
  }

  async profile(userId: Types.ObjectId) {
    // هات اليوزر نفسه مباشر من المودل عشان نتأكد ان profilePicture موجود
    const user = await User.findById(userId).lean();

    // اهم سطر: لازم نعمل select للـ profilePicture
    const friends = await (this.UserFriendRepository as any).model
      .find({ $or: [{ user: userId }, { friend: userId }] })
      .populate({ path: 'user', select: 'userName email profilePicture' })
      .populate({ path: 'friend', select: 'userName email profilePicture' })
      .lean();

    console.log("FRIENDS DEBUG:", JSON.stringify(friends).slice(0,500));

    return { user, friends };
  }
}

const userRepository = new UserRepository();
export default new UserService(s3CloudProvider, userRepository, userFriendRepo);