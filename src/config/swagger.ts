import swaggerJsDoc, { Options } from "swagger-jsdoc";
import { logger } from "./logger";
import { PORT } from "./express";
import path from "path";

const swaggerOptions: Options = {
    swaggerDefinition: {
        info: <any>{
            title: "Ordini Bar API",
            description: "Ordini Bar Backend API",
            contact: {
                name: "Bitrey"
            },
            // servers: ["http://localhost" + PORT ? `:${PORT}` : ""],
            version: "0.0.1"
        }
    },
    host: `localhost${PORT ? `:${PORT}` : ""}`,
    apis: ["../routes/**/*.ts", "../routes/**/*.js"]
};

logger.debug("Swagger file loaded");

export const swaggerSpec = swaggerJsDoc(swaggerOptions);
