import { Request, Response, Router } from "express";
import { BAD_REQUEST } from "http-status";
import { logger } from "../config";
import {
    checkEmailAndPassword,
    generatePassword,
    userCanJoinOrganization,
    validateAndSave
} from "../functions";
import User from "../models/User";
const router = Router();

router.post("/new", async (req: Request, res: Response) => {
    const { authMethod } = req.query;
    if (typeof authMethod !== "string") {
        logger.debug("No authMethod query param provided");
        return res
            .status(BAD_REQUEST)
            .send("Please provide a valid authMethod query param");
    } else if (authMethod === "local") {
        // Extract input from body and validate it
        const { email, password, firstName, lastName } = req.body;
        if (!checkEmailAndPassword(email, password, res)) return;

        // Create user
        const user = new User({ firstName, lastName, email });

        user.localAuth = {
            isTempPassword: true,
            password: generatePassword(password)
        };

        // Create new user inside organization or external registration
        const { organization } = req.query;

        if (typeof organization === "string") {
            // Inside organization: check that it exists and accepts external users
            if (!(await userCanJoinOrganization(organization, res))) return;

            // We already checked that organization is a valid ObjectId
            user.organizations = [<any>organization];
        } else {
            user.organizations = [];
        }

        logger.debug(user);

        // Run validators and save
        if (!(await validateAndSave(user, res))) return;
    } else {
        return res.sendStatus(BAD_REQUEST);
    }
});

export default router;
