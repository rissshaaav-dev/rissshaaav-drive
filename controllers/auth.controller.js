const axios = require("axios");

/**
 * Initiates the OAuth2 login process by redirecting the user to the Cognito login page.
 *
 * @param {Object} _ - The request object (not used).
 * @param {Object} res - The response object.
 *
 * @description
 * 1. Constructs the login URL using the Cognito domain, client ID, response type, scope, and redirect URI.
 * 2. Redirects the user to the constructed login URL.
 */
const login = (_, res) => {
  const loginUrl = `${process.env.COGNITO_DOMAIN}/login?client_id=${process.env.COGNITO_CLIENT_ID}&response_type=code&scope=email+openid+profile&redirect_uri=${process.env.COGNITO_REDIRECT_URI}`;
  res.redirect(loginUrl);
};

/**
 * Handles the OAuth2 callback by exchanging the authorization code for tokens
 * and fetching user details from Cognito.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the process is complete.
 *
 * @description
 * 1. Extracts the authorization code from the query parameters.
 * 2. Returns a 400 status code if the authorization code is missing.
 * 3. Exchanges the authorization code for tokens by making a POST request to the Cognito token endpoint.
 * 4. Extracts the ID token and access token from the token response.
 * 5. Fetches user details from Cognito using the access token.
 * 6. Returns a JSON response with the user details, ID token, and access token.
 * 7. Catches and logs any errors, returning a 500 status code if authentication fails.
 */
const callback = async (req, res) => {
  const { code } = req.query;
  if (!code)
    return res.status(400).json({ error: "Authorization code is missing" });

  try {
    // Exchange authorization code for tokens
    const tokenResponse = await axios.post(
      `${process.env.COGNITO_DOMAIN}/oauth2/token`,
      new URLSearchParams({
        grant_type: "authorization_code",
        client_id: process.env.COGNITO_CLIENT_ID,
        client_secret: process.env.COGNITO_CLIENT_SECRET,
        code,
        redirect_uri: process.env.COGNITO_REDIRECT_URI,
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const { id_token, access_token } = tokenResponse.data;

    // Fetch user details from Cognito
    const userInfo = await axios.get(
      `${process.env.COGNITO_DOMAIN}/oauth2/userInfo`,
      {
        headers: { Authorization: `Bearer ${access_token}` },
      }
    );

    res.json({
      message: "Login successful",
      user: userInfo.data,
      id_token,
      access_token,
    });
  } catch (error) {
    console.error("OAuth Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Authentication failed" });
  }
};

module.exports = { login, callback };
