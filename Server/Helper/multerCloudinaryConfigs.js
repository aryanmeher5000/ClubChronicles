const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const path = require("path");

// Initialize Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // Max file size 5MB
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ["image/png", "image/jpeg", "image/webp", "image/jpg", "application/pdf"];
    const allowedExtensions = [".png", ".jpg", ".jpeg", ".pdf"];
    const invalidCharacters = /[<>:"/\\|?*]/;
    const fileExtension = path.extname(file.originalname).toLowerCase();

    // Validate file MIME type
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(new Error(`File ${file.originalname} has an unsupported file type!`), false);
    }

    // Validate file extension
    if (!allowedExtensions.includes(fileExtension)) {
      return cb(new Error(`File ${file.originalname} has an invalid file extension!`), false);
    }

    // Check for invalid characters in file name
    if (invalidCharacters.test(file.originalname)) {
      return cb(new Error(`File ${file.originalname} contains invalid characters in its name!`), false);
    }

    // If all checks pass, accept the file
    return cb(null, true);
  },
});

module.exports = { upload, cloudinary };
