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
const { Team, Match, Player } = require("../Models/index");
const { createTeamSchema, updateTeamSchema } = require("../Models/team");
const { upload, validId } = require("../Helper/index");
const loda = require("lodash");

//CREATE TEAM-- ADMIN, DEPARTMENT_SPORTS_HEAD, DEPARTMENT_SPORTS_LEAD
router.post(
  "/createTeam",
  authentication,
  authorization,
  upload.single("logo"),
  inputSanitizer,
  inputValidator(createTeamSchema),
  fileUpload({ singleFile: true }),
  fileDelete,
  fileCleanup(),
  async (req, res) => {
    const { department } = req.user;
    if (!validId(department)) {
      res.status(400).json({ error: "Provide a valid department ID!" });
      res.emit("deleteFiles");
      return;
    }

    //Check the department of user and team being created
    if (department !== req.body.department) {
      res.status(403).json({ error: "You cannot create team for this department!" });
      res.emit("deleteFiles");
      return;
    }

    // Check if a team with the same name already exists
    const teamExists = await Team.findOne({ name: req.body.name });
    if (teamExists) {
      res.status(400).json({ error: "Team with the same name already exists!" });
      res.emit("deleteFiles");
      return;
    }

    // Create and save the new team using Team.create()
    const createTeam = await Team.create(req.body);
    if (!createTeam) {
      res.status(500).json({ message: "Error creating team!" });
      res.emit("deleteFiles");
      return;
    }

    return res.status(200).json({ message: "Team created.", body: createTeam });
  }
);

//UPDATE TEAM - ADMIN, DEPARTMENT_SPORTS_HEAD, DEPARTMENT_SPORTS_LEAD
router.put(
  "/updateTeam/:teamId",
  authentication,
  authorization,
  upload.single("logo"),
  inputSanitizer,
  inputValidator(updateTeamSchema),
  fileUpload({ singleFile: true }),
  fileDelete,
  fileCleanup(),
  async (req, res) => {
    const { teamId } = req.params;
    if (!validId(teamId)) {
      res.status(400).json({ error: "Provide a valid team ID!" });
      res.emit("deleteFiles");
      return;
    }

    // Check if team exists
    const teamExists = await Team.findById(teamId).select("name description motto logo");
    if (!teamExists) {
      res.status(404).json({ message: "Team not found!" });
      res.emit("deleteFiles");
      return;
    }

    //Check if fields are same
    const isEqual = loda.isEqual(
      loda.pick(req.body, ["name", "description", "motto", "logo"]),
      loda.pick(teamExists, ["name", "description", "motto", "logo"])
    );
    if (isEqual) {
      res.status(400).json({ error: "Team deatails not updated! New details not provided!" });
      res.emit("deleteFiles");
      return;
    }

    // Update team details
    const updTeam = await Team.findByIdAndUpdate(teamId, { $set: req.body }, { runValidators: true });
    if (!updTeam) {
      res.status(500).json({ error: "Error updating team details, please try again later!" });
      res.emit("deleteFiles");
      return;
    }

    req.deletableFiles = [...(req?.deletableFiles || []), ...(teamExists.logo ? [teamExists.logo] : [])];
    res.status(200).json({ message: "Details updated." });
    res.emit("deletableFiles", { success: true });
    return;
  }
);

//DELETE TEAM -- ADMIN, DEPARTMENT_SPORTS_HEAD, DEPARTMENT_SPORTS_LEAD
router.delete("/deleteTeam/:teamId", authentication, authorization, fileDelete, async (req, res) => {
  //Verify team existance
  const { teamId } = req.params;
  if (!validId(teamId)) return res.status(400).json({ error: "Provide valid team ID!" });
  const teamToBeDeleted = await Team.findById(teamId).select("_id department logo");
  if (!teamToBeDeleted) return res.status(404).json({ error: "Team not found!" });

  //Check if admins and teams  department match
  if (req.user.department != teamToBeDeleted.department)
    return res.status(403).json({ error: "You cannot delete team of this department!" });

  //delete logo from drive
  req.deletableFiles = [...(req?.deletableFiles || []), ...(teamToBeDeleted.logo ? [teamToBeDeleted?.logo] : [])];

  await Match.deleteMany({ $or: [{ team1: teamToBeDeleted._id }, { team2: teamToBeDeleted._id }] });
  await Player.deleteMany({ teamId });
  await Team.findByIdAndDelete(teamId);

  res.status(200).json({ message: "Team deleted.", body: teamDeleted });
  res.emit("deleteFiles", { success: true });
  return;
});

