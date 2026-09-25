import { Types } from "mongoose";
import { AddReactionDTO, CreatePostDTO } from "./post.dto";
import { PostRepository } from "../../DB/Models/post/post.repository";
import { UserReactionRepository } from "../../DB/Models/user-reaction/user-reaction.repository";
import { NotFoundException, ON_MODEL } from "../../common";

export class PostService {
  constructor(
  private readonly postRepository: PostRepository,
  private readonly userReactionRepository: UserReactionRepository,
) {}
  
  // data >> body >> DTO
  async create(createPostDTO: CreatePostDTO, userId: Types.ObjectId) {
    // repository >> create post

    return await this.postRepository.create({ ...createPostDTO, userId });
  }

  async addReaction(addReactionDTO: AddReactionDTO, userId: Types.ObjectId) {
  // check post existence
  const postExist = await this.postRepository.getOne({
    _id: addReactionDTO.postId,
  });

  if (!postExist) {
    throw new NotFoundException("Post not found");
  }

  // check user reactions
  const userReaction = await this.userReactionRepository.getOne({
    onModel: ON_MODEL.Post,
    refId: addReactionDTO.postId,
    userId,
  });
   
    // if no reaction >> create new reaction
  if (!userReaction) {
    await this.userReactionRepository.create({
      onModel: ON_MODEL.Post,
      refId: addReactionDTO.postId,
      userId,
      reaction: addReactionDTO.reaction,
    });
    await this.postRepository.updateOne(
      { _id: addReactionDTO.postId },
      { $inc: { reactionsCount: 1 } },
    );
    return;
  }

    // if same reaction >> remove reaction
  if (userReaction.reaction == addReactionDTO.reaction) {
    await this.userReactionRepository.deleteOne({ _id: userReaction._id });
      await this.postRepository.updateOne(
        { _id: addReactionDTO.postId },
        { $inc: { reactionsCount: -1 } },
      );
      return;
    }
    // if different reaction >> update reaction
    await this.userReactionRepository.updateOne(
      { _id: userReaction._id },
      { reaction: addReactionDTO.reaction },
    );
    return;
  }

  async getPost(postId: Types.ObjectId){
    return await this.postRepository.getOne({_id: postId}, {}, {populate: {path: "userId"}})
  }
}
export default new PostService(
  new PostRepository(),
  new UserReactionRepository(),
);