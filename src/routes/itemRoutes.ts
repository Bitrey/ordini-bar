import { Request, Response, Router } from "express";
import { logger } from "../config";
import { checkError } from "../functions";
import Item from "../models/Item";
const router = Router();

router.get("/new", async (req: Request, res: Response) => {
    const { category, name, price, picture } = req.body;

    const item = new Item({
        category,
        name,
        price,
        picture,
        orders: 0
    });

    try {
        await item.validate();
    } catch (err) {
        return logger.error(err);
    }

    await item.save(checkError);
});

export default router;
