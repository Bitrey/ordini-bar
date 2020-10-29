import { DocumentType } from "@typegoose/typegoose";
import { Response } from "express";
import {
    BAD_REQUEST,
    FORBIDDEN,
    INTERNAL_SERVER_ERROR,
    UNAUTHORIZED
} from "http-status";
import { logger } from "../../config";
import Organization, {
    JOIN_CODE_LENGTH,
    OrganizationClass
} from "../../models/Organization";
import { UserClass } from "../../models/User";

export const isJoinCodeValid = (
    codeToTest: any,
    user: DocumentType<UserClass>,
    res: Response
): Promise<DocumentType<OrganizationClass> | false> => {
    return new Promise(async (resolve, reject) => {
        if (typeof codeToTest !== "string") {
            res.status(BAD_REQUEST).send(
                "Missing join code or organization id param"
            );
            return resolve(false);
        }

        const joinCode = codeToTest.replace(/[\W_]+/g, "").toUpperCase();
        if (joinCode.length !== JOIN_CODE_LENGTH) {
            res.status(BAD_REQUEST).send("Invalid join code");
            return resolve(false);
        }

        let foundOrganization: DocumentType<OrganizationClass> | null;
        try {
            foundOrganization = await Organization.findOne({ joinCode }).exec();
        } catch (err) {
            logger.error(err);
            res.sendStatus(INTERNAL_SERVER_ERROR);
            return resolve(false);
        }
        if (!foundOrganization) {
            res.status(BAD_REQUEST).send(
                "Organization with given join code doesn't exist"
            );
            return resolve(false);
        } else if (!foundOrganization.acceptExternalUsers) {
            logger.debug("Organization doesn't accept external users");
            res.status(UNAUTHORIZED).send(
                "Organization doesn't accept external users"
            );
            return resolve(false);
        } else if (joinCode !== foundOrganization.joinCode) {
            // This shouldn't happen because the organization is searched by join code
            // But you never know
            logger.error(
                "Organization queried with a joinCode actually has a different one!"
            );
            res.status(UNAUTHORIZED).send(
                "Your join code does not match the organization's one"
            );
            return resolve(false);
        }

        // If user is already in organization
        // Check from organization
        for (const userInsideOrganization of foundOrganization.users) {
            if ((<any>userInsideOrganization).equals(user._id)) {
                res.status(FORBIDDEN).send(
                    "You're already into that organization"
                );
                return resolve(false);
            }
        }
        // Check from user
        for (const organizationOfUser of user.organizations) {
            if ((<any>organizationOfUser).equals(foundOrganization._id)) {
                res.status(FORBIDDEN).send(
                    "You're already into that organization"
                );
                return resolve(false);
            }
        }

        return resolve(foundOrganization);
    });
};
