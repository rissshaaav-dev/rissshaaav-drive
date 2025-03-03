const express = require("express");
const authenticateUser = require("../middlewares/auth.middleware");
const upload = require("../middlewares/upload.middleware");
const uploadFiles = require("../controllers/upload.controller");

const uploadRouter = express.Router();

uploadRouter.post(
  "/upload",
  authenticateUser,
  upload.array("files", 10),
  uploadFiles
);

module.exports = uploadRouter;
