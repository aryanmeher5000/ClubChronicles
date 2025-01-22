import { z } from "zod";
import { teamApiClient } from "../../apiClient";
import { usePostQuery } from "../../ReusableQueryFunctions";
import { zodFileSchema } from "../../ReusableZodSchemas";

export const createTeamSchema = z.object({
  name: z.string().min(3, "Name should be atleast 3 characters long").max(100, "Name is too long"),
  motto: z.string().min(3, "Motto should be atleast 3 characters long").max(100, "Motto is too long").or(z.literal("")),
  about: z.string().min(3, "About should be atleast 3 characters long").max(1000, "About is too long").or(z.literal("")),
  logo: zodFileSchema("image", 1, false),
  department: z.string().length(24),
  gender: z.enum(["MALE", "FEMALE"]),
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
});

export type CreateTeamZod = z.infer<typeof createTeamSchema>;

export default function useCreateTeam() {
  return usePostQuery<CreateTeamZod>(teamApiClient, "createTeam", ["ParticularDepartmentTeams", "teams"], true);
}
