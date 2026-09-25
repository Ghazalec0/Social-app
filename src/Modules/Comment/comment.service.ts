import { Types } from "mongoose";
import { CreateCommentDTO } from "./comment.dto";
import { PostRepository } from "../../DB/Models/post/post.repository";
import { IPost, NotFoundException, UnAuthorizedException } from "../../common";
import { CommentRepository } from "../../DB/Models/comment/comment.repository";

class CommentService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly commentRepository: CommentRepository,
  ) {}

  // data >> body >> dto
  async create(
    createCommentDTO: CreateCommentDTO,
    params: any,
    userId: Types.ObjectId,
  ) {
    // postId check existence
        // postId check existence
    if (params.postId) {
      const postExist = await this.postRepository.getOne({
        _id: new Types.ObjectId(params.postId),
      }); // null
      if (!postExist) throw new NotFoundException("post not found");
    }
    // if parentId >> reply check parentId
    let parentCommentExist = undefined;
    if (params.parentId) {
       parentCommentExist = await this.commentRepository.getOne({
        _id: new Types.ObjectId(params.parentId),
      });
      if (!parentCommentExist) throw new NotFoundException("comment not found");
    }
    // if yes create comment
    return await this.commentRepository.create({
    ...createCommentDTO,
    ...params,
    userId,
    postId : params.postId || parentCommentExist?.postId,
    });
  }
  async getAll(params: any) {
    // params >> { postId , parentId }
    const comments = await this.commentRepository.getAll({
      postId: params.postId,
      parentId: params.parentId,
    });
    if (comments.length == 0) throw new NotFoundException("No comments");
    return comments;
  }

  async getComment(commentId: Types.ObjectId){
    return await this.commentRepository.getOne({_id: commentId}, {}, {
        populate: [
            {path: "userId"},
            {path: "postId",populate:[{path:"userId"}]}
        ]
    }) // tid, content, attachment, userId:id, postId:id
  }

  // delete comment
 async delete(id: Types.ObjectId, userId: Types.ObjectId) {
      // check comment existence
      const commentExist = await this.commentRepository.getOne(
        { _id: id },
        {},
        { populate: [{ path: "postId" }] },
      ); // {} | null
      if (!commentExist) throw new NotFoundException("comment not found");
      // {_id,content,attachment,UserId:1,parentId:1,postId:[{userId:1}]}
      // commentAuthor comment.userId
      let commentAuthor = commentExist.userId.toString();
      let postAuthor = (commentExist.postId as unknown as IPost)?.userId?.toString();
      if (!postAuthor || !commentAuthor.includes(userId.toString())) {
        throw new UnAuthorizedException(
          "you are not allowed to delete this comment",
        );
      }
    // delete comment
    await this.commentRepository.deleteOne({ _id: id });
  }



}
 
export default new CommentService(
    new PostRepository(),
    new CommentRepository
)