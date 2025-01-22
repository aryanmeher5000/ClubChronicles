import { z } from "zod";
import { matchApiClient } from "../../../apiClient";
import { usePostQuery } from "../../../ReusableQueryFunctions";

export const createUpcomingMatchSchema = z.object({
  team1: z.string().regex(/^[a-fA-F0-9]{24}$/, "Invalid team ID"),
  team2: z.string().regex(/^[a-fA-F0-9]{24}$/, "Invalid team ID"),
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
  gender: z.enum(["MALE", "FEMALE"]),
  venue: z.string().max(100).optional().or(z.literal("")),
  date: z.string().date().optional().or(z.literal("")),
  time: z.string().optional().or(z.literal("")),
  tag: z.enum(["FINAL", "SEMI_FINAL", "QUARTER_FINAL", "DO_OR_DIE"]).optional().or(z.literal("")),
  status: z.enum(["UPCOMING", "SUMMARY"]).default("UPCOMING").or(z.literal("")),
});

export type CreateUpcomingMatchProps = z.infer<typeof createUpcomingMatchSchema>;

export function useCreateUpcomingMatch() {
  return usePostQuery<CreateUpcomingMatchProps>(matchApiClient, "createUpcoming");
}
