const { LiveMatch, Match, Department, Team, createLiveMatch } = require("../Models/index");
const { validId } = require("../Helper/index");
const { sanitizer } = require("../Middleware/inputSanitizer");
const winston = require("winston");

const roomMap = new Map();

module.exports = function (io) {
  io.on("connection", (socket) => {
    // Create a live room from upcoming match data and send initial live match data
    socket.on("createLiveMatchFromUpcomingMatch", async (data) => {
      try {
        //Check if provided ID is valid mongoDB ID
        if (!validId(data.matchId)) return socket.emit("errorCreatingRoom", "Provide a valid match ID!");

        const matchData = await Match.findById(data.matchId);
        if (!matchData) return socket.emit("errorCreatingRoom", "Upcoming match not found!");
        if (matchData.status !== "UPCOMING")
          return socket.emit(
            "errorCreatingRoom",
            `Status of this match is ${matchData.status}, cannot GoLive for this match!`
          );

        //Create a new LiveMatch using Upcoming Match's data
        const newLiveMatch = await LiveMatch.create({
          team1: matchData.team1._id,
          team2: matchData.team2._id,
          tag: matchData.tag,
          venue: matchData.venue,
          date: matchData.date,
          time: matchData.time,
          upcomingMatchId: matchData._id,
          scoreUpdater: data.userId,
          roomId: socket.id,
          gender: matchData.gender,
          sport: matchData.sport,
        });
        if (!newLiveMatch) return socket.emit("errorCreatingRoom", "Failed to create a room for this match!");

        //Create a room and join that room
        socket.join(socket.id);
        roomMap.set(socket.id, true);
        socket.emit("roomCreationSuccess", socket.id);
      } catch (err) {
        await LiveMatch.findOneAndDelete({ roomId: socket.id });
        roomMap.delete(socket.id);
        winston.error("Error creating room from upcoming match ID", err);
        socket.emit("errorCreatingRoom", err.message);
      }
    });

    // Create a live room from entered data
    socket.on("createLiveMatchFromEnteredData", async (matchData) => {
      try {
        //Check if entered data is valid
        const sanitizedMatchBody = sanitizer(matchData);
        const isValidData = createLiveMatch.safeParse(sanitizedMatchBody);
        if (!isValidData.success)
          return socket.emit("errorCreatingRoom", "Some of the data in some fields is invalid, provide valid data!");

        //Check if both teams exist
        const teamsExist = await Team.find({ _id: { $in: [matchData.team1, matchData.team2] } });
        if (!teamsExist || teamsExist?.length < 2)
          return socket.emit("errorCreatingRoom", "One or both of the teams do not exist!");

        const newLiveMatch = await LiveMatch.create({ ...sanitizedMatchBody, roomId: socket.id });
        if (!newLiveMatch) return socket.emit("errorCreatingRoom", "Failed to create new room for match!");

        socket.join(socket.id);
        roomMap.set(socket.id, true);
        socket.emit("roomCreationSuccess", socket.id);
      } catch (err) {
        await LiveMatch.findOneAndDelete({ roomId: socket.id });
        roomMap.delete(socket.id);
        winston.error("Error creating room from entered data!", err);
        socket.emit("errorCreatingRoom", err.message);
      }
    });

    //Close particular room
    socket.on("closeParticularRoom", async (data) => {
      const { roomId, winnerTeam, scoreUpdater } = data;
      if (!roomId || !winnerTeam) return socket.emit("errorClosingRoom", "Provide winning team and roomID!");
      if (!scoreUpdater) return socket.emit("errorClosingRoom", "Provide valid user ID!");

      try {
        const liveMatchData = await LiveMatch.findOne({ roomId })
          .select("team1 team2 team1Score team2Score sport gender upcomingMatchId scoreUpdater")
          .populate("team1 team2", "_id department");

        if (!liveMatchData) return socket.emit("errorClosingRoom", "Room not found!");
        if (liveMatchData?.scoreUpdater?.toString() !== scoreUpdater)
          return socket.emit("errorClosingRoom", "You are not authorized to close this room!");

        // Update match to "summary" status or create a summary entry
        const matchUpdate = {
          status: "SUMMARY",
          team1Score: liveMatchData.team1Score,
          team2Score: liveMatchData.team2Score,
          winner:
            winnerTeam === "TIE" ? undefined : winnerTeam === "TEAM1" ? liveMatchData.team1._id : liveMatchData.team2._id,
        };

        if (liveMatchData.upcomingMatchId)
          await Match.findByIdAndUpdate(liveMatchData.upcomingMatchId, { $set: matchUpdate });
        else
          await Match.create({
            ...matchUpdate,
            team1: liveMatchData.team1._id,
            team2: liveMatchData.team2._id,
            sport: liveMatchData.sport,
            gender: liveMatchData.gender,
          });

        if (matchUpdate.winner) {
          const winnerDepartment =
            matchUpdate.winner === liveMatchData.team1._id ? liveMatchData.team1.department : liveMatchData.team2.department;
          await Department.findByIdAndUpdate(winnerDepartment, { $inc: { points: 1 } });
        }
        await LiveMatch.findByIdAndDelete(liveMatchData._id);

        // Emit room closure to all clients in the room and clear room data from roomMap
        io.to(roomId).emit("roomClosing", "This room is being closed!");
        roomMap.delete(roomId);
        io.to(roomId).emit("roomClosed", "The room has been closed.");

        // Remove all sockets from the room
        io.in(roomId).socketsLeave(roomId);
      } catch (err) {
        winston.error("Error closing room with", err);
        socket.emit("errorClosingRoom", "Error closing room. Please check and retry.");
      }
    });

    //Join a particular room and get current match data of that room
    socket.on("joinParticularRoom", async (roomId) => {
      const roomExists = roomMap.has(roomId); // Check if room exists
      try {
        if (roomExists) {
          // Fetch initial data for the live match
          const data = await LiveMatch.findOne({ roomId })
            .select("_id team1 team2 roomId venue scheduledAt tag team1Score team2Score")
            .populate("team1 team2", "_id name logo");
          if (!data) return socket.emit("errorJoiningRoom", "Room with specified ID not found!");

          socket.join(roomId); // Join the socket to the room
          socket.emit("roomJoinSuccess", data); // Emit success event with initial data
        } else socket.emit("roomDNE", "Live Match has ended or does not exist!");
      } catch (error) {
        // Handle any errors that occur during the process
        winston.error("Error joining a room", error);
        socket.emit("errorJoiningRoom", error.message);
      }
    });

    // Leave a particular room
    socket.on("leaveParticularRoom", (roomId) => {
      if (roomMap.has(roomId)) return socket.leave(roomId);
      else return socket.emit("errorLeavingRoom", "Failed to leave room or room does not exist!");
    });

    // Update score
    socket.on("updateScore", async (updateData) => {
      const { scoreUpdater, roomId, team, score } = updateData;
      if (!roomId || !roomMap.has(roomId)) return socket.emit("roomDNE", "Room with given id does not exist!");
      if (!scoreUpdater || !validId(scoreUpdater)) return socket.emit("errorUpdatingScore", "Provide a valid user ID!");
      if (!team || !score) return socket.emit("errorUpdatingScore", "Provide valid team and/or score!");

      try {
        const liveMatch = await LiveMatch.findOne({ roomId }).select("_id scoreUpdater roomId");
        if (!liveMatch) return socket.emit("errorUpdatingScore", "Live match not found.");

        if (scoreUpdater.toString() !== liveMatch.scoreUpdater.toString())
          return socket.emit("errorUpdatingScore", "Unauthorized score updater!");

        const emissionData = {};
        if (team === "TEAM1") emissionData.team1Score = score;
        else if (team === "TEAM2") emissionData.team2Score = score;
        else return socket.emit("errorUpdatingScore", "Provide valid team parameter to update score for!");

        const scoreUpdated = await LiveMatch.findByIdAndUpdate(liveMatch._id, { $set: emissionData });
        if (!scoreUpdated) socket.emit("errorUpdatingScore", "Failed to update match score!");

        io.to(liveMatch.roomId).emit("updateLiveScore", emissionData);
      } catch (error) {
        winston.error("Error updating score!", error);
        socket.emit("errorUpdatingScore", "An error occurred while updating the score.");
      }
    });

    // Handle socket disconnection
    socket.on("disconnect", () => {});
  });
};
