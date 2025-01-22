import { z } from "zod";
import { usePostQuery } from "../../ReusableQueryFunctions";
import { authApiClient } from "../../apiClient";
import useClientStateManagement, { Profile } from "../../store";

export const loginSchema = z.object({
  email: z.string().max(100, "Email is too long"),
  password: z.string().max(200, "Password is too long."),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export function useLogin() {
  const { setProfile, setMultiSessionProfile } = useClientStateManagement();

  function extraTask(data: Profile) {
    setProfile(data);
    setMultiSessionProfile(data);
  }

  return usePostQuery<LoginFormData, Profile>(authApiClient, "login", undefined, false, "/", extraTask);
}
