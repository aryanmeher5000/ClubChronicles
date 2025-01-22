const express = require("express");
const router = express.Router();
const {
  authentication,
  authorization,
  inputSanitizer,
  inputValidator,
  fileUpload,
  fileDelete,
  fileCleanup,
} = require("../Middleware/index");
const { upload, validId } = require("../Helper/index");
const { Department, Team, Announcement, Player, createDepartment, updateDepartment } = require("../Models/index");
const loda = require("lodash");

//CREATE DEPARTMENT -- ADMIN
router.post(
  "/createDepartment",
  authentication,
  authorization,
  upload.single("logo"),
  inputSanitizer,
  inputValidator(createDepartment),
  fileUpload({ singleFile: true }),
  fileDelete,
  fileCleanup(),
  async (req, res) => {
    //Create department
    const newDepartment = await Department.create(req.body);
    if (!newDepartment) {
      res.status(500).json({ error: "Error creating department!" });
      res.emit("deleteFiles");
      return;
    }

    return res.status(200).json({ message: `${dep.name} created successfully.`, body: newDepartment });
  }
);

//UPDATE DEPARTMENT -- ADMIN or DEPARTMENT_HEAD or DEPARTMENT_SPORTS_LEAD
router.put(
  "/updateDepartment/:id",
  authentication,
  authorization,
  upload.single("logo"),
  inputSanitizer,
  inputValidator(updateDepartment),
  fileUpload({ singleFile: true }),
  fileDelete,
  fileCleanup(),
  async (req, res) => {
    const depId = req.params.id;
    if (!validId(depId)) return res.status(400).json({ error: "Provide a valid department ID!" });
    const depEx = await Department.findById(depId).select("name logo about");
    if (!depEx) {
      res.status(404).json({ error: "Department does not exist!" });
      res.emit("deleteFiles");
      return;
    }

    //Check if some data has changed (if logo changed will be included here)
    const isEqual = loda.isEqual(
      loda.pick(req.body, ["name", "about", "logo"]),
      loda.pick(depEx, ["name", "about", "logo"])
    );
    if (isEqual) {
      res.status(400).json({ error: "Details not updated, new details not provided!" });
      res.emit("deleteFiles");
      return;
    }

    const updDep = await Department.findByIdAndUpdate(depId, { $set: req.body }, { new: true });
    if (!updDep) {
      res.status(500).json({ error: "Failed to update department details." });
      res.emit("deleteFiles");
      return;
    }

    req.deletableFiles = [...(req?.deletableFiles || []), ...(depEx.logo ? [depEx.logo] : [])];
    res.status(200).json({
      message: `Department details of ${depEx.name} updated successfully.`,
      body: updDep,
    });
    res.emit("deleteFiles", { success: true });
    return;
  }
);

//DELETE DEPARTMENT -- ADMIN
router.delete("/deleteDepartment/:id", authentication, authorization, fileDelete, async (req, res) => {
  // Validate department ID
  const depId = req.params.id;
  if (!validId(depId)) return res.status(400).json({ error: "Provide a valid department ID!" });

  // Check if the department exists
  const departmentExists = await Department.findById(depId);
  if (!departmentExists) return res.status(404).json({ error: "Department not found!" });

  // Initialize deletable files
  req.deletableFiles = req.deletableFiles || [];

  // Fetch related teams and announcements
  const teams = await Team.find({ department: depId });
  const announcements = await Announcement.find({ department: depId });

  // Collect team logos
  const teamLogoIdMap = teams.map((team) => team?.logo).filter(Boolean);
  req.deletableFiles.push(...teamLogoIdMap);

  // Collect announcement files
  announcements.forEach((annc) => {
    if (annc.pdf) req.deletableFiles.push(annc.pdf);
    if (annc.images && Array.isArray(annc.images)) req.deletableFiles.push(...annc.images);
  });

  // Add department logo to deletable files
  if (departmentExists.logo) req.deletableFiles.push(departmentExists.logo);

  // Collect team IDs for player deletion
  const teamIdMap = teams.map((team) => team._id);

  // Delete related data
  await Announcement.deleteMany({ department: depId });
  await Team.deleteMany({ department: depId });
  await Player.deleteMany({ teamId: { $in: teamIdMap } });
  await Department.findByIdAndDelete(depId);

  // Upon succcess send response and delete files
  res.status(200).json({ message: "Department and associated data deleted successfully." });
  res.emit("deleteFiles", { success: true });
  return;
});

//GET DEPARTMENTS -- Anyone -- Get list of departments
router.get("/departments", async (req, res) => {
  const dep = await Department.find().select("_id name logo");

  //Return departments
  return res.status(200).json({ message: "Departments Found.", body: dep });
});

//VIEW PARTICULAR DEPARTMENT -- Anyone
router.get("/departments/:id", async (req, res) => {
  if (!validId(req.params.id)) return res.status(400).json({ error: "Provide a valid department ID!" });
  const department = await Department.findById(req.params.id).select("_id name gcWon sportsLead logo about");
  if (!department) return res.status(404).json({ error: "Department not found!" });

  return res.status(200).json({ message: "Department Found.", body: department });
});

//CHECK APPLICATIONS STATUS -- ADMIN, DEPARTMENT_SPORTS_LEAD, DEPARTMENT_HEAD
router.get("/checkAppliStatus", authentication, authorization, async (req, res) => {
  const { department } = req.user;
  if (!validId(department)) return res.status(400).json({ error: "Provide a valid department ID!" });

  const stat = await Department.findById(department).select("applicationStatus");

  return res.status(200).json({
    message: "Application Status Found.",
    body: { applicationStatus: stat.applicationStatus },
  });
});

//START APPLICATIONS FOR DEPARTMENT -- DEPARTMENT_SPORTS_LEAD, DEPARTMENT_HEAD
router.post("/startApplications", authentication, authorization, async (req, res) => {
  const { department } = req.user;
  if (!validId(department)) return res.status(400).json({ error: "Provide a valid department ID!" });

  //Make status online
  const dep = await Department.findByIdAndUpdate(department, { $set: { applicationStatus: "OPEN" } });
  if (!dep) return res.status(400).json({ error: "Error updating application status!" });

  return res.status(200).json({ message: `Applications for ${dep.name} started.` });
});

//STOP APPLICATIONS FOR DEPARTMENT -- DEPARTMENT_SPORTS_LEAD, DEPARTMENT_HEAD
router.post("/stopApplications", authentication, authorization, async (req, res) => {
  const { department } = req.user;
  if (!validId(department)) return res.status(400).json({ message: "Provide a valid department ID!" });

  //Make status offline
  const dep = await Department.findByIdAndUpdate(department, { $set: { applicationStatus: "CLOSED" } });
  if (!dep) return res.status(400).json({ error: "Error updating application status!" });

  return res.status(200).json({ message: `Applications for ${dep.name} closed.` });
});

module.exports = router;
