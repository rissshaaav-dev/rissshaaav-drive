const express = require("express");
const { login, callback } = require("../controllers/auth.controller");

const authRouter = express.Router();

authRouter.get("/login", login);
authRouter.get("/callback", callback);

module.exports = authRouter;