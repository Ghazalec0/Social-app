import { Router } from "express";
import { Types } from "mongoose";

import postService from "./post.service";
import { createPostSchema } from "./post.dto";
import { isAuthenticated, isValid } from "../../Middlewares";
import commentController from "../Comment/comment.controller";

const router = Router();

router.use("/:postId/comment", commentController);

// Create post
router.post(
  "/create",
  isAuthenticated,
  isValid(createPostSchema),
  async (req, res, next) => {
    try {
      const userId = new Types.ObjectId(req.user.sub);

      const createdPost = await postService.create(
        req.body,
        userId
      );

      return res.status(201).json({
        success: true,
        message: "Post created successfully",
        data: {
          createdPost,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Add / remove reaction
router.post(
  "/:postId/reaction",
  isAuthenticated,
  async (req, res, next) => {
    try {
      const userId = new Types.ObjectId(req.user.sub);

      await postService.addReaction(
        {
          ...req.body,
          postId: req.params.postId as string,
        },
        userId
      );

      return res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  }
);

export default router;