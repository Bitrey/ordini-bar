import { Request, Response, Router } from "express";
import { logger } from "../config";
import { validateAndSave } from "../functions";
import User from "../models/User";
const router = Router();

/**
 * @swagger
 * /customers:
 *  get:
 *    description: Use to request all customers
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.post("/new", async (req: Request, res: Response) => {
    const { customer, items, organization } = req.body;

    const user = new User({ customer, items, organization });

    if (!(await validateAndSave(user, res))) return;
});

export default router;
