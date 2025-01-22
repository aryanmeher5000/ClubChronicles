const jwt = require("jsonwebtoken");

// Function to generate JWT access token
function generateAccessToken(userObj) {
  const key = process.env.JWT_ACCESS_TOKEN_SECRET_KEY;
  return jwt.sign(
    {
      _id: userObj._id,
      department: userObj.department,
      isAdmin: userObj.isAdmin,
      role: userObj.role,
    },
    key,
    { expiresIn: "2h" }
  );
}

// Function to generate refresh token
function generateRefreshToken(userObj) {
  const key = process.env.JWT_REFRESH_TOKEN_SECRET_KEY;
  return jwt.sign(
    {
      _id: userObj._id,
      department: userObj.department,
      isAdmin: userObj.isAdmin,
      role: userObj.role,
    },
    key,
    { expiresIn: "15d" }
  );
}

module.exports = { generateAccessToken, generateRefreshToken };
