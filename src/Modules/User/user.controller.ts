import { Router,Request,Response } from "express";
import { Types } from "mongoose";

import userService from "./user.service";
import { multerUploadFile } from "../../common";
import { isAuthenticated } from "../../Middlewares";

import { upload } from "../../Middlewares/multer";
import { User} from "../../DB/Models/user/user.model"; // اسم المودل عندك



const router = Router();

router.post("/upload-avatar", isAuthenticated, upload.single("avatar"), async (req: Request, res: Response) => {
  const userId = (req as any).user.sub;
  const fileName = (req as any).file.filename;

  await User.findByIdAndUpdate(userId, { profilePicture: fileName });

  return res.json({ message: "Uploaded", data: { profilePicture: fileName } });
});


// Upload profile picture
router.post(
  "/profile-pic",
  isAuthenticated,
  multerUploadFile().single("profile-pic"),
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Profile picture is required",
        });
      }

      const userId = new Types.ObjectId(req.user.sub);

      const data = await userService.uploadProfilePic(
        req.file,
        userId
      );

      return res.status(200).json({
        success: true,
        message: "Profile picture uploaded successfully",
        data,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Get my profile
router.get("/", isAuthenticated, async (req, res, next) => {
  try {
    const userId = new Types.ObjectId(req.user.sub);

    const { user, friends } = await userService.profile(userId);

    return res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
      data: {
        user,
        friends,
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;