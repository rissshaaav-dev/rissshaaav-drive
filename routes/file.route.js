const express = require("express");
const {listUserFiles, getFileDownloadUrl} = require("../controllers/file.controller");
const authenticateUser = require("../middlewares/auth.middleware");

const fileRouter = express.Router();

fileRouter.get("/files", authenticateUser, listUserFiles);
fileRouter.get("/files/download/:fileId", authenticateUser, getFileDownloadUrl);

module.exports = fileRouter;
