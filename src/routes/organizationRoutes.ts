import { DocumentType, mongoose } from "@typegoose/typegoose";
import { Request, Response, Router } from "express";
import {
    BAD_REQUEST,
    FORBIDDEN,
    INTERNAL_SERVER_ERROR,
    UNAUTHORIZED
} from "http-status";
import { Document, isValidObjectId } from "mongoose";
import { type } from "os";
import { logger } from "../config";
import {
    findAllAndSend,
    userCanJoinOrganization,
    validateAndSave
} from "../functions";
import { RequestWithUser } from "../interfaces";
import Organization, { OrganizationClass } from "../models/Organization";
import User, { UserClass } from "../models/User";
const router = Router();

router.get("/", async (req: Request, res: Response) => {
    // DEBUG: FIRST CHECK AUTH!
    findAllAndSend(Organization, req, res);
});

router.post("/new", async (req: Request, res: Response) => {
    const { name, picture, acceptExternalUsers, canJoinFromCode } = req.body;

    const boolAcceptExternalUsers =
        acceptExternalUsers === "true" ? true : false;

    const boolcanJoinFromCode = canJoinFromCode === "true" ? true : false;

    const organization = new Organization({
        name,
        picture,
        acceptExternalUsers: boolAcceptExternalUsers,
        canJoinFromCode: boolcanJoinFromCode,
        bars: [],
        sentInvites: [],
        openingTimes: [],
        users: [],
        orders: []
    });

    if (!(await validateAndSave(organization, res))) return;
});

const canJoinOrganization = (
    _id: any,
    reqUser: DocumentType<UserClass>,
    res: Response
): Promise<DocumentType<OrganizationClass> | false> => {
    return new Promise(async (resolve, reject) => {
        try {
            if (typeof _id !== "string" || !isValidObjectId(_id)) {
                res.status(BAD_REQUEST).send(
                    "Please provide an organization param with a valid ObjectId"
                );
                return resolve(false);
            }
            const organization = await Organization.findOne({ _id }).exec();
            if (!organization) {
                res.status(BAD_REQUEST).send(
                    "No organization exists with given ID"
                );
                return resolve(false);
            } else if (!organization.canJoinFromCode) {
                res.status(UNAUTHORIZED).send(
                    "That organization doesn't accept external users"
                );
                return resolve(false);
            }
            // If user is already in organization
            // Check from organization
            for (const user of organization.users) {
                if ((<any>user).equals(reqUser._id)) {
                    res.status(FORBIDDEN).send(
                        "You're already into that organization"
                    );
                    return resolve(false);
                }
            }
            // Check from user
            for (const userOrganization of reqUser.organizations) {
                if ((<any>userOrganization).equals(organization._id)) {
                    res.status(FORBIDDEN).send(
                        "You're already into that organization"
                    );
                    return resolve(false);
                }
            }

            resolve(organization);
        } catch (err) {
            logger.error(err);
            reject(err);
        }
    });
};

const hasReqUser = (
    req: RequestWithUser,
    res: Response
): DocumentType<UserClass> | false => {
    if (!req.user) {
        res.status(UNAUTHORIZED).send("No user object inside request");
        return false;
    } else if (!(req.user instanceof Document)) {
        res.status(UNAUTHORIZED).send("User object is not a document");
        return false;
    } else {
        return req.user;
    }
};

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
 * @swagger
 * /organization/join:
 * get:
 *  description: Join an organization as an external user
 *  parameters:
 *    - name: code
 *      description: Organization join code or organization ObjectId
 *      required: true
 *      type: string
 *  responses:
 *    200:
 *      description: User successfully joined
 */
router.get("/join", async (req: Request, res: Response) => {
    // DEBUG
    // (<any>req).user = await User.findOne({
    //     _id: "5f6a67aead7fc07b947e37af"
    // }).exec();
    // console.log((<any>req).user);

    const user = hasReqUser(<any>req, res);
    if (!user) return;

    const idOrCode = req.query.code;

    // const organization = await canJoinOrganization(idOrCode, user, res);
    const organization = await userCanJoinOrganization(idOrCode, res, user);
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
