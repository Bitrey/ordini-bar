import {
    prop,
    getModelForClass,
    Ref,
    modelOptions
} from "@typegoose/typegoose";
import * as mongoose from "mongoose";
import { BarClass } from "./Bar";
import { OrderClass } from "./Order";
import { UserClass } from "./User";

@modelOptions({
    schemaOptions: { timestamps: true, collection: "Organization" }
})
export class OrganizationClass {
    @prop({ required: true, minlength: 5, maxlength: 20 })
    public name!: string;

    @prop()
    public picture?: string;

    @prop({ ref: "Bar", default: [] })
    public bars!: Ref<BarClass>[];

    @prop({ ref: "User", default: [] })
    public users!: Ref<UserClass>[];

    @prop({ ref: "Order", default: [] })
    public orders!: Ref<OrderClass>[];
}

const Organization = getModelForClass(OrganizationClass);

export default Organization;
