import {
    prop,
    getModelForClass,
    Ref,
    modelOptions
} from "@typegoose/typegoose";
import * as mongoose from "mongoose";
import { ItemClass } from "./Item";
import { OrderClass } from "./Order";
import { OrganizationClass } from "./Organization";

class GoogleData {
    @prop({ required: true })
    public id!: string;

    @prop({ required: true })
    public email!: string;

    @prop({ required: true, type: mongoose.Schema.Types.ObjectId })
    public profile!: object;
}

@modelOptions({ schemaOptions: { timestamps: true, collection: "User" } })
export class UserClass {
    @prop({ required: true })
    public firstName!: string;

    @prop({ required: true })
    public lastName!: string;

    @prop({ required: true })
    public googleData!: GoogleData;

    @prop()
    public picture?: string;

    @prop({ ref: "Order", default: [] })
    public orders!: Ref<OrderClass>[];

    @prop({ ref: "Item", default: [] })
    public favourites!: Ref<ItemClass>[];

    @prop({ ref: "Organization", default: [] })
    public organizations!: Ref<OrganizationClass>[];
}

const User = getModelForClass(UserClass);

export default User;
