const mongoose = require("mongoose");
const z = require("zod");

const playerSchema = new mongoose.Schema({
  playerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Profile",
    required: true,
  },
  teamId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team",
    required: true,
  },
  role: {
    type: String,
    enum: ["CAPTAIN", "VICE_CAPTAIN", "PLAYER", "APPLICANT"],
    default: "APPLICANT",
  },
});

const Player = mongoose.model("Player", playerSchema);

const createPlayerSchema = z
  .object({
    playerId: z
      .string()
      .regex(/^[a-fA-F0-9]{24}$/, "Invalid player ID")
      .optional(),
    teamId: z
      .string()
      .regex(/^[a-fA-F0-9]{24}$/, "Invalid team ID")
      .optional(),
  })
  .strict();

module.exports = { Player, createPlayerSchema };
