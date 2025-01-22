import { z } from "zod";
import { usePostQuery } from "../../../ReusableQueryFunctions";
import { matchApiClient } from "../../../apiClient";

export const createMatchSummary = z.object({
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
  tag: z.enum(["FINAL", "SEMI_FINAL", "QUARTER_FINAL", "DO_OR_DIE"]).optional().or(z.literal("")),
  team1Score: z.number().min(0).max(1000).optional(),
  team2Score: z.number().min(0).max(1000).optional(),
  winner: z.enum(["TEAM1", "TEAM2", "TIE"]),
  status: z.string().default("SUMMARY"),
});

export type CreateMatchSummaryProps = z.infer<typeof createMatchSummary>;

export const useCreateMatchSummary = () => {
  return usePostQuery<CreateMatchSummaryProps>(matchApiClient, "createSummary", ["upNSumMatches"]);
};
