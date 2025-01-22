import { anncApiClient } from "../../apiClient";
import { useGetInfiniteQuery } from "../../ReusableQueryFunctions";
import { Query } from "../../Utilities/DebouncedFilter";

export interface MultipleAnnouncements {
  _id: string;
  title: string;
  createdAt: Date;
  department?: { _id: string; name: string };
  sport?: string;
  gender?: string;
}

export default function useGetAnnouncements(query: Query) {
  return useGetInfiniteQuery<MultipleAnnouncements[], Query>(
    ["announcements"],
    anncApiClient,
    "viewAnnouncements",
    12,
    query
  );
}
