const express = require("express");
const router = express.Router();
const { Profile, updateProfile, roleAssignment } = require("../Models/index");
const { upload, validId } = require("../Helper/index");
const {
  authentication,
  authorization,
  inputSanitizer,
  inputValidator,
  fileUpload,
  fileDelete,
} = require("../Middleware/index");
const loda = require("lodash");

// GET PROFILE DETAILS -- ANY USER
router.get("/viewProfile/:id", async (req, res) => {
  const userId = req.params.id;
  if (!validId(userId)) return res.status(400).json({ error: "Provide a valid user ID!" });
  const profile = await Profile.findById(userId)
    .select("_id name department about achievements profilePic gender")
    .populate("department", "_id name");
  if (!profile) return res.status(404).json({ error: "Profile not found!" });

  // Success scenario
  return res.status(200).json({
    message: "Profile found.",
    body: profile,
  });
});

// UPDATE PROFILE -- ANY USER
router.put(
  "/updateProfile",
  authentication,
  upload.single("profilePic"),
  inputSanitizer,
  inputValidator(updateProfile, true),
  fileUpload({ singleFile: true }),
  fileDelete,
  async (req, res) => {
    // Check if user exists
    const userId = req.user._id;
    if (!validId(userId)) {
      res.emit("deleteFiles");
      returnres.status(400).json({ error: "Provide a valid user ID!" });
    }
    const userExists = await Profile.findById(userId).select("name about achievements profilePic");
    if (!userExists) {
      res.emit("deleteFiles");
      return res.status(404).json({ error: "User not found!" });
    }

    //Check if data same also here checking profilePic because if profile pic is changed due to fileUploadMiddleware req.body will have updated profile pic
    const isEqual = loda.isEqual(
      loda.pick(req.body, ["name", "about", "achievements", "profilePic"]),
      loda.pick(userExists, ["name", "about", "achievements", "profilePic"])
    );
    if (isEqual) {
      res.emit("deleteFiles");
      return res.status(400).json({ error: "Details not updated, new information not provided!" });
    }

    // Update the profile
    const updatedProfile = await Profile.findByIdAndUpdate(userId, { $set: req.body }, { new: true }).select("profilePic");
    if (!updateProfile) {
      res.emit("deleteFiles");
      return res.status(500).json({ error: "Error updating profile!" });
    }

    // Success scenario
    req.deletableFiles = [...(req?.deletableFiles || []), ...(userExists.profilePic ? [userExists.profilePic] : [])];
    res.emit("deleteFiles", { success: true });
    return res.status(200).json({ message: "Profile updated", body: { profilePic: updatedProfile?.profilePic } });
  }
);

//ASSIGN ROLE -- ADMIN
router.post("/assignRole", authentication, authorization, inputValidator(roleAssignment), async (req, res) => {
  const userId = req.body.userId;
  if (!userId || !validId(userId)) return res.status(400).json({ error: "Provide a valid user ID!" });

  // Check if user exists
  const user = await Profile.findById(userId).select("_id name role");
  if (!user) return res.status(400).json({ error: "User does not exist!" });

  //Check if role is same
  if (user?.role === req.body?.role) return res.status(400).json({ error: `${user.name} is ${req.body.role} already.` });

  // Assign the role
  const roleAssigned = await Profile.findByIdAndUpdate(userId, { $set: { role: req.body.role, isAdmin: true } });
  if (!roleAssigned) return res.status(400).json({ error: "Error assigning role, please try again later!" });

  return res.status(200).json({
    message: `${user.name} was promoted to the role of ${req.body.role}`,
    body: {},
  });
});

//DEASSIGN ROLE -- ADMIN
router.post("/deassignRole", authentication, authorization, async (req, res) => {
  const { userId } = req.body;
  if (!userId || !validId(userId)) return res.status(400).json({ error: "Provide a valid user ID!" });

  // Check if user exists
  const user = await Profile.findById(userId).select("_id name role");
  if (!user) return res.status(400).json({ error: "User does not exist!" });

  //If role already user avoid
  if (user.role == "USER") return res.status(400).json({ error: `${user.name} dosent have any role!` });

  // Deassign the role (set role to USER)
  await Profile.findByIdAndUpdate(userId, {
    $set: { role: "USER", isAdmin: false },
  });

  return res.status(200).json({ message: `${user.name} was stripped of his role.` });
});

module.exports = router;
