import {
    prop,
    getModelForClass,
    Ref,
    modelOptions
} from "@typegoose/typegoose";
import * as mongoose from "mongoose";
import { ItemClass } from "./Item";
import { UserClass } from "./User";

@modelOptions({ schemaOptions: { timestamps: true, collection: "Order" } })
class PurchasedItems {
    @prop({ ref: "Item", required: true })
    public item!: Ref<ItemClass>;

    @prop({ required: true })
    public quantity!: number;

    @prop({ required: true })
    public amount!: number;
}

export class OrderClass {
    @prop({ ref: "User", required: true })
    public customer!: Ref<UserClass>;

    @prop({ required: true })
    public items!: PurchasedItems[];

    @prop({ required: true })
    public isPaid!: boolean;

    // @prop({ ref: "Organization", default: [] })
    // public organization!: Ref<OrganizationClass>[];
}

const Order = getModelForClass(OrderClass);

export default Order;
