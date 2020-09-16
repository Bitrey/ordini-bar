import {
    prop,
    getModelForClass,
    Ref,
    modelOptions
} from "@typegoose/typegoose";
import * as mongoose from "mongoose";
import { CategoryClass } from "./Category";
import { BarClass } from "./Bar";
import { OrderClass } from "./Order";
import { OrganizationClass } from "./Organization";

@modelOptions({ schemaOptions: { timestamps: true, collection: "Item" } })
export class ItemClass {
    @prop({ ref: "Category", required: true })
    public category?: Ref<CategoryClass> | null;

    @prop({ required: true, minlength: 5, maxlength: 20 })
    public name!: string;

    @prop({ required: true, min: 10, max: 100000 })
    public price!: number;

    @prop()
    public picture?: string;

    @prop({ ref: "Order", default: [] })
    public orders!: Ref<OrderClass>[];

    @prop({ ref: "Organization", required: true })
    public organization!: Ref<OrganizationClass>;

    @prop({ ref: "Bar", required: true })
    public bar!: Ref<BarClass>;
}

const Item = getModelForClass(ItemClass);

export default Item;
