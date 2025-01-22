const mongoose = require("mongoose");
const z = require("zod");

const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    maxlength: 100,
    required: true,
  },
  about: {
    type: String,
    minlength: 3,
    maxlength: 1000,
  },
  logo: {
    type: String,
    minlength: 15,
    maxlength: 20,
  },
  points: {
    type: Number,
    default: 0,
  },
  applicationStatus: {
    type: String,
    enum: ["OPEN", "CLOSED"],
    default: "CLOSED",
  },
  gcWon: {
    type: Number,
    default: 0,
  },
});

const Department = mongoose.model("Department", departmentSchema);

const createDepartment = z
  .object({
    name: z.string().min(3, "Department Name should be atleast 3 characters long!").max(100, "Department name is too long!"),
    about: z.string().min(3, "About should be atleast 3 characters long!").max(1000, "About is too long!").optional(),
  })
  .strict();

const updateDepartment = z
  .object({
    name: z
      .string()
      .min(3, "Department Name should be atleast 3 characters long!")
      .max(100, "Department name is too long!")
      .optional(),
    about: z.string().min(3, "About should be atleast 3 characters long!").max(500, "About is too long!").optional(),
  })
  .strict();

module.exports = { Department, createDepartment, updateDepartment };
