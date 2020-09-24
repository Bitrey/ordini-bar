import { Request, Response } from "express";
import { INTERNAL_SERVER_ERROR } from "http-status";
import { Document } from "mongoose";
import { logger } from "../../config";

export const findAllAndSend = (
    Model: any,
    req: Request,
    res: Response
): Promise<Document[]> => {
    return new Promise(async (resolve, reject) => {
        try {
            const documents: Document[] = await Model.find(req.params).exec();
            res.json(documents);
            return resolve(documents);
        } catch (err) {
            res.sendStatus(INTERNAL_SERVER_ERROR);
            reject(err);
        }
    });
};
