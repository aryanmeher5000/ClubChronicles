const mongoose = require("mongoose");
const { sports, gender } = require("../Data/teamNdept");
const z = require("zod");

const matchSchema = new mongoose.Schema(
  {
    team1: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },
    team2: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },
    sport: {
      type: String,
      enum: sports,
      required: true,
    },
    gender: {
      type: String,
      enum: gender,
      required: true,
    },
    status: {
      type: String,
      enum: ["UPCOMING", "SUMMARY"],
      required: true,
    },
    tag: {
      type: String,
      enum: ["FINAL", "SEMI_FINAL", "QUARTER_FINAL", "DO_OR_DIE"],
    },
    venue: {
      type: String,
      minlength: 3,
      maxlength: 100,
    },
    date: { type: Date },
    time: { type: String },
    team1Score: { type: String },
    team2Score: { type: String },
    winner: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
  },
  { timestamps: true }
);

const Match = mongoose.model("Match", matchSchema);

const liveMatchSchema = new mongoose.Schema(
  {
    team1: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },
    team2: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },
    sport: {
      type: String,
      enum: sports,
      required: true,
    },
    gender: {
      type: String,
      enum: gender,
      required: true,
    },
    team1Score: {
      type: String,
      default: "0",
      required: true,
    },
    team2Score: {
      type: String,
      default: "0",
      required: true,
    },
    tag: {
      type: String,
      enum: ["FINAL", "SEMI_FINAL", "QUARTER_FINAL", "DO_OR_DIE"],
    },
    venue: {
      type: String,
      minlength: 3,
      maxlength: 100,
    },
    date: { type: Date },
    time: { type: String },
    upcomingMatchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Match",
    },
    scoreUpdater: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile",
      required: true,
    },
    roomId: {
      type: String,
      minlength: 3,
      maxlength: 50,
    },
  },
  { timestamps: true }
);

const LiveMatch = mongoose.model("LiveMatch", liveMatchSchema);

const createUpcomingMatch = z
  .object({
    team1: z.string().regex(/^[a-fA-F0-9]{24}$/, "Invalid team ID"),
    team2: z
      .string()
      .regex(/^[a-fA-F0-9]{24}$/, "Invalid team ID")
      .refine((value) => {
        if (value !== this.team1) return true;
        return false;
      }),
    sport: z.enum([
      "CRICKET",
      "FOOTBALL",
      "VOLLEYBALL",
      "BASKETBALL",
      "CHESS",
      "CARROM",
      "TABLE_TENNIS",
      "BADMINTON",
      "KABBADI",
      "TUG_OF_WAR",
      "SHOTPUT",
    ]),
    gender: z.enum(["MALE", "FEMALE"]),
    venue: z.string().max(100).optional(),
    date: z.string().date().optional(),
    time: z.string().optional(),
    tag: z.enum(["FINAL", "SEMI_FINAL", "QUARTER_FINAL", "DO_OR_DIE"]).optional(),
    status: z.enum(["UPCOMING", "SUMMARY"]).default("UPCOMING"),
  })
  .strict();

const createMatchSummary = z
  .object({
    team1: z.string().regex(/^[a-fA-F0-9]{24}$/, "Invalid team ID"),
    team2: z
      .string()
      .regex(/^[a-fA-F0-9]{24}$/, "Invalid team ID")
      .refine((value) => {
        if (value !== this.team1) return true;
        return false;
      }),
    winner: z.enum(["TEAM1", "TEAM2", "TIE"]),
    team1Score: z.number().min(0).max(1000).optional(),
    team2Score: z.number().min(0).max(1000).optional(),
    sport: z.enum([
      "CRICKET",
      "FOOTBALL",
      "VOLLEYBALL",
      "BASKETBALL",
      "CHESS",
      "CARROM",
      "TABLE_TENNIS",
      "BADMINTON",
      "KABBADI",
      "TUG_OF_WAR",
      "SHOTPUT",
    ]),
    gender: z.enum(["MALE", "FEMALE"]),
    tag: z.enum(["FINAL", "SEMI_FINAL", "QUARTER_FINAL", "DO_OR_DIE"]).optional(),
    description: z.string().min(3).max(1000).optional(),
    status: z.enum(["UPCOMING", "SUMMARY"]).default("SUMMARY"),
  })
  .strict();

const createLiveMatch = z
  .object({
    team1: z.string().regex(/^[a-fA-F0-9]{24}$/, "Invalid team ID"),
    team2: z.string().regex(/^[a-fA-F0-9]{24}$/, "Invalid team ID"),
    sport: z.enum([
      "CRICKET",
      "FOOTBALL",
      "VOLLEYBALL",
      "BASKETBALL",
      "CHESS",
      "CARROM",
      "TABLE_TENNIS",
      "BADMINTON",
      "KABBADI",
      "TUG_OF_WAR",
      "SHOTPUT",
    ]),
    gender: z.enum(["MALE", "FEMALE"]),
    tag: z.enum(["FINAL", "SEMI_FINAL", "QUARTER_FINAL", "DO_OR_DIE"]).optional(),
    scoreUpdater: z.string().regex(/^[a-fA-F0-9]{24}$/, "Invalid user/helper ID"),
    venue: z.string().min(3).max(100).optional(),
  })
  .strict();

module.exports = { Match, LiveMatch, createUpcomingMatch, createLiveMatch, createMatchSummary };
