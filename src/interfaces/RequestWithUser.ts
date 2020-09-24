import { DocumentType } from "@typegoose/typegoose";
import { Request } from "express";
import { UserClass } from "../models/User";

export interface RequestWithUser extends Request {
    user: DocumentType<UserClass> | {};
}
