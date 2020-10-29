import path from "path";
import dotenv from "dotenv";
import { logger, options } from "./";

logger.debug("Dotenv config file loaded");

dotenv.config({ path: options.envFile });
