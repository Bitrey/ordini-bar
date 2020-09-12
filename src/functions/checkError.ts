import { logger } from "../config";

export const checkError = (err: any) => {
    if (err) {
        logger.error(err);
    }
};
