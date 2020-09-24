import { Request, Response, Router } from "express";
import { logger } from "../config";
import { validateAndSave } from "../functions";
import Item from "../models/Item";
const router = Router();

router.post("/new", async (req: Request, res: Response) => {
    const { category, name, price, picture } = req.body;

    const item = new Item({
        category,
        name,
        price,
        picture,
        orders: 0
    });

    if (!(await validateAndSave(item, res))) return;
});

export default router;
