import express from "express";
export const app = express();

import { logger, LoggerStream } from "./logger";
import morgan from "morgan";

import bodyParser from "body-parser";

const IP = process.env.IP || "127.0.0.1";
const PORT = Number(process.env.PORT) || 3000;

// Use morgan
app.use(morgan("tiny", { stream: new LoggerStream() }));

// Use routes
import routes from "../routes";
app.use("/", routes);

// Use body parser JSON
app.use(bodyParser.json());

// Start server
app.listen(PORT, IP, () => logger.info("Server started on port " + PORT));
