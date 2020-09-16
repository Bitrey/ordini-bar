import {
    prop,
    getModelForClass,
    Ref,
    modelOptions
} from "@typegoose/typegoose";
import * as mongoose from "mongoose";
import { ItemClass } from "./Item";
import { BarClass } from "./Bar";
import { OrganizationClass } from "./Organization";

@modelOptions({ schemaOptions: { timestamps: true, collection: "Category" } })
export class CategoryClass {
    @prop({ required: true, minlength: 5, maxlength: 20 })
    public name!: string;

    @prop()
    public picture?: string;

    @prop({ ref: "Item", default: [] })
    public items!: Ref<ItemClass>[];

    @prop({ ref: "Item", default: [] })
    public highlighted!: Ref<ItemClass>[];

    @prop({ ref: "Bar", required: true })
    public bar!: Ref<BarClass>;

    @prop({ ref: "Organization", required: true })
    public organization!: Ref<OrganizationClass>;
}

const Category = getModelForClass(CategoryClass);

export default Category;
