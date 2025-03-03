const { s3, GetObjectCommand } = require("../configs/s3.config");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { dynamoDB, QueryCommand, GetItemCommand } = require("../configs/dynamoDB.config");
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

module.exports = { listUserFiles, getFileDownloadUrl };
