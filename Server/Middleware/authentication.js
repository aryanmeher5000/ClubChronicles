const jwt = require("jsonwebtoken");
const winston = require("winston");

function authenticationAndTokenDecoding(req, res, next) {
  // Get the token from cookies
  const token = req.cookies.accessToken;

  // Early return if no token
  if (!token) {
    return res.status(401).json({ error: "Access denied! Please login." });
  }

  try {
    // Obtain the secret key
    const key = process.env.JWT_ACCESS_TOKEN_SECRET_KEY;

    // Verify the token
    const decoded = jwt.verify(token, key);
    req.user = decoded;
    next();
  } catch (ex) {
    // Use a single response handling approach
    let statusCode = 500;
    let errorMessage = "Internal server error.";

    if (ex.name === "TokenExpiredError") {
      statusCode = 401;
      errorMessage = "Unknown error occurred! Please login!";
    } else if (ex.name === "JsonWebTokenError") {
      statusCode = 403;
      errorMessage = "Invalid token.";
    }

    // Log the error
    winston.error(ex?.message, ex);

    // Send a single response
    return res.status(statusCode).json({ error: errorMessage });
  }
}

module.exports = authenticationAndTokenDecoding;
