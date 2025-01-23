const express = require("express");
const router = express.Router();
const { Profile, Player, Department } = require("../Models/index");
const { createProfile, loginSchema, updatePassword } = require("../Models/profile");
const { authentication, inputSanitizer, inputValidator, fileDelete } = require("../Middleware/index");
const { validId, generateAccessToken, generateRefreshToken, encryptPassword, decryptPassword } = require("../Helper/index");
const jwt = require("jsonwebtoken");
const loda = require("lodash");

// SIGNUP OR CREATE PROFILE
router.post("/signup", inputSanitizer, inputValidator(createProfile), async (req, res) => {
  // Check if user already exists
  const { email } = req.body;
  const existingProfile = await Profile.exists({ email });
  if (existingProfile) return res.status(400).json({ error: "Profile already exists. Please log in!" });

  // Encrypt password (modifies newUser if applicable)
  await encryptPassword(req.body);

  //Check if valid department
  const { department } = req.body;
  if (!department || !validId(department)) return res.status(400).json({ error: "Provide a valid department!" });
  const departmentExists = await Department.exists({ _id: department });
  if (!departmentExists) return res.status(400).json({ error: "Select a valid department!" });

  // Create user in the database
  const newProfile = await Profile.create(req.body);
  if (!newProfile) return res.status(500).json({ error: "Error creating profile, please try again later!" });

  return res.status(200).json({ message: "Account created successfully. Please log in!" });
});

// LOGIN & INITIAL TOKEN CREATION
router.post("/login", inputSanitizer, inputValidator(loginSchema), async (req, res) => {
  const { email, password } = req.body;
  const isUser = await Profile.findOne({ email }).select("_id department isAdmin role password profilePic");
  if (!isUser) return res.status(400).json({ error: "Profile not found, please signup!" });

  const passwordMatches = await decryptPassword(password, isUser.password);
  if (!passwordMatches) return res.status(400).json({ error: "Invalid email ID or password!" });

  const accessToken = generateAccessToken(isUser);
  const refreshToken = generateRefreshToken(isUser);
  if (!accessToken || !refreshToken) return res.status(500).json({ error: "Internal server error!" });

  const profile = loda.pick(isUser, ["_id", "department", "isAdmin", "role", "profilePic"]);

  return res
    .status(200)
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
    })
    .cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 2 * 60 * 60 * 1000, // 2 hour
    })
    .json({
      message: "Logged in successfully.",
      body: profile,
    });
});

// TOKEN REFRESH
router.post("/refreshToken", async (req, res) => {
  const userRefreshToken = req.cookies.refreshToken;
  if (!userRefreshToken) {
    return res
      .status(403)
      .clearCookie("accessToken", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      })
      .json({ error: "Refresh token not received or expired. Please log in!" });
  }

  try {
    const decodedRefreshToken = jwt.verify(userRefreshToken, process.env.JWT_REFRESH_TOKEN_SECRET_KEY);
    const freshAccessToken = generateAccessToken(decodedRefreshToken);

    return res
      .status(200)
      .cookie("accessToken", freshAccessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 2 * 60 * 60 * 1000, // 2 hours
      })
      .json({ message: "Access token refreshed successfully!" });
  } catch (err) {
    if (err.message === "jwt expired" || err.name === "TokenExpiredError") {
      return res
        .status(401)
        .clearCookie("refreshToken", {
          httpOnly: true,
          secure: true,
          sameSite: "none",
        })
        .clearCookie("accessToken", {
          httpOnly: true,
          secure: true,
          sameSite: "none",
        })
        .json({ error: "Session expired. Please log in!" });
    }

    return res.status(500).json({ error: "Internal server error!" });
  }
});

// LOGOUT USER
router.post("/logout", async (req, res) => {
  return res
    .status(200)
    .clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    })
    .clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    })
    .json({ message: "Logged out." });
});

// UPDATE PASSWORD
router.put("/updatePassword", authentication, inputSanitizer, inputValidator(updatePassword), async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.user._id;
  if (!validId(userId)) return res.status(400).json({ error: "Provide a valid user ID!" });
  if (oldPassword == newPassword) return res.status(400).json({ error: "NEW Password is same as the OLD Password!" });

  const isUser = await Profile.findById(userId).select("_id password");
  if (!isUser) return res.status(404).json({ error: "User not found!" });

  const passwordMatches = await decryptPassword(oldPassword, isUser.password);
  if (!passwordMatches) return res.status(400).json({ error: "Incorrect old password!" });

  // Encrypt new password before saving
  isUser.password = newPassword;
  await encryptPassword(isUser);
  await isUser.save();

  return res.status(200).json({ message: "Password updated successfully." });
});

//DELETE PROFILE
router.post("/deleteProfile", authentication, inputSanitizer, fileDelete, async (req, res) => {
  // Check if user exists
  const userId = req.user._id;
  if (!validId(userId)) return res.status(400).json({ error: "Provide a valid user ID!" });
  const isUser = await Profile.findById(userId).select("_id password profilePic");
  if (!isUser) return res.status(404).json({ error: "Profile not found!" });

  // Check if provided password matches user password
  if (!req.body.password) return res.status(400).json({ error: "Provide a valid password!" });
  if (!(await decryptPassword(req.body.password, isUser.password)))
    return res.status(400).json({ error: "Enter a valid password!" });

  // Delete profile picture
  if (isUser.profilePic) req.deletableFiles = [...(isUser.profilePic ? [isUser.profilePic] : [])];

  // Delete users applications
  const appliDeleted = await Player.deleteMany({ playerId: userId });
  if (!appliDeleted) return res.status(500).json({ error: "Error deleting profile, please try again later!" });

  // Delete user profile
  const delProfile = await Profile.findByIdAndDelete(userId);
  if (!delProfile) return res.status(500).json({ error: "Error deleting profile!" });

  // Clear cookies and send response and emit event to delete files
  res
    .status(200)
    .clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    })
    .clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    })
    .json({ message: "Account deleted successfully!" });
  res.emit("deleteFiles", { success: true });
  return;
});

module.exports = router;
