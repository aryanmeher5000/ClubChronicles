const express = require("express");
const router = express.Router();
const { Match, LiveMatch, Team, Department, createUpcomingMatch, createMatchSummary } = require("../Models/index");
const { authentication, authorization } = require("../Middleware/index");
const { inputSanitizer, inputValidator } = require("../Middleware/index");
const { validId } = require("../Helper");

async function queryBuilder(department, sport, gender) {
  const query = {};

  if (sport) query.sport = sport;
  if (gender) query.gender = gender;

  // Handle department filtering
  if (department) {
    const teams = await Team.find({ department }).select("_id");

    if (teams && teams.length) {
      const teamIds = teams.map((team) => team._id);
      query.$or = [{ team1: { $in: teamIds } }, { team2: { $in: teamIds } }];
    }
  }

  return query;
}

//CREATE AN UPCOMING MATCH - Only theAdmin and matchManager
router.post(
  "/createUpcoming",
  authentication,
  authorization,
  inputSanitizer,
  inputValidator(createUpcomingMatch),
  async (req, res) => {
    const { team1, team2 } = req.body;
    const teamsExist = await Team.find({ _id: { $in: [team1, team2] } }).countDocuments();
    if (teamsExist < 2) return res.status(404).json({ error: "One or both teams not found!" });

    const newMatch = await Match.create(req.body);

    //success scenario
    return res.status(200).json({ message: "New upcoming match created.", body: newMatch });
  }
);

//CREATE SUMMARY OF A MATCH -- ADMIN, HELPER
router.post(
  "/createSummary",
  authentication,
  authorization,
  inputSanitizer,
  inputValidator(createMatchSummary),
  async (req, res) => {
    const { team1, team2, winner } = req.body;

    // Fetch team information and ensure both teams exist
    const teams = await Team.find({ _id: { $in: [team1, team2] } }).select("_id department");
    if (teams.length < 2) return res.status(404).json({ error: "One or both teams not found!" });

    // Determine the winner's ID or set it to undefined for a tie
    const winnerId = winner === "TIE" ? undefined : winner === "TEAM1" ? team1 : team2;
    req.body.winner = winnerId;

    // Create match summary
    const newMatch = await Match.create(req.body);

    // Update the winner's department points if there is a winner
    if (winnerId) {
      const winnerTeam = teams.find((team) => team._id.toString() === winnerId);
      await Department.findByIdAndUpdate(winnerTeam.department, { $inc: { points: 1 } });
    }

    return res.status(200).json({ message: "Match summary created successfully.", body: newMatch });
  }
);

//GET UPCOMING MATCHES AND MATCHES SUMMARY -- Anyone
router.get("/getMatches/:type", async (req, res) => {
  const matchType = req.params.type;
  if (matchType !== "UPCOMING" && matchType !== "SUMMARY")
    return res.status(400).json({ error: `No matches for type : ${matchType}` });
  const { sport, department, gender, pageSize = 12, page } = req.query;

  // Parse pageSize and page to integers and validate them
  const limit = parseInt(pageSize, 10) || 12;
  const currentPage = Math.max(parseInt(page, 10), 1);

  // Build dynamic query object
  const dynamicQuery = await queryBuilder(department, sport, gender);
  dynamicQuery.status = matchType;

  // Fetch total matches count
  const totalMatches = await Match.countDocuments(dynamicQuery);
  const totalPages = Math.ceil(totalMatches / limit);

  if (currentPage > totalPages)
    return res
      .status(200)
      .json({ message: "No teams found with current query, try changing query.", body: [], currentPage, totalPages });

  //Get the data
  const matches = await Match.find(dynamicQuery)
    .limit(limit)
    .skip((currentPage - 1) * limit)
    .select("_id gender sport team1 team2 tag winner team1Score team2Score date time venue status")
    .populate("team1 team2", "_id name logo")
    .sort({ createdAt: -1 })
    .lean();
  if (!matches) return res.status(400).json({ error: "Matches not found!" });

  // Return the matches
  return res.status(200).json({
    message: "Teams found",
    body: matches,
    currentPage,
    totalPages,
  });
});

//VIEW LIVE MATCHES
router.get("/getLiveMatches", async (req, res) => {
  const { sport, department, gender, pageSize = 12, page = 1 } = req.query;

  // Parse pageSize and page to integers
  const limit = Math.max(parseInt(pageSize, 10), 12);
  const currentPage = Math.max(parseInt(page, 10), 1);

  // Build dynamic query object
  const query = await queryBuilder(department, sport, gender);

  // Fetch total matches count
  const totalMatches = await LiveMatch.countDocuments(query);
  const totalPages = Math.ceil(totalMatches / limit);

  // Fetch the matches with the built query, limit, and skip
  const matches = await LiveMatch.find(query)
    .limit(limit)
    .skip((currentPage - 1) * limit)
    .select("_id roomId name gender sport venue team1 team2 tag team1Score team2Score date time")
    .populate("team1 team2", "_id name logo")
    .sort({ createdAt: -1 })
    .lean();
  if (!matches) return res.status(400).json({ error: "Live Matches not found!" });

  // Return the matches
  return res.status(200).json({
    message: "LiveMatches found.",
    body: matches,
    currentPage,
    totalPages,
  });
});

//DELETE A UPCOMING OR MATCH SUMMARY
router.delete("/deleteMatch/:id", authentication, authorization, async (req, res) => {
  const matchId = req.params.id;
  if (!validId(matchId)) return res.status(400).json({ error: "Provide a valid match ID!" });

  // Find the match and validate existence
  const match = await Match.findById(matchId).select("_id team1 team2 winner status").populate("winner", "_id department");
  if (!match) return res.status(404).json({ error: "Match not found!" });

  // Handle points adjustment if the match is a summary and has a winner
  if (match.status === "SUMMARY" && match.winner) {
    const winnerDepartmentId = match.winner.department;
    const updatedDept = await Department.findByIdAndUpdate(winnerDepartmentId, { $inc: { points: -1 } });
    if (!updatedDept) return res.status(500).json({ error: "Error updating department points!" });
  }

  // Delete the match
  const deletedMatch = await Match.findByIdAndDelete(matchId);
  if (!deletedMatch) return res.status(500).json({ error: "Error deleting match!" });

  return res.status(200).json({ message: "Match deleted successfully.", body: deletedMatch });
});

//GET ACTIVE LIVE MATCHES FOR PARTICULAR ADMIN
router.get("/activeLiveMatches", authentication, async (req, res) => {
  const userId = req.user._id;
  if (!validId(userId)) return res.status(400).json({ error: "Provide a valid user ID!" });

  const activeLiveMatches = await LiveMatch.find({ scoreUpdater: userId })
    .select("_id roomId gender sport venue scheduledAt team1 team2 tag team1Score team2Score")
    .populate("team1 team2", "_id name logo");

  return res.status(200).json({ message: "Active live matches found", body: activeLiveMatches });
});

module.exports = router;
