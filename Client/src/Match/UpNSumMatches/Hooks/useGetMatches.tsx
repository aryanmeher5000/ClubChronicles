import { useGetInfiniteQuery } from "../../../ReusableQueryFunctions";
import { TeamProps } from "../../../Team/Hooks/useGetParticularTeam";
import { Query } from "../../../Utilities/DebouncedFilter";
import { matchApiClient } from "../../../apiClient";

export interface UpNSumMatchesCardProps {
  _id: string;
  team1: TeamProps;
  team2: TeamProps;
  sport: string;
  gender: string;
  tag?: string;
  venue?: string;
  date?: string;
  time?: string;
  winner?: string;
  team1Score?: string;
  team2Score?: string;
  status: "UPCOMING" | "SUMMARY";
}

export default function useGetMatches(endpoint: "UPCOMING" | "SUMMARY" | "LIVE", size: number, query?: Query) {
  return useGetInfiniteQuery<UpNSumMatchesCardProps[], Query>(
    ["upNSumMatches", endpoint],
    matchApiClient,
    `getMatches/${endpoint}`,
    size,
    query
  );
}
