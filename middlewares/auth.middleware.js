const jwt = require("jsonwebtoken");

/**
 * Middleware to authenticate a user based on the JWT token provided in the Authorization header.
 *
 * Steps:
 * 1. Extract the Authorization header from the request.
 * 2. Check if the Authorization header is present and starts with "Bearer ".
 * 3. Extract the token from the Authorization header.
 * 4. Decode the JWT token without verifying the signature.
 * 5. Check if the token is valid.
 * 6. Attach the decoded user information to the request object.
 * 7. Move to the next middleware.
 * 8. Handle any errors that occur during the process.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Object} - Returns a 401 status with an error message if authentication fails.
 */

const authenticateUser = (req, res, next) => {
  // 1. Extract the Authorization header from the request.
  const authHeader = req.headers.authorization;

  // 2. Check if the Authorization header is present and starts with "Bearer ".
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  // 3. Extract the token from the Authorization header.
  const token = authHeader.split(" ")[1];

  try {
    // 4. Decode the JWT token without verifying the signature.
    const decoded = jwt.decode(token);
    // 5. Check if the token is valid.
    if (!decoded) {
      return res.status(401).json({ error: "Invalid token" });
    }

    // 6. Attach the decoded user information to the request object.
    req.user = decoded;

    // 7. Move to the next middleware.
    next();
  } catch (error) {
    // 8. Handle any errors that occur during the process.
    console.error("JWT Error:", error.message);
    return res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = authenticateUser;
