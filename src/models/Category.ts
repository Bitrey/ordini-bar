import {
    prop,
    getModelForClass,
    Ref,
    modelOptions
} from "@typegoose/typegoose";
import * as mongoose from "mongoose";
import { ItemClass } from "./Item";

@modelOptions({ schemaOptions: { timestamps: true, collection: "Category" } })
export class CategoryClass {
    @prop({ required: true })
    public name!: string;

    @prop()
    public picture?: string;

    @prop({ ref: "Item", default: [] })
    public items!: Ref<ItemClass>[];

    @prop({ ref: "Item", default: [] })
    public favourites!: Ref<ItemClass>[];

    // @prop({ ref: "Organization", default: [] })
    // public organization!: Ref<OrganizationClass>[];
}

const Category = getModelForClass(CategoryClass);

export default Category;
