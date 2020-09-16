import { Request, Response, Router } from "express";
import { logger } from "../config";
import { validateAndSave } from "../functions";
import User from "../models/User";
const router = Router();

router.post("/new", async (req: Request, res: Response) => {
    const { name, picture, organization } = req.body;

    const category = new User({
        name,
        picture,
        items: [],
        highlighted: [],
        organization
    });

    await validateAndSave(category, res);
});

export default router;
