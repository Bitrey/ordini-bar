import {
    prop,
    getModelForClass,
    Ref,
    modelOptions
} from "@typegoose/typegoose";
import * as mongoose from "mongoose";
import { UserClass } from "./User";

@modelOptions({
    schemaOptions: { timestamps: true, collection: "Organization" }
})
export class OrganizationClass {
    @prop({ required: true })
    public name!: string;

    @prop()
    public picture?: string;

    @prop({ ref: "User", default: [] })
    public users!: Ref<UserClass>[];
}

const Organization = getModelForClass(OrganizationClass);

export default Organization;
