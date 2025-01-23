const express = require("express");
const router = express.Router();
const { upload, validId } = require("../Helper/index");
const {
  authentication,
  authorization,
  inputSanitizer,
  inputValidator,
  fileUpload,
  fileDelete,
  fileCleanup,
} = require("../Middleware/index");
const { Announcement, createAnnouncement } = require("../Models/index");

//CREATE ANNOUNCEMENT -- ANY isAdmin=true
router.post(
  "/createAnnouncement",
  authentication,
  authorization,
  upload.fields([
    { name: "pdf", maxCount: 1 },
    { name: "images", maxCount: 2 },
  ]),
  inputSanitizer,
  inputValidator(createAnnouncement),
  fileUpload({ multipleFields: true }),
  fileDelete,
  fileCleanup(),
  async (req, res) => {
    //Check if user exists
    const userId = req.user._id;
    if (!validId(userId)) {
      res.emit("deleteFiles");
      return res.status(404).json({ error: "User not found!" });
    }

    // Create new announcement (images and pdf will be already included here due to middleware)
    const newAnnouncement = await Announcement.create({ ...req.body, createdBy: userId });
    if (!newAnnouncement) {
      res.emit("deleteFiles");
      return res.status(500).send("Internal server error!");
    }

    return res.status(200).json({ message: "Announcement created.", body: newAnnouncement });
  }
);

//DELETE ANNOUNCEMENT -- ADMIN or Creator of Announcement
router.delete("/deleteAnnouncement/:id", authentication, authorization, fileDelete, async (req, res) => {
  // Check if announcement exists
  const anncId = req.params.id;
  if (!validId(anncId)) return res.status(404).json({ error: "Provide valid announcement ID!" });
  const announcementExists = await Announcement.findById(req.params.id).select("createdBy pdf images");
  if (!announcementExists) return res.status(404).json({ error: "Announcement not found" });

  // Check if deleter is admin or the one who created the announcement
  const { _id, role } = req.user;
  const { createdBy } = announcementExists;
  if (_id !== createdBy && role !== "ADMIN") return res.status(403).json({ error: "You cannot delete this announcement!" });

  // Delete related files on Cloud Storage
  if (announcementExists?.pdf) req.deletableFiles = [...(req?.deletableFiles || []), ...announcementExists.pdf];
  if (announcementExists?.images) req.deletableFiles = [...(req?.deletableFiles || []), ...announcementExists.images];

  // Delete the announcement
  const dltAnnc = await Announcement.findByIdAndDelete(anncId);
  if (!dltAnnc) return res.status(500).json({ error: "Error deleting announcement, please try again later!" });

  res.emit("deleteFiles", { success: true });
  return res.status(200).json({ message: "Announcement deleted successfully.", body: dltAnnc });
});

//GET OWN ANNOUNCEMENTS -- Any isAdmin=true
router.get("/ownAnnouncements", authentication, authorization, async (req, res) => {
  const userId = req.user._id;
  if (!validId(userId)) return res.status(400).json({ error: "User not found!" });
  const announcements = await Announcement.find({ createdBy: userId })
    .select("_id title department gender sport createdAt")
    .populate("department", "_id name");
  if (!announcements) return res.status(404).json({ error: "Announcemnts made by you not found!" });

  return res.status(200).json({ message: "Announcements found.", body: announcements });
});

//VIEW ANNOUNCEMENTS -- Anyone
router.get("/viewAnnouncements", async (req, res) => {
  const { sport, department, gender, pageSize = 12, page = 1 } = req.query;

  // Parse pageSize and page to integers
  const limit = Math.max(parseInt(pageSize, 10), 12);
  const currentPage = Math.max(parseInt(page, 10), 1);

  // Dynamically build the query object
  const query = {};
  if (sport) query.sport = sport;
  if (department) query.department = department;
  if (gender) query.gender = gender;

  // Fetch total announcements count
  const totalAnnouncements = await Announcement.countDocuments(query);
  const totalPages = Math.ceil(totalAnnouncements / limit);

  if (totalAnnouncements === 0 || currentPage > totalPages) {
    return res.status(200).json({
      message: "No teams found with current query, try changing query.",
      body: [],
      currentPage,
      totalPages,
    });
  }

  // Fetch the announcements with the built query, limit, and skip
  const announcements = await Announcement.find(query)
    .limit(limit)
    .skip((currentPage - 1) * limit)
    .select("_id title department gender sport createdAt")
    .populate("department", "_id name")
    .sort({ createdAt: -1 })
    .lean();

  // Return the announcements with only the desired fields
  return res.status(200).json({
    message: "Announcements found",
    body: announcements,
    currentPage,
    totalPages,
  });
});

//VIEW PARTICULAR ANNOUNCEMENT -- Anyone
router.get("/viewAnnouncement/:announcementId", async (req, res) => {
  const anncId = req.params.announcementId;
  if (!validId(anncId)) return res.status(400).json({ error: "Provide a valid announcement ID!" });
  const ann = await Announcement.findById(anncId)
    .select("_id title description department gender sport images pdf url createdAt createdBy")
    .populate("department createdBy", "_id name");
  if (!ann) return res.status(404).json({ error: "Announcement not found!" });

  return res.status(200).json({ message: "Announcement found.", body: ann });
});

module.exports = router;
