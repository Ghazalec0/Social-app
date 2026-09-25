import { Router } from "express";
import { Types } from "mongoose";

import commentService from "./comment.service";
import { commentRepo } from "../../DB/Models/comment/comment.repository";
import { addReaction } from "../../common";
import { isAuthenticated } from "../../Middlewares";

const router = Router({
  mergeParams: true,
});

// Add reaction to comment
router.post(
  "/:id/reaction",
  isAuthenticated,
  async (req, res, next) => {
    try {
      const userId = new Types.ObjectId(req.user.sub);

      await addReaction(
        {
          ...req.body,
          id: req.params.id as string,
        },
        userId,
        commentRepo
      );

      return res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  }
);

// Create comment
router.post(
  "/:postId{/:parentId}",
  isAuthenticated,
  async (req, res, next) => {
    try {
      const userId = new Types.ObjectId(req.user.sub);

      const createdComment = await commentService.create(
        req.body,
        req.params,
        userId
      );

      return res.status(201).json({
        success: true,
        message: "Comment created successfully",
        data: createdComment,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Get comments
router.get(
  "/:postId{/:parentId}",
  isAuthenticated,
  async (req, res, next) => {
    try {
      const comments = await commentService.getAll(req.params);

      return res.status(200).json({
        success: true,
        data: comments,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Delete comment
router.delete(
  "/:id",
  isAuthenticated,
  async (req, res, next) => {
    try {
      const userId = new Types.ObjectId(req.user.sub);
      const commentId = new Types.ObjectId(req.params.id as string);

      await commentService.delete(
        commentId,
        userId
      );

      return res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  }
);

export default router;