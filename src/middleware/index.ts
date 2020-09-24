import { DocumentType } from "@typegoose/typegoose";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Document } from "mongoose";
import { logger } from "../config";
import User, { UserClass } from "../models/User";

const getUserFromToken = (
    userToken: string
): DocumentType<UserClass> | false => {
    try {
        const user: DocumentType<UserClass> = <any>(
            jwt.verify(userToken, <string>process.env.JWT_TOKEN)
        );
        return user;
    } catch (err) {
        return false;
    }
};

const findUserById = (
    userFromToken: DocumentType<UserClass>
): Promise<DocumentType<UserClass> | {}> => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await User.findOne({ _id: userFromToken._id }).exec();
            resolve(user || {});
        } catch (err) {
            logger.error(err);
            resolve({});
        }
    });
};

export const populateUser = async (
    req: any,
    res: Response,
    next: NextFunction
) => {
    const userCookie = req.signedCookies.user;
    let newReqUser = {};
    if (userCookie) {
        const userFromToken = getUserFromToken(userCookie);
        // Invalid user token
        if (!userFromToken) {
            res.clearCookie("user");
            newReqUser = {};
        } else {
            newReqUser = await findUserById(userFromToken);
        }
        // If user was found
        if (newReqUser instanceof Document) {
            const newSignedCookie = jwt.sign(
                newReqUser,
                <string>process.env.COOKIE_SECRET
            );
            if (newSignedCookie !== userCookie) {
                res.cookie("user", newSignedCookie, { signed: true });
            }
        }
    }
    req.user = newReqUser || {};
    next();
};
