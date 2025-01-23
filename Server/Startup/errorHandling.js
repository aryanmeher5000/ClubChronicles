const winston = require("winston");
const multer = require("multer");
const { fileDelete, fileCleanup } = require("../Middleware/index");

module.exports = async function (err, req, res, next) {
  // Log the error
  winston.error(err.message, { metadata: err });

  // Default error response
  let statusCode = 500;
  let message = "Something went wrong. Please try again later.";

  // Handle Multer-specific errors
  if (err instanceof multer.MulterError) {
    statusCode = 400;
    message = err.message || "File upload failed!";
  }

  try {
    // Cleanup uploaded files
    fileDelete(req, res, next); // Ensure this is awaited if it's async

    const fileCleaning = fileCleanup();
    await fileCleaning(req, res, next); // Call as middleware
  } catch (cleanupError) {
    // Log any cleanup errors
    winston.warn("File cleanup failed:", { metadata: cleanupError });
  }

  // Send error response
  return res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === "development" && { details: err.message }), // Include details in dev mode
  });
};
