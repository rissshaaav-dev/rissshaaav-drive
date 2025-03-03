const multer = require("multer");
const multerS3 = require("multer-s3");
const s3 = require("../configs/s3.config");
const path = require("path");

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_S3_BUCKET_NAME,
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      const userId = req.user.sub; // Extract user ID from Cognito token
      const uniqueFileName = `${Date.now()}-${file.originalname}`;
      cb(null, `users/${userId}/${uniqueFileName}`); // Store in a folder per user
    },
  }),
  limits: { fileSize: 10 * 1024 * 1024, files: 10 }, // 10MB per file, max 10 files
  fileFilter: (req, file, cb) => {
    const allowedFileTypes = /jpeg|jpg|png|pdf|txt|docx/;
    const extname = allowedFileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedFileTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      return cb(
        new Error("Only images, PDFs, and text files are allowed"),
        false
      );
    }
  },
});

module.exports = upload;
