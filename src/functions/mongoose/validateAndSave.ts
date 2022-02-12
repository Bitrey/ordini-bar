import { mongoose } from "@typegoose/typegoose";
import { Response } from "express";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR, OK } from "http-status";
// import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "http-status";
import { Document } from "mongoose";
import { getMissingPaths } from "..";
import { logger } from "../../config";
import { formatMongooseError } from "..";
import { saveDoc } from "./saveDoc";
import { validateDoc } from "./validateDoc";
import { AppError } from "../../classes/AppError";

const runFunctions = (
    document: Document
    // res: Response
): Promise<Document> => {
    return new Promise(async (resolve, reject) => {
        // Validation failed
        try {
            await validateDoc(document);
            logger.debug("validateDoc succeeded");
        } catch (err) {
            logger.debug("validateDoc failed");
            return reject(err);
        }

        // Save document
        try {
            await saveDoc(document);
            logger.debug("saveDoc succeeded");
        } catch (err) {
            logger.debug("saveDoc failed");
            reject(err);
        }

        // All ok
        return resolve(document);
    });
};

export const validateAndSave = (
    document: Document,
    res: Response,
    dontSendSuccessRes?: boolean
): Promise<boolean> => {
    return new Promise(async (resolve, reject) => {
        try {
            await runFunctions(document);
            logger.debug("Validate and save both successful");
            if (!dontSendSuccessRes) res.sendStatus(OK);
            return resolve(true);
        } catch (err) {
            if (err instanceof mongoose.Error.ValidationError) {
                // Missing fields - inform client
                res.status(BAD_REQUEST).send(formatMongooseError(err));
                return resolve(false);
            } else if (err instanceof AppError && err.isOperational) {
                logger.debug(err);
                res.status(BAD_REQUEST).send(err.message);
                return resolve(false);
            } else {
                // Internal server error
                logger.debug("500 in Validate and save");
                logger.error(err);
                res.sendStatus(INTERNAL_SERVER_ERROR);
                return resolve(false);
            }
        }
    });
};
