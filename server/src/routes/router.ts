import Router, { Request, Response } from 'express'

const router = Router();

router.get("/healthZ", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Api Working fine :)"
  })
})

export default router;