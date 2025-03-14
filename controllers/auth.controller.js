const axios = require("axios");

const login = (_, res) => {
  // const loginUrl = `${process.env.COGNITO_DOMAIN}/login?client_id=${process.env.COGNITO_CLIENT_ID}&response_type=code&scope=email+openid+profile&redirect_uri=${process.env.COGNITO_REDIRECT_URI}`;
  // const loginUrl = `https://us-east-1yn0zuwdh2.auth.us-east-1.amazoncognito.com/login?client_id=68a5p7sm4piik7f8v1a3ov3lma&response_type=code&scope=email+openid+phone&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Fcallback`;
  const loginUrl = `${process.env.COGNITO_DOMAIN}/login?client_id=${process.env.COGNITO_CLIENT_ID}&response_type=code&scope=email+openid+phone&redirect_uri=${process.env.COGNITO_REDIRECT_URI}`;
  res.redirect(loginUrl);
};

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