//FETCH DATA FOR teamUpdandDel cards
router.get("/updateCardDetails", authentication, authorization, async (req, res) => {
  // Fetch the team details
  const { department } = req.user;
  if (!validId(department)) return res.status(400).json({ error: "Provide valid department ID!" });

  const teamDetails = await Team.find({ department })
    .select("_id name department sport gender logo")
    .populate("department", "_id name");
  if (!teamDetails) return res.status(404).json({ error: "No teams found for this department." });

  return res.status(200).json({ message: "Details found.", body: teamDetails });
});

// FETCH APPLICANTS AND PLAYERS
router.get("/getAppliPlayers/:teamId", authentication, authorization, async (req, res) => {
  const { teamId } = req.params;

  if (!teamId) {
    return res.status(400).json({ message: "Team ID is required" });
  }

  const relatedPlayers = await Player.find({ teamId })
    .select("playerId role")
    .populate("playerId", "_id name profilePic")
    .lean();

  const result = {
    applicants: [],
    players: [],
    captain: null,
    viceCaptain: null,
  };

  if (!relatedPlayers || relatedPlayers.length === 0) return res.status(200).json({ message: "Applicants", body: result });

  relatedPlayers.forEach((player) => {
    const { role, playerId } = player;

    if (role === "APPLICANT") {
      result.applicants.push(playerId);
    } else if (role === "CAPTAIN") {
      result.captain = playerId;
      result.players.push(playerId);
    } else if (role === "VICE_CAPTAIN") {
      result.viceCaptain = playerId;
      result.players.push(playerId);
    } else {
      result.players.push(playerId);
    }
  });

  // Return categorized data
  return res.status(200).json({ message: "Applicants and players found", body: result });
});

//UPDATE TEAM PLAYERS
router.put("/updateTeamPlayers/:teamId", authentication, authorization, inputSanitizer, async (req, res) => {
  const teamId = req.params.teamId;
  if (!validId) return res.status(400).json({ error: "Provide a valid team ID!" });

  // Validate team existence
  const teamExists = await Team.exists({ _id: teamId });
  if (!teamExists) return res.status(404).json({ error: "Team not found!" });

  // Fetch all players in the team
  const { addedPlayers, removedPlayers, captain, viceCaptain } = req.body;
  const allPlayers = await Player.find({ teamId }).select("_id playerId role");

  // Validate `addedPlayers` and `removedPlayers`
  const invalidAddedPlayers = addedPlayers.filter((player) => !allPlayers.some((p) => p.playerId.toString() === player._id));
  if (invalidAddedPlayers.length > 0) return res.status(400).json({ error: "Invalid player ID's detected!" });

  // Bulk update roles for added and removed players
  const updateOperations = [];
  if (addedPlayers.length > 0) {
    updateOperations.push(
      Player.updateMany({ playerId: { $in: addedPlayers }, teamId: teamId }, { $set: { role: "PLAYER" } })
    );
  }
  if (removedPlayers.length > 0) {
    updateOperations.push(
      Player.updateMany({ playerId: { $in: removedPlayers }, teamId: teamId }, { $set: { role: "APPLICANT" } })
    );
  }
  await Promise.all(updateOperations);

  const assignRole = async (role, newPlayerId) => {
    // Handle role removal (NOTA or removal via removedPlayers)
    const currentRolePlayer = await Player.findOne({
      teamId: teamId,
      role: role,
    });

    if (newPlayerId === "NOTA" && currentRolePlayer) {
      await Player.findByIdAndUpdate(currentRolePlayer._id, {
        $set: { role: "PLAYER" },
      });
    } else if (newPlayerId !== "NOTA" && (!currentRolePlayer || currentRolePlayer.playerId.toString() !== newPlayerId)) {
      //Verify new player
      const newPlayerExists = await Player.findOne({
        teamId: teamId,
        playerId: newPlayerId,
        role: { $ne: "APPLICANT" },
      });
      if (!newPlayerExists) return res.status(400).send("Captain candidate is not eligible!");

      if (currentRolePlayer)
        await Player.updateOne(
          { _id: currentRolePlayer._id },
          {
            $set: { role: "PLAYER" },
          }
        );

      await Player.updateOne(
        { _id: newPlayerExists._id },
        {
          $set: { role: role },
        }
      );
    }
  };

  // Assign roles: CAPTAIN and VICE_CAPTAIN
  if (captain) assignRole("CAPTAIN", captain);
  if (viceCaptain) assignRole("VICE_CAPTAIN", viceCaptain);

  res.status(200).json({ message: "Team players updated successfully" });
});

