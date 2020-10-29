import mongoose from "mongoose";
import { logger } from "./logger";

logger.debug("Database config file loaded");

const { MONGOOSE_URI } = process.env;

mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);

mongoose.connect(<string>MONGOOSE_URI, err =>
    err ? logger.error(err) : logger.info("Connected to MongoDB")
);
