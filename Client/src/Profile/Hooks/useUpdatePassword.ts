import { z } from "zod";
import { usePutQuery } from "../../ReusableQueryFunctions";
import { authApiClient } from "../../apiClient";

export const passSchema = z.object({
  oldPassword: z.string().min(8, "Old password to short").max(250, "Old password cannot be this long"),
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(200, "Password is too long.")
    .refine((value) => /[A-Z]/.test(value), "Password must contain at least one uppercase letter")
    .refine((value) => /[!@#$%^&*(),.?":{}|<>]/.test(value), "Password must contain at least one special character"),
});

export type PasswordSchema = z.infer<typeof passSchema>;

export default function useUpdatePassword() {
  return usePutQuery(authApiClient, "updatePassword", undefined, false, "DNN");
}
