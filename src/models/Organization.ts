import {
    prop,
    getModelForClass,
    Ref,
    modelOptions,
    DocumentType
} from "@typegoose/typegoose";
import * as mongoose from "mongoose";
import { BarClass } from "./Bar";
import { OrderClass } from "./Order";
import { UserClass } from "./User";

import randomstring from "randomstring";
import { InviteClass } from "./Invite";

export const JOIN_CODE_LENGTH = 8;

@modelOptions({
    schemaOptions: { timestamps: true, collection: "Organization" }
})
export class OrganizationClass {
    @prop({ required: true, minlength: 5, maxlength: 20 })
    public name!: string;

    @prop()
    public picture?: string;

    @prop({ required: true, default: true })
    public acceptExternalUsers!: boolean;

    @prop()
    public joinCode?: string;

    @prop({ ref: "Invite", default: [] })
    public sentInvites!: Ref<InviteClass>[];

    @prop({ ref: "Bar", default: [] })
    public bars!: Ref<BarClass>[];

    @prop({ ref: "User", default: [] })
    public users!: Ref<UserClass>[];

    @prop({ ref: "User", default: [] })
    public admins!: Ref<UserClass>[];

    @prop({ ref: "Order", default: [] })
    public orders!: Ref<OrderClass>[];

    public async generateJoinCodeAndSave(
        this: DocumentType<OrganizationClass>
    ) {
        this.joinCode = randomstring.generate({
            readable: true,
            capitalization: "uppercase",
            length: JOIN_CODE_LENGTH,
            charset: "alphanumeric"
        });
        return await this.save();
    }
}

const Organization = getModelForClass(OrganizationClass);

export default Organization;
