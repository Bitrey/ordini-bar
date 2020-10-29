import { DocumentType } from "@typegoose/typegoose";
import { Request, Response } from "express";
import { UNAUTHORIZED } from "http-status";
import { Document } from "mongoose";
import { RequestWithUser } from "../../interfaces";
import { UserClass } from "../../models/User";

interface ReqWithUser extends Request {
    user: DocumentType<UserClass>;
}

export const checkReqUser = (
    reqWithoutUser: Request
): DocumentType<UserClass> | false => {
    const req: ReqWithUser = <any>reqWithoutUser;
    if (Object.keys(req.user).length === 0 || !(req.user instanceof Document)) {
        return false;
    } else return req.user;
};

export const checkReqUserAndSendRes = (
    reqWithoutUser: Request,
    res: Response
): DocumentType<UserClass> | false => {
    const req: RequestWithUser = <any>reqWithoutUser;
    if (!req.user || Object.keys(req.user).length === 0) {
        res.status(UNAUTHORIZED).send(
            "No user object inside request. Are you authenticated?"
        );
        return false;
    } else if (!(req.user instanceof Document)) {
        res.status(UNAUTHORIZED).send("User object is not a document");
        return false;
    } else {
        return req.user;
    }
};
