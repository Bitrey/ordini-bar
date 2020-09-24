import { Document } from "mongoose";
import { logger } from "../../config";

export const saveDoc = (document: Document): Promise<Document> => {
    return new Promise(async (resolve, reject) => {
        try {
            await document.save();
            return resolve(document);
        } catch (err) {
            // logger.error("Document save failed");
            return reject(err);
        }
    });
};
