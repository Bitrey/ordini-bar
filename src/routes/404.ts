import { Request, Response, Router } from "express";
import { NOT_FOUND } from "http-status";
const router = Router();

router.all("*", async (req: Request, res: Response) =>
    res.sendStatus(NOT_FOUND)
);

export default router;
