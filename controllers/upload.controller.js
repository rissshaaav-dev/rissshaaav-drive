const multer = require("multer");
const multerS3 = require("multer-s3");
const s3 = require("../configs/s3.config");

// Configure multer to use S3 for storage
/**
 * Step by step:
 * 1. Configure multer to use multerS3 for storage.
 * 2. Set the S3 instance and bucket name from environment variables.
 * 3. Define a key function to generate a unique file name.
 * 4. The file name is generated using the user's ID and the current timestamp.
 *
 * @constant {Object} upload - Multer configuration object for handling file uploads.
 * @property {Object} storage - Storage configuration for multer using multerS3.
 * @property {Object} storage.s3 - AWS S3 instance for file storage.
 * @property {string} storage.bucket - S3 bucket name from environment variables.
 * @property {function} storage.key - Function to generate a unique file name.
 * @param {Object} req - Express request object.
 * @param {Object} file - File object containing file details.
 * @param {function} cb - Callback function to return the generated file name.
 */
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_S3_BUCKET_NAME, // S3 bucket name from environment variables
    key: function (req, file, cb) {
      // Generate a unique file name using user ID and current timestamp
      const fileName = `${req.user.sub}/${Date.now()}-${file.originalname}`;
      cb(null, fileName);
    },
  }),
});

/**
 * Handles the upload of multiple files.
 *
 * This function checks if any files were uploaded in the request. If no files are found,
 * it responds with a 400 status code and an error message. If files are found, it extracts
 * the URLs of the uploaded files and responds with a success message and the file URLs.
 *
 * @param {Object} req - The request object, containing the uploaded files.
 * @param {Object} res - The response object, used to send back the appropriate response.
 * @returns {Object} - Returns a JSON response with either an error message or the file URLs.
 */
const uploadMultipleFiles = (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: "No files uploaded" });
  }
  // Extract uploaded file URLs
  const fileUrls = req.files.map((file) => file.location);
  res.json({
    message: "Files uploaded successfully",
    fileUrls,
  });
};

module.exports = { upload, uploadMultipleFiles };
