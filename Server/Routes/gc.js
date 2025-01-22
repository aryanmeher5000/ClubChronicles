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
const { GC, Department, createGCRecord } = require("../Models/index");
const { upload, validId } = require("../Helper/index");

// GET GC RECORDS -- Anyone
router.get("/getGCRecords", async (req, res) => {
  const gcs = await GC.find({ isCurrent: false }).select("_id year wonBy teamPic isCurrent").populate("wonBy", "name _id");
  return res.status(200).json({ message: "GC Records found", body: gcs });
});

// CREATE CURRENT GC SESSION -- ADMIN
router.post("/createCurrentGCSession", authentication, authorization, async (req, res) => {
  const currentSession = await GC.findOne({ isCurrent: true });
  if (currentSession) return res.status(400).json({ error: "There is already a current session!" });

  const currYear = new Date().getFullYear();
  const newCurrSess = await GC.create({ year: currYear, isCurrent: true });
  if (!newCurrSess) return res.status(500).json({ error: "Error creating current session!" });

  return res.status(200).json({ message: "New current GC session created" });
});

// CREATE GC RECORD -- ADMIN
router.post(
  "/createGCRecord",
  authentication,
  authorization,
  upload.single("teamPic"),
  inputSanitizer,
  inputValidator(createGCRecord),
  fileUpload({ singleFile: true }),
  fileDelete,
  fileCleanup(),
  async (req, res) => {
    const sessionExists = await GC.findOne({ year: req.body.year });
    if (sessionExists) {
      res.status(400).json({ error: "A GC record for that year exists!" });
      res.emit("deleteFiles");
      return;
    }

    //Check if valid id
    if (!validId(req.body.wonBy)) return res.status(400).json({ error: "Provide a valid department ID!" });
    const depExists = await Department.exists({ _id: req.body.wonBy });
    if (!depExists) {
      res.status(404).json({ error: "Winning department not found!" });
      res.emit("deleteFiles");
      return;
    }

    const newSess = await GC.create(req.body);
    await Department.findByIdAndUpdate(req.body.wonBy, {
      $inc: { gcWon: 1 },
    });
    if (!newSess) {
      res.status(500).json({ error: "Error creating record!" });
      res.emit("deleteFiles");
      return;
    }

    return res.status(200).json({ message: `New GC record for year ${newSess.year} created.`, body: newSess });
  }
);

// SETTLE CURRENT GC SESSION -- ADMIN
router.post("/settleCurrentGc", authentication, authorization, upload.single("teamPic"), async (req, res) => {
  if (!req.user.isAdmin && req.user.role !== "ADMIN") return res.status(401).send("Authorization denied!");

  const currGcSess = await GC.findOne({ isCurrent: true }).select("_id timeTable year");
  if (!currGcSess) return res.status(400).send("No current GC session found to settle!");

  let teamPicPath;
  if (req.file && req.file.path) {
    const uplResp = await uploadToCloud(req.file.path);
    if (!uplResp) return res.status(500).send("Error settling current GC session!");
    teamPicPath = uplResp;
  }

  if (currGcSess.timeTable) {
    const deltresp = await deleteFromCloud(currGcSess.timeTable);
    if (!deltresp) return res.status(500).send("Error settling GC session!");
  }

  const dep = await Department.findOne({ points: { $ne: null } })
    .select("_id points")
    .sort("-points");
  if (!dep) return res.status(404).send("No department found with points!");

  const updCurrSess = await GC.findByIdAndUpdate(
    currGcSess._id,
    {
      $set: {
        isCurrent: false,
        about: req.body.about,
        wonBy: dep._id,
        teamPic: teamPicPath,
      },
    },
    { new: true }
  );

  await Department.findByIdAndUpdate(dep._id, { $inc: { gcWon: 1 } });

  return res.status(200).json({
    message: "Current session settled successfully",
    body: updCurrSess,
  });
});

// DELETE A GC SESSION -- ADMIN
router.delete("/deleteGCRecord/:id", authentication, authorization, fileDelete, async (req, res) => {
  const recordId = req.params.id;
  if (!validId(recordId)) return res.status(400).json({ error: "Provide a valid gc record ID!" });
  const sessEx = await GC.findById(recordId).select("_id teamPic");
  if (!sessEx) return res.status(404).json({ error: "Session not found!" });

  const dltSess = await GC.findByIdAndDelete(recordId);
  await Department.findByIdAndUpdate(dltSess.wonBy, { $inc: { gcWon: -1 } });
  if (!dltSess) return res.status(500).json({ error: "Error deleting GC session!" });

  req.deletableFiles = [...(req?.deletableFiles || []), ...(dltSess.teamPic ? [dltSess.teamPic] : [])];
  res.status(200).json({ message: "Session deleted.", body: dltSess });
  res.emit("deleteFiles", { success: true });
  return;
});

/*---------Time Table Routes----------*/

// GET TIME TABLE
router.get("/getTimeTable", async (req, res) => {
  const tt = await GC.findOne({ isCurrent: true }).select("timeTable");
  return res.status(200).json({ message: "Time Table", body: { timeTable: tt?.timeTable } });
});

// UPLOAD/UPDATE TIME TABLE FOR CURRENT GC -- ADMIN
router.post(
  "/uploadTimeTable",
  authentication,
  authorization,
  upload.single("timeTable"),
  fileUpload({ singleFile: true }),
  fileDelete,
  fileCleanup(),
  async (req, res) => {
    const currGcSess = await GC.findOne({ isCurrent: true }).select("_id timeTable");
    if (!currGcSess) {
      res.status(400).json({ error: "No current GC session to upload time table for, please start a session first!" });
      res.emit("deleteFiles");
      return;
    }

    if (!req.body?.timeTable) return res.status(400).json({ error: "Provide valid time table!" });
    const tt = await GC.findOneAndUpdate({ isCurrent: true }, { $set: { timeTable: req.body?.timeTable } });
    if (!tt) {
      res.json({ error: "Error uploading time table, please try again later!" });
      res.emit("deleteFiles");
      return;
    }

    req.deletableFiles = [...(req?.deletableFiles || []), ...(tt.timeTable ? [tt.timeTable] : [])];
    res.status(200).json({ message: "Time table uploaded.", body: { timeTable: tt.timeTable } });
    res.emit("deleteFiles", { success: true });
    return;
  }
);

// DELETE TIME TABLE -- ADMIN
router.delete("/deleteTimeTable", authentication, authorization, fileDelete, async (req, res) => {
  const tt = await GC.findOne({ isCurrent: true }).select("timeTable");
  if (!tt || !tt.timeTable) return res.status(400).json({ error: "No time table to delete!" });

  const updatedGC = await GC.findOneAndUpdate({ isCurrent: true }, { $unset: { timeTable: "" } }, { new: true });
  if (!updatedGC) return res.status(400).json({ error: "Error deleting Time Table!" });

  req.deletableFiles = [...(req?.deletableFiles || []), tt.timeTable];
  res.status(200).json({ message: "Time Table deleted." });
  res.emit("deleteFiles", { success: true });
  return;
});

module.exports = router;
