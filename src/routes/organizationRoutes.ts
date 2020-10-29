import { DocumentType } from "@typegoose/typegoose";
import { Request, Response, Router } from "express";
import { BAD_REQUEST, FORBIDDEN, UNAUTHORIZED } from "http-status";
import { isValidObjectId } from "mongoose";
import { logger } from "../config";
import {
    checkReqUserAndSendRes,
    findAllAndSend,
    isJoinCodeValid,
    validateAndSave
} from "../functions";
import Organization, { OrganizationClass } from "../models/Organization";
import { UserClass } from "../models/User";
const router = Router();

/**
 * List all organizations (must be authenticated)
 * @route GET /organization/
 * @group organization - Operations about organization
 * @returns {"ok"} 200 - User successfully created
 * @returns {Error} default - Unexpected Error
 */
router.get("/", async (req: Request, res: Response) => {
    // DEBUG: FIRST CHECK AUTH!
    findAllAndSend(Organization, req, res);
});

/**
 * Join an organization as an external user
 * @route POST /organization/new
 * @group organization - Operations about organization
 * @param {string} name.body.required - Name
 * @param {string} picture.body - Profile picture
 * @param {boolean} acceptExternalUsers.body.required - Accepts users joining by code
 * @returns {"ok"} 200 - User successfully created
 * @returns {Error} default - Unexpected Error
 */
router.post("/new", async (req: Request, res: Response) => {
    const user = checkReqUserAndSendRes(req, res);
    if (!user) return;

    const { name, picture, acceptExternalUsers } = req.body;

    const boolAcceptExternalUsers =
        acceptExternalUsers === "true" ? true : false;

    const organization = new Organization({
        name,
        picture,
        acceptExternalUsers: boolAcceptExternalUsers,
        bars: [],
        sentInvites: [],
        openingTimes: [],
        users: [],
        orders: []
    });

    if (!(await validateAndSave(organization, res))) return;
});

// DEBUG
// Organization.findOne(
//     { _id: "5f6a52013bda3c430832e209" },
//     async (err, found) => {
//         if (found) {
//             found.users = [];
//             await found.save();
//             logger.debug("Debug category saved");
//         }
//     }
// );

/**
 * Join an organization as an external user
 * @route GET /organization/join
 * @group organization - Operations about organization
 * @param {string} code.query.required - Organization join code or organization ObjectId
 * @returns {"ok"} 200 - User successfully created
 * @returns {Error} default - Unexpected Error
 */
router.get("/join", async (req: Request, res: Response) => {
    const user = checkReqUserAndSendRes(<any>req, res);
    if (!user) return;

    const idOrCode = req.query.code;

    // const organization = await canJoinOrganization(idOrCode, user, res);
    const organization = await isJoinCodeValid(idOrCode, user, res);
    // DEBUG: NOW YOU CAN JOIN BY JUST PUTTING THE OBJECTID! THIS SHOULDN'T HAPPEN
    if (!organization) return;

    organization.users.push(user._id);
    const savedOrganization = await validateAndSave(organization, res, true);
    if (!savedOrganization) return;

    const savedUser = await validateAndSave(user, res);
    user.organizations.push(organization._id);
    if (!savedUser) return;
});

export default router;
