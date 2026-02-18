import Router, { Request, Response } from 'express'
import { createUser, deleteUser } from '../controllers/auth.controllers';

const router = Router();

router.get("/healthZ", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Api Working fine :)"
  })
})

router.post("/auth/user", createUser);
router.delete("/auth/user", deleteUser);

export default router;