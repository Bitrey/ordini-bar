import { Response } from "express";
import { BAD_REQUEST } from "http-status";
import { logger } from "../../config";

export const checkEmailAndPassword = (
    email: string,
    password: string,
    res: Response
): boolean => {
    if (!email || !password) {
        logger.debug("Missing email and/or password");
        res.status(BAD_REQUEST).send(
            "Please provide a valid email and password"
        );
        return false;
    } else if (password.length < 6 || password.length > 32) {
        logger.debug("Invalid password length");
        res.status(BAD_REQUEST).send("Password must be 6-32 characters long");
        return false;
    }
    return true;
};
