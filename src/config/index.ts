import path from "path";
// import { logger } from "./logger";

// Options
export const options = {
    envFile: path.join(__dirname, "..", "env", ".env"),

    combinedLogsFile: path.join(process.cwd(), "logs", "combined.log"),
    errorsLogsFile: path.join(process.cwd(), "logs", "errors.log"),

    uploadsPath: path.join(process.cwd(), "uploads")
};

// Logger
export { logger } from "./logger";

// Env
import "./dotenv";
import "./checkEnv";

// Database
import "./database";

// Express
import "..";

// Swagger
import "./swagger";

// logger.debug("Config file loaded");
