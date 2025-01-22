import { z } from "zod";
import { authApiClient } from "../../apiClient";
import { usePostQuery } from "../../ReusableQueryFunctions";

export const signupSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").max(100, "Name is too long"),
  email: z.string().email("Invalid email address").min(3).max(200),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(200, "Password is too long.")
    .refine((value) => /[A-Z]/.test(value), "Password must contain at least one uppercase letter")
    .refine((value) => /[!@#$%^&*(),.?":{}|<>]/.test(value), "Password must contain at least one special character"),
  department: z.string().length(24),
  gender: z.enum(["MALE", "FEMALE"]),
});

export type SignupFormData = z.infer<typeof signupSchema>;

export default function useSignup() {
  return usePostQuery<SignupFormData>(authApiClient, "signup", undefined, false, "/login");
}
