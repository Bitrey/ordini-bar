import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";
import * as mongoose from "mongoose";

@modelOptions({
    schemaOptions: { timestamps: true, collection: "OpeningTime" }
})
export class OpeningTimeClass {
    @prop({ required: true })
    public fromDate!: Date;

    @prop({ required: true })
    public toDate!: Date;

    @prop({ required: true })
    public fromHour!: string;

    @prop({ required: true })
    public toHour!: string;
}
const OpeningTime = getModelForClass(OpeningTimeClass);

export default OpeningTime;
