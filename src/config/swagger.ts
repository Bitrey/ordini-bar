import swaggerJsDoc, { Options } from "swagger-jsdoc";
import { logger } from "./logger";
import path from "path";

logger.debug("Swagger config file loaded");

// const swaggerOptions: Options = {
//     swaggerDefinition: {
//         info: <any>{
//             title: "Ordini Bar API",
//             description: "Ordini Bar Backend API",
//             contact: {
//                 name: "Bitrey"
//             },
//             // servers: ["http://localhost" + PORT ? `:${PORT}` : ""],
//             version: "0.0.1"
//         }
//     },
//     host: `localhost${PORT ? `:${PORT}` : ""}`,
//     apis: ["../routes/**/*.ts", "../routes/*.ts", "../routes/**/*.js"]
// };

// export const swaggerSpec = swaggerJsDoc(swaggerOptions);

const apiPath = path.join(__dirname, "../routes", "/**/*.ts");
// const relativePath = path.relative(__dirname, apiPath);

export const options = {
    swaggerDefinition: {
        info: {
            title: "Ordini Bar API",
            description: "Ordini Bar Backend API",
            version: "1.0"
        },
        host: "localhost:3000",
        // basePath: "/api",
        produces: ["application/json"],
        schemes: ["http", "https"]
    },
    basedir: __dirname, //app absolute path
    files: [
        apiPath
        // + "/*.ts"
    ] //Path to the API handle folder
};
