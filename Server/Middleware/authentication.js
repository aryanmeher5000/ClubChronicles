const jwt = require("jsonwebtoken");
const winston = require("winston");

function authenticationAndTokenDecoding(req, res, next) {
  // Get the token from cookies
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json({ error: "Access denied! Please login." });

  try {
    // Obtain the secret key
    const key = process.env.JWT_ACCESS_TOKEN_SECRET_KEY;

    // Verify the token
    const decoded = jwt.verify(token, key);
    req.user = decoded;
    next();
  } catch (ex) {
    if (ex.name === "TokenExpiredError") return res.status(401).json({ error: "Unknown error occurred! Please login!" });
    else if (ex.name === "JsonWebTokenError") return res.status(403).json({ message: "Invalid token." });
    else {
      winston.error(ex?.message, ex);
      return res.status(500).json({ message: "Internal server error." });
    }
  }
}

module.exports = authenticationAndTokenDecoding;
