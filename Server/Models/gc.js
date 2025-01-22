const mongoose = require("mongoose");
const z = require("zod");

const gcArchiveSchema = new mongoose.Schema({
  year: {
    type: Number,
    min: 1975,
    required: true,
  },
  wonBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
  },
  teamPic: {
    type: String,
    minlength: 15,
    maxlength: 20,
  },
  timeTable: {
    type: String,
    minlength: 15,
    maxlength: 20,
  },
  isCurrent: {
    type: Boolean,
    default: false,
  },
});

const GC = mongoose.model("GC", gcArchiveSchema);

const createGCRecord = z
  .object({
    year: z
      .union([z.number(), z.string()]) // Accept both numbers and numeric strings
      .transform((val) => Number(val)) // Ensure it is converted to a number
      .refine((year) => {
        const currYear = new Date().getFullYear();
        return year <= currYear && year > 1979;
      }, "Year cannot be in future or before 1980"),
    wonBy: z
      .string()
      .regex(/^[a-fA-F0-9]{24}$/, "Invalid department ID")
      .optional(),
  })
  .strict();

module.exports = { GC, createGCRecord };
