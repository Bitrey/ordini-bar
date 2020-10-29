import { mongoose } from "@typegoose/typegoose";
import { logger } from "../../config";

export const getMissingPaths = (
    err: mongoose.Error.ValidationError
): { missingPaths: string[]; formattedPaths: string } => {
    let missingPaths = [];
    logger.debug(JSON.parse(JSON.stringify(err.errors)));
    for (const path in err.errors) {
        missingPaths.push(path);
    }
    const formattedPaths = "Missing fields: " + missingPaths.join(", ");
    return { missingPaths, formattedPaths };
};
