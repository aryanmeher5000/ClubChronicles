import { useGetQuery } from "../../../ReusableQueryFunctions";
import { LiveMatchData } from "../../LiveMatches/Hooks/useGetLiveMatches";
import { matchApiClient } from "../../../apiClient";

export function useGetActiveLiveMatches() {
  return useGetQuery<LiveMatchData[]>(["ActiveLiveMatches"], matchApiClient, "activeLiveMatches");
}
