import { Request, Response, Router } from "express";
const router = Router();

router.all("*", async (req: Request, res: Response) => res.sendStatus(404));

export default router;
