import { Request, Response, Router } from "express";
import { BAD_REQUEST } from "http-status";
import { logger } from "../config";
import {
    checkEmailAndPassword,
    generatePassword,
    isOrganizationAdmin,
    validateAndSave
} from "../functions";
import User from "../models/User";
const router = Router();

/**
 * Create a new user, either external or internal to an organization
 * @route POST /user/new
 * @group user - Operations about user
 * @param {string} authMethod.query.required - User auth method. Currently only supports "local"
 * @param {string} email.body.required - Email of the user. Required if authMethod is "local"
 * @param {string} password.body.required - Password of the user. Required if authMethod is "local"
 * @param {string} firstName.body.required - Email of the user. Required if authMethod is "local"
 * @param {string} lastName.body.required - Email of the user. Required if authMethod is "local"
 * @param {string} organization.body - If specified and authMethod is "local", user will be created as an internal user to the organization with the ObjectId specified here.
 * @returns {"ok"} 200 - User successfully created
 * @returns {Error} 400 - Bad input
 * @returns {Error} 500 - Internal Server Error
 */
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
            isTempPassword: false,
            password: generatePassword(password)
        };

        // Create new user inside organization or external registration
        const { organization } = req.body;

        if (typeof organization === "string") {
            // Inside organization: check that it exists and accepts external users
            if (!(await isOrganizationAdmin(organization, user, res))) return;

            user.localAuth.isTempPassword = true;
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
