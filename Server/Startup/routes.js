const {
  authentication,
  application,
  profile,
  team,
  announcement,
  match,
  department,
  gc,
  pointTable,
} = require("../Routes/index");

module.exports = function (app) {
  app.use("/api/ClubChronicles/authentication", authentication);
  app.use("/api/ClubChronicles/profile", profile);
  app.use("/api/ClubChronicles/application", application);
  app.use("/api/ClubChronicles/team", team);
  app.use("/api/ClubChronicles/announcement", announcement);
  app.use("/api/ClubChronicles/match", match);
  app.use("/api/ClubChronicles/department", department);
  app.use("/api/ClubChronicles/gc", gc);
  app.use("/api/ClubChronicles/pointsTable", pointTable);
};
