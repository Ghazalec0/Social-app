import { UserReactionRepository } from "../../DB/Models/user-reaction/user-reaction.repository";
import { AddReactionDTO } from "../dto";
import { BadRequestException, NotFoundException } from "../utils";
import { ON_MODEL } from "../enums";
import { PostRepository } from "../../DB/Models/post/post.repository";
import { CommentRepository } from "../../DB/Models/comment/comment.repository";
import { Types } from "mongoose";

function toModel(collectionName: string) {
  switch (collectionName) {
    case "posts":
      return ON_MODEL.Post;
    case "comments":
      return ON_MODEL.Comment;

    default:
      throw new BadRequestException("invalid collection");
  }
}
export const addReaction = async (
  addReactionDTO: AddReactionDTO,
  userId: Types.ObjectId,
  repo: PostRepository | CommentRepository,
) => {
  const docExist = await repo.getOne({
    _id: addReactionDTO.id,
  });

  if (!docExist) {
    throw new NotFoundException(`${repo.model.modelName} not found`);
  }
  const collectionName = docExist.collection.name;
  const userReactionRepository = new UserReactionRepository();
  const userReaction = await userReactionRepository.getOne({
    onModel: toModel(collectionName),
    refId: addReactionDTO.id,
    userId,
  });
  if (!userReaction) {
    await userReactionRepository.create({
      onModel: toModel(collectionName),
      refId: addReactionDTO.id,
      userId,
      reaction: addReactionDTO.reaction,
    });
    await repo.updateOne(
      { _id: addReactionDTO.id },
      { $inc: { reactionsCount: 1 } },
    );
    return;
  }

  if (userReaction.reaction == addReactionDTO.reaction) {
    // console.log({ userReaction });

    await userReactionRepository.deleteOne({
      _id: userReaction._id,
    });

    await repo.updateOne(
      { _id: addReactionDTO.id },
      { $inc: { reactionsCount: -1 } },
    );
    return;
  }
}