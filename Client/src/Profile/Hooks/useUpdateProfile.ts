import { z } from "zod";
import { usePutQuery } from "../../ReusableQueryFunctions";
import { zodFileSchema } from "../../ReusableZodSchemas";
import { profileApiClient } from "../../apiClient";
import useClientStateManagement from "../../store";

export const updateScehma = z.object({
  name: z
    .string()
    .min(2, "Name should be atleast 2 characters long.")
    .max(100, "Name is too long.")
    .optional()
    .or(z.literal("")),
  about: z
    .string()
    .min(3, "About should be atleast 5 characters long.")
    .max(1000, "About is too long.")
    .optional()
    .or(z.literal("")),
  achievements: z
    .string()
    .min(5, "Achievements should be atleast 5 characters long.")
    .max(1000, "Achievements is too long.")
    .optional()
    .or(z.literal("")),
  profilePic: zodFileSchema("image", 1, false),
});

export type UpdateProfileProps = z.infer<typeof updateScehma>;

export default function useUpdateProfile() {
  const { profile, setProfile, setMultiSessionProfile } = useClientStateManagement();
  function extraFunction(body: { profilePic?: string }) {
    if (profile && body?.profilePic) {
      setProfile({ ...profile, profilePic: body.profilePic });
      setMultiSessionProfile({ ...profile, profilePic: body.profilePic });
    }
  }
  return usePutQuery<UpdateProfileProps, { profilePic: string }>(
    profileApiClient,
    "updateProfile",
    ["profile"],
    true,
    undefined,
    extraFunction
  );
}
