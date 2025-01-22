const mongoose = require("mongoose");
const { gender } = require("../Data/teamNdept");
const { z } = require("zod");

const profileSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    maxlength: 100,
    required: true,
  },
  email: {
    type: String,
    minlength: 3,
    maxlength: 100,
    required: true,
  },
  password: {
    type: String,
    minlength: 8,
    maxlength: 250,
    required: true,
  },
  profilePic: { type: String, minlength: 15, maxlength: 20 },
  about: {
    type: String,
    minlength: 3,
    maxlength: 1000,
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
    required: true,
  },
  gender: {
    type: String,
    enum: gender,
    required: true,
  },
  achievements: {
    type: String,
    minlength: 3,
    maxlength: 1000,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    enum: ["ADMIN", "DEPARTMENT_HEAD", "DEPARTMENT_SPORTS_LEAD", "HELPER", "USER"],
    default: "USER",
  },
});

const Profile = mongoose.model("Profile", profileSchema);

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .max(200, "Password is too long.")
  .refine((value) => /[A-Z]/.test(value), "Password must contain at least one uppercase letter")
  .refine((value) => /[!@#$%^&*(),.?":{}|<>]/.test(value), "Password must contain at least one special character");

const createProfile = z
  .object({
    name: z.string().min(3, "Name should be atleast 3 characters long").max(100, "Name is too long"),
    email: z.string().email("Invalid email address!").min(3).max(200),
    password: passwordSchema,
    department: z.string().regex(/^[a-fA-F0-9]{24}$/, "Invalid department ID"),
    gender: z.enum(["MALE", "FEMALE"]),
  })
  .strict();

const updateProfile = z
  .object({
    name: z.string().min(3, "Name should be atleast 3 characters long").max(100, "Name is too long").optional(),
    about: z.string().min(3, "About should be atleast 3 characters long").max(1000, "About is too long").optional(),
    achievements: z
      .string()
      .min(3, "Achievements should be atleast 3 characters long")
      .max(1000, "Achievements is too long")
      .optional(),
  })
  .strict();

const loginSchema = z
  .object({
    email: z.string().email("Provide a valid email id!").min(3).max(200),
    password: z.string().min(8, "Password is too short").max(250, "Password is too long!"),
  })
  .strict();

const updatePassword = z
  .object({
    oldPassword: z.string().min(8, "Old password is too short").max(250, "Old password is too long"),
    newPassword: passwordSchema,
  })
  .strict();

const roleAssignment = z.object({
  userId: z.string().regex(/^[a-fA-F0-9]{24}$/, "Invalid user ID"),
  role: z.enum(["DEPARTMENT_HEAD", "DEPARTMENT_SPORTS_LEAD", "HELPER"], "Provide a valid role!"),
});

module.exports = { Profile, createProfile, updateProfile, passwordSchema, loginSchema, updatePassword, roleAssignment };
