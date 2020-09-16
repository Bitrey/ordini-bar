import {
    prop,
    getModelForClass,
    Ref,
    modelOptions
} from "@typegoose/typegoose";
import * as mongoose from "mongoose";
import { CategoryClass } from "./Category";
import { OrganizationClass } from "./Organization";

@modelOptions({ schemaOptions: { timestamps: true, collection: "Bar" } })
export class BarClass {
    // Use Organization name, this may be useful in the future
    @prop({ minlength: 5, maxlength: 20 })
    public name?: string;

    @prop({ ref: "Category", required: true, default: [] })
    public categories!: Ref<CategoryClass>[];

    @prop()
    public picture?: string;

    @prop({ ref: "Organization", required: true })
    public organization!: Ref<OrganizationClass>;
}

const Bar = getModelForClass(BarClass);

export default Bar;
