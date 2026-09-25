import { Router, Request, Response } from "express";
import chatService from "./chat.service";
import { Types } from "mongoose";
import { isAuthenticated } from "../../Middlewares";

const router: Router = Router();


router.get('/group/:groupId', isAuthenticated, async (req: Request, res: Response): Promise<any> => {
    try {
        const result = await chatService.getGroupChat(
            new Types.ObjectId(req.params.groupId as string),
            new Types.ObjectId((req as any).user.sub)
        );
        res.set('Cache-Control', 'no-store');
        return res.status(200).json({ message: "Success", data: result });
    } catch (e) {
        return res.status(400).json({ message: (e as Error).message });
    }
});

router.get('/:userId', isAuthenticated, async (req: Request, res: Response): Promise<any> => {
    try {
        if(req.params.userId === 'group') return res.status(400).json({message: "Invalid user id"});

        const result = await chatService.getChat(
            new Types.ObjectId(req.params.userId as string),
            new Types.ObjectId((req as any).user.sub)
        );
        res.set('Cache-Control', 'no-store');
        return res.status(200).json({ message: "Success", data: result });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ message: "Server Error" });
    }
});

// === ده اللي اتصلح ===
router.delete("/:userId", isAuthenticated, async (req: Request, res: Response): Promise<any> => {
  try {
    const myId = new Types.ObjectId((req as any).user.sub);
    const otherId = new Types.ObjectId(req.params.userId as string);
    
    const result = await chatService.deleteChat(myId, otherId);
    return res.status(200).json(result);
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "delete failed", error: (e as Error).message });
  }
});

router.patch("/clear/:chatId", isAuthenticated, async (req: Request, res: Response): Promise<any> => {
  try {
    const myId = new Types.ObjectId((req as any).user.sub);
    const chatId = new Types.ObjectId(req.params.chatId as string);
    const result = await chatService.clearChatForMe(myId, chatId);
    return res.status(200).json(result);
  } catch (e) {
    return res.status(500).json({ message: "delete faild" });
  }
});

export default router;