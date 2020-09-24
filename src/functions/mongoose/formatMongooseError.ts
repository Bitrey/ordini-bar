import { mongoose } from "@typegoose/typegoose";

export const formatMongooseError = (
    err: mongoose.Error.ValidationError
): string => {
    const messages = [];
    for (const path in err.errors) {
        messages.push(err.errors[path].message);
    }
    const formattedMessages = messages.join(" ");
    return formattedMessages;
};
