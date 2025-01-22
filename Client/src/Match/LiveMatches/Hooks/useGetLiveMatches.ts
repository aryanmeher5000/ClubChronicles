import { matchApiClient } from "../../../apiClient";
import { useGetInfiniteQuery } from "../../../ReusableQueryFunctions";
import { Query } from "../../../Utilities/DebouncedFilter";
import { TeamProps } from "../../socketService";

export interface LiveMatchData {
  _id: string;
  roomId: string;
  team1: TeamProps;
  team2: TeamProps;
  gender: string;
  sport: string;
  team1Score: number;
  team2Score: number;
  tag?: string;
  venue?: string;
  scheduledAt?: string;
}

export default function useGetLiveMatches(query?: Query) {
  return useGetInfiniteQuery<LiveMatchData[], Query>(["liveMatches"], matchApiClient, "getLiveMatches", 12, query);
}
