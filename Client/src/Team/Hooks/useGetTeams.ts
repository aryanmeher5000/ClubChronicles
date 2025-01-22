import { useGetInfiniteQuery } from "../../ReusableQueryFunctions";
import { Query } from "../../Utilities/DebouncedFilter";
import { teamApiClient } from "../../apiClient";

export interface TeamsCardProps {
  _id: string;
  name: string;
  department: { _id: string; name: string };
  sport: string;
  gender: string;
  logo?: string;
}

export default function useGetTeams(query: Query) {
  return useGetInfiniteQuery<TeamsCardProps[], Query>(["teams"], teamApiClient, "viewTeams", 12, query);
}
