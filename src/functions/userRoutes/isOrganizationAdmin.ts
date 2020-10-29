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
import Organization, { OrganizationClass } from "../../models/Organization";
import { UserClass } from "../../models/User";

export const isOrganizationAdmin = (
    _id: any,
    user: DocumentType<UserClass>,
    res: Response
): Promise<DocumentType<OrganizationClass> | false> => {
    return new Promise(async (resolve, reject) => {
        if (typeof _id !== "string") {
            res.status(BAD_REQUEST).send("Missing organization id param");
            return resolve(false);
        } else if (!isValidObjectId(_id)) {
            res.status(BAD_REQUEST).send("Invalid organization id");
        }

        let foundOrganization: DocumentType<OrganizationClass> | null;
        try {
            foundOrganization = await Organization.findOne({ _id }).exec();
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
        }

        // If user is already in organization
        // Check from organization
        for (const userInsideOrganization of foundOrganization.admins) {
            if ((<any>userInsideOrganization).equals(user._id)) {
                res.status(FORBIDDEN).send(
                    "You're already into that organization"
                );
                return resolve(false);
            }
        }

        let isAdmin = false;
        // Check if is admin
        for (const admin of foundOrganization.admins) {
            if ((<any>admin).equals(user._id)) {
                isAdmin = true;
                break;
            }
        }

        if (!isAdmin) {
            res.status(UNAUTHORIZED).send("You're not an organization admin");
            return resolve(false);
        }

        return resolve(foundOrganization);
    });
};
