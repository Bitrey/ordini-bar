import path from "path";
import dotenv from "dotenv";
import { options } from "./";

dotenv.config({ path: options.envFile });