//VIEW TEAMS -- Anyone -- DNT
router.get("/viewTeams", async (req, res) => {
  const { sport, department, gender, pageSize = 12, page = 1 } = req.query;
  if (department && !validId(department)) return res.status(400).json({ error: "Provide a valid department ID!" });

  const query = {};
  if (sport) query.sport = sport;
  if (department) query.department = department;
  if (gender) query.gender = gender;

  const limit = Math.max(parseInt(pageSize, 10), 1);
  const currentPage = Math.max(parseInt(page, 10), 1);

  const totalTeams = await Team.countDocuments(query);
  const totalPages = Math.ceil(totalTeams / limit);

  if (totalTeams === 0 || currentPage > totalPages) {
    return res.status(200).json({
      message: "No teams found with current query.",
      body: [],
      currentPage,
      totalPages,
    });
  }

  const teams = await Team.find(query)
    .limit(limit)
    .skip((currentPage - 1) * limit)
    .select("_id name department gender sport logo")
    .populate("department", "_id name")
    .lean();
  if (!teams) return res.status(500).json({ error: "Internal server error!" });

  return res.status(200).json({
    message: "Teams Found",
    body: teams,
    currentPage,
    totalPages,
  });
});

//VIEW PARTICULAR TEAM -- Anyone
router.get("/viewTeam/:teamId", async (req, res) => {
  const teamId = req.params.teamId;
  if (!validId(teamId)) return res.status(400).json({ error: "Provide a valid team ID!" });

  // Fetch team details
  const teamDetails = await Team.findById(teamId)
    .select("_id name department sport gender motto logo")
    .populate("department", "_id name")
    .lean();
  if (!teamDetails) return res.status(404).json({ error: "Team not found!" });

  // Fetch players, captain, and vice-captain in one query
  const playersData = await Player.find({ teamId, role: { $ne: "APPLICANT" } })
    .select("playerId role")
    .populate("playerId", "_id name profilePic");

  // Construct response object
  const response = { ...teamDetails };
  response.players = playersData.map((player) => {
    if (player.role === "CAPTAIN") response.captain = player.playerId;
    if (player.role === "VICE_CAPTAIN") response.viceCaptain = player.playerId;
    return player.playerId;
  });
  return res.status(200).json({ message: "Team found.", body: response });
});

//FETCH TEAM FOR MATCHMAKING
router.get("/getTeamsMatch", authentication, authorization, async (req, res) => {
  const { sport, gender } = req.query;

  // Dynamically build the query object
  const query = {};
  if (sport) query.sport = sport;
  if (gender) query.gender = gender;

  // Fetch the teams with the built query, limit, and skip
  const teams = await Team.find(query).select("_id name");
  if (!teams) return res.json({ error: "No teams found for current query!" });

  // Return the teams with only the desired fields
  return res.status(200).json({ message: "Teams found.", body: teams });
});

module.exports = router;
