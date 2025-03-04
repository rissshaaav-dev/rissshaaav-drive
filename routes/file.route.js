const express = require("express");
const {listUserFiles, getFileDownloadUrl, deleteFile, renameFile} = require("../controllers/file.controller");
const authenticateUser = require("../middlewares/auth.middleware");

const fileRouter = express.Router();

fileRouter.get("/files", authenticateUser, listUserFiles);
fileRouter.get("/files/download/:fileId", authenticateUser, getFileDownloadUrl);
fileRouter.delete('/files/delete/:fileId', authenticateUser, deleteFile);
fileRouter.put("/files/rename", authenticateUser, renameFile);

module.exports = fileRouter;
