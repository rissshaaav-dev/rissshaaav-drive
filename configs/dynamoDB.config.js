const { DynamoDBClient, QueryCommand, GetItemCommand } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb");

const dynamoDBClient = new DynamoDBClient({
  region: process.env.AWS_REGION,
});

const dynamoDB = DynamoDBDocumentClient.from(dynamoDBClient);

module.exports = { dynamoDB, PutCommand, QueryCommand, GetItemCommand };
