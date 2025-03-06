# Rissshaaav-Drive 🚀  

A cloud storage backend built with **Node.js, Express, AWS DynamoDB, and S3**, featuring authentication via **AWS Cognito**.  

## Features  
- 🔐 **User Authentication** (OAuth via Cognito)  
- 📂 **File Upload & Storage** (S3 + metadata in DynamoDB)  
- ✏️ **File Management** (Rename, Delete, Download via pre-signed URLs)  
- 📜 **Swagger API Documentation** (OAuth-protected endpoints)  

## Setup  

### Prerequisites  
- Node.js (Latest LTS version)  
- AWS Account with Cognito, S3, and DynamoDB configured  

### Installation  

- git clone https://github.com/rissshaaav-dev/rissshaaav-drive.git  
- cd rissshaaav-drive  
- npm install  

## Environment Variables 🌍  

Create a `.env` file in the root directory and add the following:  

AWS_REGION=your-region  
AWS_COGNITO_USER_POOL_ID=your-user-pool-id  
AWS_COGNITO_CLIENT_ID=your-client-id  
AWS_DYNAMODB_TABLE_NAME=rissshaaav.files  
AWS_S3_BUCKET_NAME=your-bucket-name  

## Installation & Setup 🚀  

### Prerequisites  
- [Node.js](https://nodejs.org/) (Latest LTS recommended)  
- AWS account with Cognito, DynamoDB, and S3 configured  
- Environment variables set up (see [Environment Variables](#environment-variables))  

### Steps  
1. **Clone the repository**  
   **`git clone https://github.com/rissshaaav-dev/rissshaaav-drive.git`**  
   **`cd your-repo`**
2. **Install Dependencies**  
   **`npm install`**
3. **Run the server**  
   **`npm start`**  
   The server will start on http://localhost:3000. You can modify the port in the environment variables if needed.


## API Documentation 📖  

This project uses **Swagger** for API documentation.  

### Accessing Swagger UI  
Once the server is running, you can access the API documentation at:  

**`http://localhost:3000/api-docs`**  

### Authentication  
Most routes require authentication via **Bearer Token**.  
1. Obtain an **ID Token** after logging in through Cognito.  
2. Use the token in the **Authorization** header as:  
   
   Authorization: Bearer YOUR_ID_TOKEN


### Available Endpoints 🚀  

Swagger UI provides an interactive way to test all available endpoints, including:  

#### Authentication 🔑  
- `GET /auth/login` - Redirects to Cognito login page  
- `GET /auth/callback` - Handles authentication callback  

#### File Management 📂  
- `POST /files/upload` - Upload files  
- `GET /files/download/{fileId}` - Get a signed URL for file download  
- `DELETE /files/delete/{fileId}` - Delete a file  
- `PUT /files/rename` - Rename a file  

For detailed request & response formats, refer to **Swagger UI**.  
