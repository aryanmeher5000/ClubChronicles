import { anncApiClient } from "../../apiClient";
import { useGetQueryWithId } from "../../ReusableQueryFunctions";

export interface Announcement {
  _id: string;
  title: string;
  createdAt: Date;
  description?: string;
  department: { _id: string; name: string };
  createdBy: { _id: string; name: string };
  sport: string;
  gender: string;
  images?: string[];
  pdf?: string[];
  url?: string;
}

export function useGetParticularAnnouncement(id?: string) {
  return useGetQueryWithId<Announcement>(["particularAnnouncement"], anncApiClient, "viewAnnouncement", id);
}
