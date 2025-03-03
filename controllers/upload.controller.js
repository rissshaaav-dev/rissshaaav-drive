const { v4: uuidv4 } = require("uuid");
// const { PutCommand } = require("@aws-sdk/lib-dynamodb");
const { dynamoDB, PutCommand } = require("../configs/dynamoDB.config");

const uploadFiles = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    const userId = req.user.sub; // Extracted from Cognito token
    const uploadedFiles = [];

    for (const file of req.files) {
      const fileId = uuidv4();
      const fileName = file.originalname;
      const fileSize = file.size;
      const fileType = file.mimetype;
      const uploadDate = new Date().toISOString();
      // const s3Path = file.location; // S3 URL
      const s3Path = file.key; // S3 URL

      // Save file metadata in DynamoDB
      const params = new PutCommand({
        TableName: process.env.AWS_DYNAMODB_TABLE_NAME,
        Item: {
          fileId,
          userId,
          fileName,
          fileSize,
          fileType,
          uploadDate,
          s3Path,
          visibility: "private",
          sharedWith: [],
        },
      });

      await dynamoDB.send(params);

      uploadedFiles.push({
        fileId,
        fileName,
        s3Path,
      });
    }

    res.json({
      message: "Files uploaded successfully",
      uploadedFiles,
    });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ error: "File upload failed" });
  }
};

module.exports = uploadFiles;
