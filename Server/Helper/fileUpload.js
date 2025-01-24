const winston = require("winston");
const { cloudinary } = require("./multerCloudinaryConfigs");
const streamifier = require("streamifier");

//Helper Function
async function uploadFileToCloudinary(fileBuffer) {
  const maxAttempts = 2;
  const baseDelay = 1000; // 1 second base delay

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      const uploadResult = await new Promise((resolve, reject) => {
        streamifier.createReadStream(fileBuffer).pipe(
          cloudinary.uploader.upload_stream({ resource_type: "auto", timeout: 60000 }, (error, result) => {
            if (error) reject(error);
            else resolve(result);
          })
        );
      });
      return { success: true, publicId: uploadResult.public_id };
    } catch (error) {
      // Handle rate limiting specifically
      if (error.http_code === 429) {
        winston.warn(`Cloudinary - Rate limit hit while uploading ${fileBuffer}, waiting longer...`);
        await new Promise((resolve) => setTimeout(resolve, baseDelay * Math.pow(2, attempt + 1)));
        continue;
      }

      winston.error(`Cloudinary upload error for ${fileBuffer}`, error);

      // Don't retry on client errors (except rate limiting which is handled above)
      if (error.http_code >= 400 && error.http_code < 500) return { success: false };

      // For server errors or network issues, continue with retry
      if (attempt < maxAttempts - 1) {
        await new Promise((resolve) => setTimeout(resolve, baseDelay * Math.pow(2, attempt)));
      }
    }
  }

  return { success: false };
}

async function fileUpload(fileArray) {
  if (!fileArray || !Array.isArray(fileArray) || fileArray.length === 0) return { success: false, publicIdArray: [] };

  let errorOccured = false;
  let uploadedFiles = [];

  try {
    const pLimit = (await import("p-limit")).default;
    const limit = pLimit(5);
    const uploadProcessArray = fileArray.map((file) =>
      limit(async () => {
        if (errorOccured) return;
        const { success, publicId } = await uploadFileToCloudinary(file.buffer);
        if (!success) errorOccured = true;

        uploadedFiles.push(publicId);
      })
    );
    await Promise.all(uploadProcessArray);
  } catch (err) {
    winston.error("Error while uploading files", err);
  }
  return { success: !errorOccured, publicIdArray: uploadedFiles };
}

module.exports = fileUpload;
