const mongoose = require("mongoose");
const { sports, gender, departments } = require("../Data/teamNdept");
const z = require("zod");

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    maxlength: 100,
    required: true,
  },
  motto: {
    type: String,
    minlength: 3,
    maxlength: 100,
  },
  logo: {
    type: String,
    minlength: 15,
    maxlength: 20,
  },
  description: {
    type: String,
    minlength: 3,
    maxlength: 1000,
  },
  sport: {
    type: String,
    enum: sports,
    required: true,
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Department",
    index: true,
  },
  gender: {
    type: String,
    enum: gender,
    required: true,
  },
});

const Team = mongoose.model("Team", teamSchema);

const createTeamSchema = z
  .object({
    name: z.string().min(3, "Name should be atleast 3 characters long").max(100, "Name is too long"),
    motto: z.string().min(3, "Motto should be atleast 3 characters long").max(100, "Motto is too long").optional(),
    description: z
      .string()
      .min(3, "Description should be atleast 3 characters long")
      .max(1000, "Description is too long")
      .optional(),
    department: z.string().regex(/^[a-fA-F0-9]{24}$/, "Invalid department ID"),
    sport: z.string(),
    gender: z.enum(["MALE", "FEMALE"]),
  })
  .strict();

const updateTeamSchema = z
  .object({
    name: z.string().min(3, "Name should be atleast 3 characters long").max(100, "Name is too long").optional(),
    motto: z.string().min(3, "Motto should be atleast 3 characters long").max(100, "Motto is too long").optional(),
    description: z
      .string()
      .min(3, "Description should be atleast 3 characters long")
      .max(1000, "Description is too long")
      .optional(),
  })
  .strict();

module.exports = { Team, createTeamSchema, updateTeamSchema };
