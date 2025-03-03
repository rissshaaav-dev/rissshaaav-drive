const express = require("express");
const { upload, uploadMultipleFiles } = require("../controllers/upload.controller");
const authenticateUser = require("../middlewares/auth.middleware");

const uploadRouter = express.Router();

uploadRouter.post(
  "/upload",
  authenticateUser,
  upload.array("files", 5),
  uploadMultipleFiles
);

module.exports = uploadRouter;
