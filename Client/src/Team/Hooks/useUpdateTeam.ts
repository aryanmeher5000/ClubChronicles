import { z } from "zod";
import { teamApiClient } from "../../apiClient";
import { usePutQuery } from "../../ReusableQueryFunctions";
import { zodFileSchema } from "../../ReusableZodSchemas";

export const updateTeamSchema = z.object({
  name: z.string().min(3, "Name should be atleast 3 characters long").max(100, "Name is too long").optional(),
  motto: z
    .string()
    .min(3, "Motto should be atleast 3 characters long")
    .max(100, "Motto is too long")
    .optional()
    .or(z.literal("")),
  description: z.string().min(3).max(1000).optional().or(z.literal("")),
  logo: zodFileSchema("image", 1, false),
});

export type UpdateTeamZod = z.infer<typeof updateTeamSchema>;

export default function useUpdateTeam() {
  return usePutQuery(teamApiClient, "updateTeam", undefined, true);
}
