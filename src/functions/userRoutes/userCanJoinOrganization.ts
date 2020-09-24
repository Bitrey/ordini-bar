import { DocumentType } from "@typegoose/typegoose";
import { Response } from "express";
import {
    BAD_REQUEST,
    FORBIDDEN,
    INTERNAL_SERVER_ERROR,
    UNAUTHORIZED
} from "http-status";
import { isValidObjectId } from "mongoose";
import { logger } from "../../config";
import Organization, {
    JOIN_CODE_LENGTH,
    OrganizationClass
} from "../../models/Organization";
import { UserClass } from "../../models/User";

export const userCanJoinOrganization = (
    idOrCode: any,
    res: Response,
    user?: DocumentType<UserClass>
): Promise<DocumentType<OrganizationClass> | false> => {
    return new Promise(async (resolve, reject) => {
        if (typeof idOrCode !== "string") {
            res.status(BAD_REQUEST).send(
                "Missing join code or organization id param"
            );
            return resolve(false);
        }
        const query: any = { $or: {} };
        // Check that it's a valid ObjectId
        // if (!isValidObjectId(idOrCode)) {
        //     logger.debug("organization query param has an invalid ObjectId");
        //     return res
        //         .status(BAD_REQUEST)
        //         .send("organization query param has an invalid ObjectId");
        // }
        if (isValidObjectId(idOrCode)) query.$or._id = idOrCode;
        const code = idOrCode.replace(/[\W_]+/g, "").toUpperCase();
        if (code.length === JOIN_CODE_LENGTH) query.$or.joinCode = idOrCode;

        if (Object.keys(query.$or).length === 0) {
            return res
                .status(BAD_REQUEST)
                .send("Invalid code or organization id");
        }

        let foundOrganization: DocumentType<OrganizationClass> | null;
        try {
            foundOrganization = await Organization.findOne(query).exec();
        } catch (err) {
            logger.error(err);
            res.sendStatus(INTERNAL_SERVER_ERROR);
            return resolve(false);
        }
        if (!foundOrganization) {
            res.status(BAD_REQUEST).send(
                "Organization with given ID doesn't exist"
            );
            return resolve(false);
        } else if (!foundOrganization.acceptExternalUsers) {
            logger.debug("Organization doesn't accept external users");
            res.status(UNAUTHORIZED).send(
                "Organization doesn't accept external users"
            );
            return resolve(false);
        }

        if (user) {
            // If user is already in organization
            // Check from organization
            for (const organizationUser of foundOrganization.users) {
                if ((<any>organizationUser).equals(user._id)) {
                    res.status(FORBIDDEN).send(
                        "You're already into that organization"
                    );
                    return resolve(false);
                }
            }
            // Check from user
            for (const userOrganization of user.organizations) {
                if ((<any>userOrganization).equals(foundOrganization._id)) {
                    res.status(FORBIDDEN).send(
                        "You're already into that organization"
                    );
                    return resolve(false);
                }
            }
        } else {
            logger.warn(
                "userCanJoinOrganization called without 'user' argument"
            );
        }

        return resolve(foundOrganization);
    });
};
