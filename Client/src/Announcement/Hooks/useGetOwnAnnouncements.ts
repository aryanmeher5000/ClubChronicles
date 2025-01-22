import { anncApiClient } from "../../apiClient";
import { useGetQuery } from "../../ReusableQueryFunctions";
import { MultipleAnnouncements } from "./useGetAnnouncements";

export default function useGetOwnAnnouncements() {
  return useGetQuery<MultipleAnnouncements[]>(["ownAnnouncements"], anncApiClient, "ownAnnouncements");
}
