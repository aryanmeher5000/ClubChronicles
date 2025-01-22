const express = require("express");
const router = express.Router();
const { authentication } = require("../Middleware/index");
const { Team, Department, Profile, Player } = require("../Models/index");
const { validId } = require("../Helper/index");

//GET APPLICATIONS RELATED TO PARTICULAR USERS PROFILE
router.get("/getApplications", authentication, async (req, res) => {
  const { _id, department } = req.user;
  if (!validId(_id) || !validId(department)) return res.status(400).json({ error: "Provide valid IDs!" });
  const departmentData = await Department.findById(department).select("applicationStatus");
  if (!departmentData) return res.status(404).json({ error: "Department not found." });

  // Fetch all teams related to the department
  const teams = await Team.find({ department })
    .select("_id name sport gender department logo")
    .populate("department", "_id name");

  // Fetch all applications made by the user
  const userApplications = await Player.find({ playerId: _id });

  // Build the list of teams with statuses and application IDs
  const teamsWithStatus = teams.map((team) => {
    const appliFound = userApplications?.find((appli) => appli.teamId.toString() === team._id.toString());

    return {
      _id: team._id,
      applicationId: appliFound ? appliFound._id : null,
      name: team.name,
      department: team.department,
      sport: team.sport,
      gender: team.gender,
      status: !appliFound ? "ELIGIBLE" : appliFound.role === "APPLICANT" ? "APPLIED" : "ACCEPTED",
    };
  });

  // Filter out eligible teams if the department's application status is inactive
  const filteredTeams =
    departmentData.applicationStatus === "OPEN"
      ? teamsWithStatus
      : teamsWithStatus.filter((team) => team.status !== "ELIGIBLE");

  // Respond with the final list of teams
  return res.status(200).json({ message: "Teams for application found", body: filteredTeams });
});

// APPLY FOR APPLICATION
router.post("/apply", authentication, async (req, res) => {
  const { _id } = req.user;
  const teamId = req.body.teamId;
  if (!validId(_id) || !validId(teamId)) return res.status(400).json({ error: "Provide valid IDs!" });

  // Check if user exists
  const user = await Profile.findById(_id);
  if (!user) return res.status(404).json({ error: "User not found!" });

  // Check if the user has applied to fewer than 3 teams
  const applications = await Player.find({ playerId: _id });
  if (applications.length >= 3) return res.status(400).json({ error: "A player can apply to a maximum of 3 teams!" });

  // Check if user has already applied to the same team
  const hasExistingApplication = applications.some(
    (application) => application.teamId.equals(teamId) && application.playerId.equals(_id)
  );
  if (hasExistingApplication) return res.status(400).json({ json: "You have already applied to this team!" });

  // Fetch the team details
  const teamExists = await Team.findById(teamId).select("_id name applicants players department");
  if (!teamExists) return res.status(404).json({ error: "Team not found!" });
  if (!user.department.equals(teamExists.department))
    return res.status(403).json({ error: "You cannot apply for a team in this department!" });

  // Create new application
  const newAppli = await Player.create({ playerId: user._id, teamId: teamId });
  if (!newAppli) return res.status(500).json({ error: "Failed to apply!" });

  // Success response
  return res.status(200).json({ message: `Applied for team ${teamExists.name}`, body: newAppli });
});

// UNAPPLY FROM APPLICATION
router.post("/unapply", authentication, async (req, res) => {
  const { _id } = req.user;
  const applicationId = req.body.applicationId;
  if (!validId(_id) || !validId(applicationId)) return res.status(400).json({ error: "Provide valid IDs!" });

  // Check if application exists
  const applicationEx = await Player.findById(applicationId).populate("teamId", "name");
  if (!applicationEx) return res.status(404).json({ error: "Application not found!" });

  if (applicationEx.playerId.toString() !== _id) {
    return res.status(401).json({ error: "You cannot perform this action!" });
  }

  // Delete the application
  const unApply = await Player.deleteOne({ _id: applicationId });
  if (!unApply) return res.status(400).json({ error: "Failed to unapply!" });

  // Success response
  return res.status(200).json({ message: `Unapplied from ${applicationEx.teamId.name}`, body: unApply });
});

module.exports = router;
