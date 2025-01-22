const winston = require("winston");
require("winston-mongodb");
require("express-async-errors");

module.exports = function () {
  // Define a custom log format
  const customFormat = winston.format.printf(
    ({ level, message, timestamp }) => `${timestamp} [${level.toUpperCase()}]: ${message}`
  );

  // Common format for all transports
  const logFormat = winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(), // For structured logs
    customFormat
  );

  // Determine the environment
  const isDevelopment = process.env.NODE_ENV !== "production";

  // Add transports based on the environment
  if (isDevelopment) {
    // Logfile for development
    winston.add(
      new winston.transports.File({
        filename: "logfile.log",
        level: "info",
        format: logFormat,
      })
    );

    winston.add(
      new winston.transports.File({
        filename: "errorLogFile.log",
        level: "error",
        format: logFormat,
      })
    );
  } else {
    // MongoDB logging for production
    const mongoUri = process.env.MONGO_DB_URI;

    winston.add(
      new winston.transports.MongoDB({
        db: mongoUri,
        level: "error",
        capped: true,
        cappedMax: 500,
        format: logFormat,
      })
    );
  }

  // Uncaught Exceptions Handling
  winston.exceptions.handle(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.errors({ stack: true }) // Include stack traces
      ),
    }),
    new winston.transports.File({
      filename: "uncaughtExceptions.log",
      format: logFormat,
    })
  );

  // Handle Unhandled Promise Rejections
  process.on("unhandledRejection", (reason) => {
    winston.error("Unhandled Promise Rejection:", reason);
    process.exit(1);
  });

  // Graceful Shutdown
  process.on("SIGINT", () => {
    winston.info("Application is shutting down.");
    process.exit(0);
  });

  process.on("SIGTERM", () => {
    winston.info("Application received termination signal.");
    process.exit(0);
  });
};
