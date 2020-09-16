import { Request, Response, Router } from "express";
import { logger } from "../config";
import { validateAndSave } from "../functions";
import User from "../models/User";
const router = Router();

router.post("/new", async (req: Request, res: Response) => {
    const { firstName, lastName, googleData, picture } = req.body;

    const user = new User({
        firstName,
        lastName,
        googleData,
        picture,
        orders: [],
        favourites: []
    });

    await validateAndSave(user, res);
});

export default router;
