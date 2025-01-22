import { gcApiClient } from "../../apiClient";
import { useGetQuery } from "../../ReusableQueryFunctions";

export function useGetTimeTable() {
  return useGetQuery<{ timeTable: string }>(["timeTable"], gcApiClient, "getTimeTable");
}
