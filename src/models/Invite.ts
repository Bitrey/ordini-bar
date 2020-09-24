import {
    prop,
    getModelForClass,
    Ref,
    modelOptions
} from "@typegoose/typegoose";
import * as mongoose from "mongoose";
import { OrganizationClass } from "./Organization";
import { UserClass } from "./User";

@modelOptions({ schemaOptions: { timestamps: true, collection: "Invite" } })
export class InviteClass {
    @prop({ ref: "Organization", default: [] })
    public organization!: Ref<OrganizationClass>[];

    @prop({ ref: "User", default: [] })
    public recipient!: Ref<UserClass>[];
}

const Invite = getModelForClass(InviteClass);

export default Invite;
