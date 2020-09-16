import { mongoose } from "@typegoose/typegoose";
import { Request, Response, Router } from "express";
import { logger } from "../config";
import { validateAndSave } from "../functions";
import Organization from "../models/Organization";
const router = Router();

router.post("/new", async (req: Request, res: Response) => {
    const { name, picture } = req.body;

    const organization = new Organization({
        name,
        picture,
        users: [],
        orders: []
    });

    await validateAndSave(organization, res);
});

export default router;
