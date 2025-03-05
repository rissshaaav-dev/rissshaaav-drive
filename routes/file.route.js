const express = require("express");
const {
  listUserFiles,
  getFileDownloadUrl,
  deleteFile,
  renameFile,
} = require("../controllers/file.controller");
const authenticateUser = require("../middlewares/auth.middleware");

const fileRouter = express.Router();

/**
 * @swagger
 * /api/files:
 *   get:
 *     summary: List all files of the authenticated user
 *     description: Fetches all files belonging to the logged-in user from DynamoDB.
 *     tags:
 *       - Files
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of user files
 *       500:
 *         description: Failed to retrieve files
 */
fileRouter.get("/files", authenticateUser, listUserFiles);

/**
 * @swagger
 * /api/files/download/{fileId}:
 *   get:
 *     summary: Get a signed URL for file download
 *     description: Generates a pre-signed URL for downloading a file.
 *     tags:
 *       - Files
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: fileId
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier of the file to download.
 *     responses:
 *       200:
 *         description: Successfully generated download URL
 *       404:
 *         description: File not found
 *       500:
 *         description: Failed to generate download URL
 */
fileRouter.get("/files/download/:fileId", authenticateUser, getFileDownloadUrl);

/**
 * @swagger
 * /api/files/delete/{fileId}:
 *   delete:
 *     summary: Delete a file
 *     description: Deletes a file from S3 and removes its metadata from DynamoDB.
 *     tags:
 *       - Files
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: fileId
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier of the file to delete.
 *     responses:
 *       200:
 *         description: File deleted successfully
 *       404:
 *         description: File not found
 *       500:
 *         description: Error deleting file
 */
fileRouter.delete("/files/delete/:fileId", authenticateUser, deleteFile);

/**
 * @swagger
 * /api/files/rename:
 *   put:
 *     summary: Rename a file
 *     description: Changes the filename while keeping it in the same folder.
 *     tags:
 *       - Files
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fileId:
 *                 type: string
 *               newFileName:
 *                 type: string
 *     responses:
 *       200:
 *         description: File renamed successfully
 *       400:
 *         description: Missing fileId or newFileName
 *       404:
 *         description: File not found
 *       500:
 *         description: Failed to rename file
 */
fileRouter.put("/files/rename", authenticateUser, renameFile);

module.exports = fileRouter;
