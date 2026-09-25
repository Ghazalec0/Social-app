import { Router } from "express";
import { Types } from "mongoose";

import requestService from "./request.service";
import { isAuthenticated } from "../../Middlewares";

const router = Router();

// Send friend request
router.post(
  "/:receiverId",
  isAuthenticated,
  async (req, res, next) => {
    try {
      const senderId = new Types.ObjectId(req.user.sub);
      const receiverId = new Types.ObjectId(req.params.receiverId as string);

      await requestService.sendRequest(
        senderId,
        receiverId
      );

      return res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  }
);

// Accept friend request
router.post(
  "/accept/:id",
  isAuthenticated,
  async (req, res, next) => {
    try {
      const userId = new Types.ObjectId(req.user.sub);
      const requestId = new Types.ObjectId(req.params.id as string);

      await requestService.acceptRequest(
        userId,
        requestId
      );

      return res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  }
);

// Decline friend request
router.delete(
  "/decline/:id",
  isAuthenticated,
  async (req, res, next) => {
    try {
      const userId = new Types.ObjectId(req.user.sub);
      const requestId = new Types.ObjectId(req.params.id as string);

      await requestService.declineRequest2(
        userId,
        requestId
      );

      return res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  }
);

// Remove friend
router.delete(
  "/remove/:friendId",
  isAuthenticated,
  async (req, res, next) => {
    try {
      const userId = new Types.ObjectId(req.user.sub);
      const friendId = new Types.ObjectId(req.params.friendId as string);

      await requestService.removeFriend(
        userId,
        friendId
      );

      return res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  }
);

export default router;