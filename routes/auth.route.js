const express = require("express");
const { login, callback } = require("../controllers/auth.controller");

const authRouter = express.Router();

/**
 * @swagger
 * /auth/login:
 *   get:
 *     summary: Redirects to Cognito login page
 *     description: Initiates the OAuth login process by redirecting the user to the Cognito-hosted UI.
 *     tags:
 *       - Authentication
 *     responses:
 *       302:
 *         description: Redirects to Cognito login page
 */

authRouter.get("/login", login);

/**
 * @swagger
 * /auth/callback:
 *   get:
 *     summary: Handles Cognito authentication callback
 *     description: Exchanges the authorization code for access and ID tokens, then fetches user details.
 *     tags:
 *       - Authentication
 *     parameters:
 *       - in: query
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: Authorization code received from Cognito after login.
 *     responses:
 *       200:
 *         description: Successful authentication
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *                 id_token:
 *                   type: string
 *                 access_token:
 *                   type: string
 *       400:
 *         description: Missing authorization code
 *       500:
 *         description: Authentication failed
 */
authRouter.get("/callback", callback);

module.exports = authRouter;
