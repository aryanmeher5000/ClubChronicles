const { Profile, createProfile, updatePassword, updateProfile, loginSchema, roleAssignment } = require("./profile");
const { Player, createPlayerSchema } = require("./player");
const { Department, createDepartment, updateDepartment } = require("./department");
const { Announcement, createAnnouncement } = require("./announcement");
const { GC, createGCRecord } = require("./gc");
const { Match, LiveMatch, createUpcomingMatch, createLiveMatch, createMatchSummary } = require("./match");
const { Team, createTeamSchema, updateTeamSchema } = require("./team");

module.exports = {
  Profile,
  Player,
  Department,
  Announcement,
  GC,
  Match,
  LiveMatch,
  Team,
  createProfile,
  roleAssignment,
  updatePassword,
  updateProfile,
  loginSchema,
  createPlayerSchema,
  createDepartment,
  updateDepartment,
  createAnnouncement,
  createGCRecord,
  createTeamSchema,
  updateTeamSchema,
  createTeamSchema,
  createGCRecord,
  createUpcomingMatch,
  createMatchSummary,
  createLiveMatch,
};
