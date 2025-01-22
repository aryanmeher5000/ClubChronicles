const mongoose = require("mongoose");
const z = require("zod");
const { sports, gender } = require("../Data/teamNdept");

const announcementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      minlength: 3,
      maxlength: 100,
      required: true,
    },
    description: {
      type: String,
      maxlength: 1000,
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: false,
    },
    sport: {
      type: String,
      enum: sports,
      required: false,
    },
    gender: {
      type: String,
      enum: gender,
      required: false,
    },
    images: {
      type: [{ type: String, minlength: 15, maxlength: 20, required: true }],
    },
    pdf: {
      type: [{ type: String, minlength: 15, maxlength: 20, required: true }],
    },
    url: {
      type: String,
      minlength: 5,
      maxlength: 500,
    },
    createdBy: {
      type: String,
      ref: "Profile",
      required: true,
    },
  },
  { timestamps: true }
);

const Announcement = mongoose.model("Announcement", announcementSchema);

const createAnnouncement = z
  .object({
    title: z.string().min(3, "Title should be atleast 3 characters long").max(100, "Title is too long"),
    description: z
      .string()
      .min(3, "Description should be atleast 3 characters long")
      .max(1000, "Description is too long")
      .optional(),
    department: z
      .string()
      .regex(/^[a-fA-F0-9]{24}$/, "Invalid department ID")
      .optional(),
    sport: z.string().optional(),
    gender: z.enum(["MALE", "FEMALE"]).optional(),
    url: z.string().url().optional(),
  })
  .strict();

module.exports = { Announcement, createAnnouncement };
