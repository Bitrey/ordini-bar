import path from "path";

// Options
export const options = {
    envFile: path.join(__dirname, "..", "env", ".env"),

    combinedLogsFile: path.join(process.cwd(), "logs", "combined.log"),
    errorsLogsFile: path.join(process.cwd(), "logs", "errors.log"),

    uploadsPath: path.join(process.cwd(), "uploads")
};

// Env
import "./dotenv";
import "./checkEnv";

// Database
import "./database";

// Express
import "./express";

// Logger
export { logger } from "./logger";
