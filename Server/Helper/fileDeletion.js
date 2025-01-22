const winston = require("winston");
const { cloudinary } = require("./multerCloudinaryConfigs");

//Helper function
async function deleteFilesFromCloudinary(publicIdArray) {
  const maxRetries = 3;
  const baseDelay = 1000; //1 second
  let failedIds = [...publicIdArray];
  const deletedFiles = [];
  const notFoundFiles = [];

  for (let attempts = 0; attempts < maxRetries; attempts++) {
    try {
      const deleteResponse = await cloudinary.api.delete_resources(failedIds);

      if (deleteResponse?.deleted) {
        for (const [id, status] of Object.entries(deleteResponse.deleted)) {
          if (status === "deleted") {
            deletedFiles.push(id);
          } else if (status === "not_found") {
            notFoundFiles.push(id);
          }
        }
      } else {
        winston.warn("Unexpected response from Cloudinary API", deleteResponse);
        break;
      }

      //Determine the failed IDs
      failedIds = failedIds.filter((id) => !deletedFiles.includes(id) && !notFoundFiles.includes(id));

      if (failedIds.length === 0) break;
    } catch (err) {
      if (err?.statusCode === 429) {
        winston.warn("Rate limit exceeded, retrying after delay...");
        if (attempts < maxRetries - 1)
          await new Promise((resolve) => setTimeout(resolve, baseDelay * Math.pow(2, attempts)));

        continue;
      }

      winston.error("Unexpected error occurred while deleting files on cloudinary!", err);

      if (attempts < maxRetries - 1) await new Promise((resolve) => setTimeout(resolve, baseDelay * Math.pow(2, attempts)));
    }
  }

  if (notFoundFiles.length > 0) winston.error(`Some deletion files were not found on cloudinary - ${notFoundFiles}`);
  if (failedIds.length > 0) winston.error(`Failed to delete some files on cloudinary - ${failedIds}`);

  return;
}

async function fileDelete(publicIdArray) {
  if (!publicIdArray || !Array.isArray(publicIdArray)) return;

  try {
    await deleteFilesFromCloudinary(publicIdArray);
    return;
  } catch (err) {
    winston.error("Failed to delete files on cloudinary!", err);
  }
  return;
}

module.exports = fileDelete;
