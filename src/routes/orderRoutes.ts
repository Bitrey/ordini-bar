import { Request, Response, Router } from "express";
import { logger } from "../config";
import { validateAndSave } from "../functions";
import User from "../models/User";
const router = Router();

router.post("/new", async (req: Request, res: Response) => {
    const { customer, items, organization } = req.body;

    const user = new User({ customer, items, organization });

    await validateAndSave(user, res);
});

export default router;
