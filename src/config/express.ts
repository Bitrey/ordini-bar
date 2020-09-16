// Express
import express from "express";
export const app = express();

// Logger
import { logger, LoggerStream } from "./logger";
import morgan from "morgan";

// Body parser
import bodyParser from "body-parser";

// Use morgan
app.use(morgan("tiny", { stream: new LoggerStream() }));

// support parsing of application/json type post data
app.use(bodyParser.json());

//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: false }));

// Use routes
import routes from "../routes";
app.use("/", routes);

const IP = process.env.IP || "127.0.0.1";
const PORT = Number(process.env.PORT) || 3000;

// Start server
app.listen(PORT, IP, () => logger.info("Server started on port " + PORT));
