import { Response } from "express";
import { BAD_REQUEST } from "http-status";
import { Document } from "mongoose";
import { logger } from "../config";

export const validateDoc = (document: Document): Promise<Document> => {
    return new Promise(async (resolve, reject) => {
        try {
            await document.validate();
            return resolve(document);
        } catch (err) {
            logger.debug("Document validation failed");
            return reject(err);
        }
    });
};
