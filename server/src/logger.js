import winston from "winston";

const logger = winston.createLogger({
  level: process.env["LOG_LEVEL"] ?? "error",
  format: winston.format.json(),
  transports: [new winston.transports.Console()],
  silent: process.argv.indexOf("--silent") >= 0,
});

export default logger;
