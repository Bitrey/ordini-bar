import { mongoose } from "@typegoose/typegoose";
import { Response } from "express";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR, OK } from "http-status";
// import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "http-status";
import { Document } from "mongoose";
import { getMissingPaths } from ".";
import { logger } from "../config";
import { formatMongooseError } from ".";
import { saveDoc } from "./saveDoc";
import { validateDoc } from "./validateDoc";

const runFunctions = (
    document: Document
    // res: Response
): Promise<Document> => {
    return new Promise(async (resolve, reject) => {
        // Validation failed
        try {
            await validateDoc(document);
        } catch (err) {
            // res.sendStatus(BAD_REQUEST);
            return reject(err);
        }

        // Save document
        try {
            await saveDoc(document);
        } catch (err) {
            // res.sendStatus(INTERNAL_SERVER_ERROR);
            reject(err);
        }

        // All ok
        return resolve();
    });
};

export const validateAndSave = (document: Document, res: Response) => {
    return new Promise(async (resolve, reject) => {
        try {
            await runFunctions(document);
            res.sendStatus(OK);
        } catch (err) {
            if (err instanceof mongoose.Error.ValidationError) {
                // Missing fields - inform client
                res.status(BAD_REQUEST).send(formatMongooseError(err));
            } else {
                // Internal server error
                res.sendStatus(INTERNAL_SERVER_ERROR);
                logger.error(err);
            }
        } finally {
            resolve();
        }
    });
};
