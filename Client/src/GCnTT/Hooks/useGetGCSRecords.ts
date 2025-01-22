import { useGetQuery } from "../../ReusableQueryFunctions";
import { gcApiClient } from "../../apiClient";

export interface GCData {
  _id: string;
  year: number;
  wonBy: {
    _id: string;
    name: string;
  };
  teamPic: string;
  isCurrent: boolean;
}

export function useGetGCRecords() {
  return useGetQuery<GCData[]>(["gcRecords"], gcApiClient, "getGCRecords");
}
