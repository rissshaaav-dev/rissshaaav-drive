const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./configs/swagger.config");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/auth", require("./routes/auth.route"));
app.use("/api", require("./routes/upload.route"));
app.use("/api", require("./routes/file.route"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
  console.log(
    `Swagger Docs available at: http://localhost:${process.env.PORT}/api-docs`
  );
});
