import { mongoose } from "@typegoose/typegoose";

export const getMissingPaths = (
    err: mongoose.Error.ValidationError
): { missingPaths: string[]; formattedPaths: string } => {
    let missingPaths = [];
    console.log(JSON.parse(JSON.stringify(err.errors)));
    for (const path in err.errors) {
        missingPaths.push(path);
    }
    const formattedPaths = "Missing fields: " + missingPaths.join(", ");
    return { missingPaths, formattedPaths };
};
