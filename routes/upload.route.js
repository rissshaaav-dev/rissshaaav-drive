const express = require("express");
const authenticateUser = require("../middlewares/auth.middleware");
const upload = require("../middlewares/upload.middleware");
const uploadFiles = require("../controllers/upload.controller");

const uploadRouter = express.Router();

/**
 * @swagger
 * /upload:
 *   post:
 *     summary: Upload files to S3
 *     description: Allows authenticated users to upload multiple files (max 10) to S3. Saves metadata in DynamoDB.
 *     tags:
 *       - Files
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Files uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 uploadedFiles:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       fileId:
 *                         type: string
 *                       fileName:
 *                         type: string
 *                       s3Path:
 *                         type: string
 *       400:
 *         description: No files uploaded
 *       500:
 *         description: File upload failed
 */
uploadRouter.post(
  "/upload",
  authenticateUser,
  upload.array("files", 10),
  uploadFiles
);

module.exports = uploadRouter;
