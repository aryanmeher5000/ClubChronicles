const fs = require("fs").promises;
const winston = require("winston");

async function unLinkFile(filePath) {
  const maxAttempts = 3;
  const baseDelay = 100;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      await fs.unlink(filePath);
      return;
    } catch (error) {
      if (error.code === "ENOENT") {
        winston.warn(`File not found: ${filePath}`);
        return;
      }

      winston.error(`Delete attempt ${attempt + 1}/${maxAttempts} failed - ${filePath}`, error);

      if (attempt < maxAttempts - 1) {
        await new Promise((resolve) => setTimeout(resolve, baseDelay * Math.pow(2, attempt)));
      }
    }
  }

  winston.error(`Failed to delete ${filePath} after ${maxAttempts} attempts`);
}

function extractFilePaths(req) {
  const paths = new Set();

  // Single file
  if (req.file?.path) {
    paths.add(req.file.path);
  }

  // Array of files or object with file arrays
  if (req.files) {
    const files = Array.isArray(req.files) ? req.files : Object.values(req.files).flat();

    files.forEach((file) => {
      if (file?.path) {
        paths.add(file.path);
      }
    });
  }

  return [...paths];
}

function fileCleanupMiddleware() {
  let pLimit;
  let limit;

  return async (req, res, next) => {
    const cleanup = async () => {
      try {
        // Initialize pLimit only once
        if (!pLimit) {
          pLimit = (await import("p-limit")).default;
          limit = pLimit(5);
        }

        const filePaths = extractFilePaths(req);
        if (filePaths.length > 0) {
          await Promise.all(filePaths.map((path) => limit(() => unLinkFile(path))));
        }
      } catch (error) {
        winston.error("File cleanup failed", error);
      }
    };

    res.once("finish", cleanup);
    next();
  };
}

module.exports = fileCleanupMiddleware;
