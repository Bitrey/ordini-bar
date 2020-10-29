import { logger } from "./logger";

logger.debug("Env checker config file loaded");

// Check by strings array
export const REQUIRED_ENVS = [
    "IP",
    "PORT",
    "MONGOOSE_URI",
    "JWT_TOKEN",
    "COOKIE_SECRET"
];
for (const env of REQUIRED_ENVS) {
    if (typeof process.env[env] !== "string") {
        logger.error(Error(`Environment variable "${env}" does not exist!`));
        process.exit(1);
    }
}

// Check by file
// const file = fs.readFileSync(options.envFile, "utf8");

// const envs = file
//     .trim()
//     .replace(/^\s*\n/gm, "")
//     .split(/\r?\n|\r/g)
//     .map(env => {
//         const envSplit = env.replace(/ +/, "").split("=");
//         return envSplit[0];
//     });

// for (const env of envs) {
//     if (typeof process.env[env] !== "string") {
//         console.error(Error(`Environment variable "${env}" does not exist!`));
//         process.exit(1);
//     }
// }
