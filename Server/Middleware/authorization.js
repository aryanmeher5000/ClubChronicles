//Role to endpoints map simplifies authorization based on role
const roleToAccesibleEndpointsMap = {
  ADMIN: [
    "/createAnnouncement",
    "/deleteAnnouncement",
    "/ownAnnouncements",
    "/createDepartment",
    "/updateDepartment",
    "/deleteDepartment",
    "/createCurrentGCSession",
    "/createGCRecord",
    "/deleteGCRecord",
    "/uploadTimeTable",
    "/deleteTimeTable",
    "/updatePointTable",
    "/createUpcoming",
    "/createSummary",
    "/deleteMatch",
    "/updateProfile",
    "/deleteProfile",
    "/assignRole",
    "/deassignRole",
    "/createTeam",
    "/updateTeam",
    "/deleteTeam",
    "/getAppliPlayers",
    "/updateTeamPlayers",
    "/getTeamsMatch",
    "/updateCardDetails",
  ],
  DEPARTMENT_SPORTS_LEAD: [
    "/createAnnouncement",
    "/deleteAnnouncement",
    "/ownAnnouncements",
    "/checkAppliStatus",
    "/updateDepartment",
    "/startApplications",
    "/stopApplications",
    "/updateProfile",
    "/deleteProfile",
    "/createTeam",
    "/updateTeam",
    "/deleteTeam",
    "/getAppliPlayers",
    "/updateTeamPlayers",
    "/updateCardDetails",
  ],
  DEPARTMENT_HEAD: [
    "/createAnnouncement",
    "/deleteAnnouncement",
    "/ownAnnouncements",
    "/checkAppliStatus",
    "/updateDepartment",
    "/startApplications",
    "/stopApplications",
    "/updateProfile",
    "/deleteProfile",
    "/createTeam",
    "/updateTeam",
    "/deleteTeam",
    "/getAppliPlayers",
    "/updateTeamPlayers",
    "/updateCardDetails",
  ],
  HELPER: [
    "/createAnnouncement",
    "/createUpcoming",
    "/deleteMatch",
    "/updateProfile",
    "/deleteProfile",
    "/getTeamsMatch",
    "/ownAnnouncements",
    "/deleteAnnouncement",
  ],
  USER: ["/updateProfile", "/deleteProfile"],
};

function authorizationMiddleware(req, res, next) {
  // Check if user is authenticated
  if (!req.user) return res.status(401).json({ error: "Authorization denied! Login first." });

  // Clip parameter if any
  const fullPath = req.route?.path || "";
  const endpointWithoutId = fullPath.replace(/\/:[^/]+$/, "");
  const userRole = req.user.role;

  // Verify role has access to endpoint
  const accessibleEndpoints = roleToAccesibleEndpointsMap[userRole];
  if (!accessibleEndpoints || !accessibleEndpoints.includes(endpointWithoutId)) {
    return res.status(403).json({ error: "Authorization denied! You cannot access this path." });
  }

  next();
}

module.exports = authorizationMiddleware;
