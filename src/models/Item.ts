import {
    prop,
    getModelForClass,
    Ref,
    modelOptions
} from "@typegoose/typegoose";
import * as mongoose from "mongoose";
import { CategoryClass } from "./Category";

@modelOptions({ schemaOptions: { timestamps: true, collection: "Item" } })
export class ItemClass {
    @prop({ ref: "Category", required: true })
    public category?: Ref<CategoryClass> | null;

    @prop({ required: true })
    public name!: string;

    @prop({ required: true })
    public price!: number;

    @prop()
    public picture?: string;

    @prop({ default: 0 })
    public orders!: number;

    // @prop({ ref: "Organization", default: [] })
    // public organization!: Ref<OrganizationClass>[];
}

const Item = getModelForClass(ItemClass);

export default Item;
