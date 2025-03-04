const {
  s3,
  GetObjectCommand,
  DeleteObjectCommand,
  CopyObjectCommand,
} = require("../configs/s3.config");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const {
  dynamoDB,
  QueryCommand,
  GetItemCommand,
  DeleteItemCommand,
  UpdateItemCommand,
} = require("../configs/dynamoDB.config");
const { unmarshall } = require("@aws-sdk/util-dynamodb");

const TABLE_NAME = process.env.AWS_DYNAMODB_TABLE_NAME;
const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;

const listUserFiles = async (req, res) => {
  try {
    const userId = req.user.sub;

    const params = {
      TableName: TABLE_NAME,
      KeyConditionExpression: "userId = :userId",
      ExpressionAttributeValues: {
        ":userId": { S: userId }, // Use the correct attribute type
      },
    };

    const command = new QueryCommand(params);
    const result = await dynamoDB.send(command);

    // Convert DynamoDB format to standard JSON
    const files = result.Items.map((item) => unmarshall(item));

    res.json({ success: true, files });
  } catch (error) {
    console.error("Error fetching user files:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to retrieve files." });
  }
};

const getFileDownloadUrl = async (req, res) => {
  try {
    const userId = req.user.sub; // Extract user ID from Cognito token
    const fileId = req.params.fileId;

    // Fetch file metadata from DynamoDB
    const params = {
      TableName: TABLE_NAME,
      Key: {
        userId: { S: userId }, // Partition Key
        fileId: { S: fileId }, // Sort Key
      },
    };

    const result = await dynamoDB.send(new GetItemCommand(params));

    if (!result.Item) {
      return res.status(404).json({ error: "File not found" });
    }

    const fileKey = result.Item.s3Path.S; // Get the S3 key from the database
    console.log("File Key:", fileKey);
    // Generate a pre-signed URL for secure file access
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileKey,
      //   Key: "users/c478a458-0091-7022-e66d-5f67ef485856/1741007136513-peritys front page png.png",
    });

    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 60 });
    // const signedUrl = await getSignedUrl(
    //   s3,
    //   command,
    //   (error, url) => {
    //     if (error) console.log("error", error);
    //     if (url) console.log("url", url);
    //   }
    // );

    return res.json({ downloadUrl: signedUrl });
  } catch (error) {
    console.error("Error generating download URL:", error);
    res.status(500).json({ error: "Failed to generate download URL" });
  }
};

const deleteFile = async (req, res) => {
  try {
    const { fileId } = req.params;
    const userId = req.user.sub; // Assuming userId is stored in req.user after auth

    // Fetch file metadata from DynamoDB
    const getParams = {
      TableName: TABLE_NAME,
      Key: {
        userId: { S: userId },
        fileId: { S: fileId },
      },
    };

    const fileData = await dynamoDB.send(new GetItemCommand(getParams));
    if (!fileData.Item) {
      return res.status(404).json({ message: "File not found" });
    }

    const fileKey = fileData.Item.s3Path.S; // File path in S3

    // Delete file from S3
    const deleteS3Params = {
      Bucket: BUCKET_NAME,
      Key: fileKey,
    };
    await s3.send(new DeleteObjectCommand(deleteS3Params));

    // Delete entry from DynamoDB
    const deleteDynamoParams = {
      TableName: TABLE_NAME,
      Key: {
        userId: { S: userId },
        fileId: { S: fileId },
      },
    };
    await dynamoDB.send(new DeleteItemCommand(deleteDynamoParams));

    res.json({ message: "File deleted successfully" });
  } catch (error) {
    console.error("Error deleting file:", error);
    res
      .status(500)
      .json({ message: "Error deleting file", error: error.message });
  }
};

const renameFile = async (req, res) => {
  try {
    const { fileId, newFileName } = req.body;
    const userId = req.user.sub; // Extracted from authentication middleware

    if (!fileId || !newFileName) {
      return res
        .status(400)
        .json({ error: "fileId and newFileName are required" });
    }

    // Fetch file details from DynamoDB
    const getFileParams = {
      TableName: TABLE_NAME,
      Key: {
        userId: { S: userId },
        fileId: { S: fileId },
      },
    };
    const fileData = await dynamoDB.send(new GetItemCommand(getFileParams));

    if (!fileData.Item) {
      return res.status(404).json({ error: "File not found" });
    }

    const oldKey = fileData.Item.s3Path.S; // Current file key
    if (!oldKey) {
      return res.status(500).json({ error: "Invalid file key" });
    }

    const fileExtension = oldKey.split(".").pop(); // Extract extension
    if (!fileExtension) {
      return res.status(500).json({ error: "Invalid file extension" });
    }
    
    const folderPath = oldKey.substring(0, oldKey.lastIndexOf("/") + 1); // Keep folder structure

    const newKey = `${folderPath}${newFileName}.${fileExtension}`; // New key with same folder

    // Copy file to new location
    await s3.send(
      new CopyObjectCommand({
        Bucket: BUCKET_NAME,
        CopySource: `${BUCKET_NAME}/${oldKey}`,
        Key: newKey,
      })
    );

    // Delete old file
    await s3.send(
      new DeleteObjectCommand({
        Bucket: BUCKET_NAME,
        Key: oldKey,
      })
    );

    // Update DynamoDB with new key
    const updateParams = {
      TableName: TABLE_NAME,
      Key: {
        userId: { S: userId },
        fileId: { S: fileId },
      },
      UpdateExpression: "SET s3Path = :newKey",
      ExpressionAttributeValues: {
        ":newKey": { S: newKey },
      },
    };
    await dynamoDB.send(new UpdateItemCommand(updateParams));

    res.status(200).json({ message: "File renamed successfully", newFileName });
  } catch (error) {
    console.error("Error renaming file:", error);
    res.status(500).json({ error: "Failed to rename file" });
  }
};

module.exports = { listUserFiles, getFileDownloadUrl, deleteFile, renameFile };
