import z from 'zod';
import { BadRequestException, SYS_REACTION } from '../../common';
import { Types } from 'mongoose';
// data transfer object
export interface CreatePostDTO {
  // userId will be extracted from the token >> req.user.id
  content: string;
  attachments?: string[]; // [url, url, ...]
} 


export const createPostSchema = z
  .object({
    content: z.string().optional(),
    attachments: z.array(z.string()).optional(),
  })
  .refine((data) => {
    const { content, attachments } = data;
    if (!content && (!attachments || attachments.length === 0)) {
      throw new BadRequestException('Conttent or attachments must be provided');
    }
    return true;
  });

  export interface AddReactionDTO {
  postId: Types.ObjectId;
  reaction: SYS_REACTION; 
}