const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Rissshaaav-Drive API",
      version: "1.0.0",
      description: "API documentation for Rissshaaav-Drive backend",
    },
    servers: [
      {
        url: "http://localhost:${process.env.PORT}",
        description: "Local server",
      },
    ],
  },
  apis: ["./routes/*.js"], // Point this to where your routes are defined
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
