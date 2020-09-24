import {
    prop,
    getModelForClass,
    Ref,
    modelOptions,
    pre
} from "@typegoose/typegoose";
import * as mongoose from "mongoose";
import { ItemClass } from "./Item";
import { OrderClass } from "./Order";
import { OrganizationClass } from "./Organization";

import { Severity } from "@typegoose/typegoose";

import * as EmailValidator from "email-validator";
import { AppError } from "../classes/AppError";
import { BAD_REQUEST } from "http-status";
import { InviteClass } from "./Invite";

// Password hasing
// import bcrypt from "bcryptjs";

class LocalAuth {
    @prop({ required: true })
    public password!: string;

    @prop({ required: true })
    public isTempPassword!: boolean;

    // No need to store salt
    // @prop({ required: true })
    // public salt!: string;
}

@modelOptions({ options: { allowMixed: Severity.ALLOW } })
class GoogleAuth {
    @prop({ required: true })
    public id!: string;

    @prop({ required: true })
    public email!: string;

    @prop({ required: true, type: mongoose.Schema.Types.Mixed })
    public profile!: object;
}

@modelOptions({
    schemaOptions: { timestamps: true, collection: "User" },
    options: { allowMixed: Severity.ALLOW }
})
@pre<UserClass>("save", async function (next) {
    if (!this.localAuth && !this.googleAuth) {
        return next(
            new AppError(
                "NO_AUTH_METHOD",
                BAD_REQUEST,
                "No auth method specified",
                true
            )
        );
    }

    if (this.localAuth && !this.googleAuth) {
        const { email } = this;
        if (!EmailValidator.validate(email)) {
            return next(
                new AppError(
                    "INVALID_EMAIL",
                    BAD_REQUEST,
                    "Invalid email",
                    true
                )
            );
        }
    }

    // Is unique
    const { email } = this;
    const users = await User.find({}).exec();
    for (const user of users) {
        if (user.email === email && !(<any>user._id).equals(this._id)) {
            return next(
                new AppError(
                    "EMAIL_IN_USE",
                    BAD_REQUEST,
                    "Email already in use",
                    true
                )
            );
        }
    }

    next();
})
export class UserClass {
    @prop({ required: true })
    public firstName!: string;

    @prop({ required: true })
    public lastName!: string;

    @prop({
        required: true,
        validate: {
            validator: email => EmailValidator.validate(email),
            message: "Invalid email"
        }
    })
    public email!: string;

    // If logged in with email / password

    @prop({ default: null })
    public localAuth?: LocalAuth | null;

    // If Google account connected
    @prop({ default: null })
    public googleAuth?: GoogleAuth | null;

    @prop({ default: null })
    public profilePicture?: string | null;

    @prop({ ref: "Order", default: [] })
    public orders!: Ref<OrderClass>[];

    @prop({ ref: "Item", default: [] })
    public favourites!: Ref<ItemClass>[];

    @prop({ ref: "Invite", default: [] })
    public receivedInvites!: Ref<InviteClass>[];

    @prop({ ref: "Organization", default: [] })
    public organizations!: Ref<OrganizationClass>[];
}

const User = getModelForClass(UserClass);

export default User;
