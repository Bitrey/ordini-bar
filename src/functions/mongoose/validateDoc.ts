import { mongoose } from "@typegoose/typegoose";
import { Document } from "mongoose";
import { AppError } from "../../classes/AppError";
import { logger } from "../../config";

export const validateDoc = (document: Document): Promise<Document> => {
    return new Promise(async (resolve, reject) => {
        try {
            await document.validate();
            return resolve(document);
        } catch (err) {
            if (err instanceof mongoose.Error.ValidationError) {
                logger.debug(
                    "Document validation failed due to ValidationError " + err
                );
            } else if (err instanceof AppError && !err.isOperational) {
                logger.debug(
                    "Document validation failed due to operational error " + err
                );
            } else {
                // Internal server error
                logger.error(err);
            }
            return reject(err);
        }
    });
};
