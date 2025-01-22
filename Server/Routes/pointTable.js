const express = require("express");
const router = express.Router();
const { Department, Match, Team } = require("../Models/index");
const { authentication, authorization } = require("../Middleware/index");
const { validId } = require("../Helper/index");

router.get("/", async (req, res) => {
  const pointTable = await Department.find().select("_id name points logo");

  return res.status(200).json({ message: "Point Table found.", body: pointTable });
});

router.get("/particularDepartment/:deptId", async (req, res) => {
  //Check if valid id
  const depId = req.params.deptId;
  if (!validId(depId)) return res.status(400).json({ error: "Provide a valid department ID!" });
  // Find the team related to particular department and sport
  const teams = await Team.find({
    department: depId,
    sport: req.query.sport || "CRICKET",
  }).select("_id");

  if (teams && teams.length === 0)
    return res.status(200).json({
      message: "Teams are yet to be declared for this sport.",
      body: [],
    });

  // Find the matches related to the teams
  const partDeptPointTable = await Match.find({
    status: "SUMMARY",
    sport: req.query.sport || "CRICKET",
    $or: [{ team1: { $in: teams } }, { team2: { $in: teams } }],
  })
    .select("_id team1 team2 winner createdAt")
    .populate("team1 team2", "_id name department")
    .sort({ createdAt: -1 });

  return res.status(200).json({
    message: "Point table for particular department.",
    body: {
      deptTeams: teams.map((k) => k._id),
      deptMatches: partDeptPointTable,
    },
  });
});

//POINT TABLE UPDATION
router.put("/updatePointTable/:depId", authentication, authorization, async (req, res) => {
  const depId = req.params.depId;
  if (!validId(depId)) return res.status(400).json({ error: "Provide a valid department ID!" });
  const department = await Department.findByIdAndUpdate(
    depId,
    { $set: { points: parseInt(req.body.points) } },
    { new: true }
  );
  if (!department) return res.status(404).json({ error: "Department not found!" });

  return res.status(200).json({ message: "Points updated successfully." });
});

module.exports = router;
