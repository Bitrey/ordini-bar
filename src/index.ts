import "./config";

import routes from "./routes";
import { populateUser } from "./middleware";

import cookieParser from "cookie-parser";

// Express
import express from "express";
export const app = express();

// Logger
import { logger, LoggerStream } from "./config/logger";
import morgan from "morgan";

// Body parser
import bodyParser from "body-parser";
// import swaggerUi from "swagger-ui-express";
// import { swaggerSpec } from "./config/swagger";

// Express Swagger
import { options } from "./config/swagger";
const expressSwagger = require("express-swagger-generator")(app);
expressSwagger(options);

// Use morgan
app.use(morgan("tiny", { stream: new LoggerStream() }));

// Cookie parser
app.use(cookieParser(<string>process.env.COOKIE_SECRET));

// support parsing of application/json type post data
app.use(bodyParser.json());

//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: false }));

// Populate user middleware
app.use(populateUser);

// const options: swaggerUi.SwaggerUiOptions = {
//     explorer: true
// };

// Use Swagger
// app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, options));

// Use routes
app.use("/", routes);

// WARNING: Any route defined below here will have a 404 response!!

export const IP = process.env.IP || "127.0.0.1";
export const PORT = Number(process.env.PORT) || 3000;

// Start server
app.listen(PORT, IP, () => logger.info("Server started on port " + PORT));

logger.debug("Index file loaded");

export default app;
