import { useGetQueryWithId } from "../../ReusableQueryFunctions";
import { teamApiClient } from "../../apiClient";

export interface ProfileCardData {
  _id: string;
  name: string;
  profilePic: string;
  role?: "CAPTAIN" | "VICE_CAPTAIN";
}

export interface TeamProps {
  _id: string;
  name: string;
  department: { _id: string; name: string };
  sport: string;
  gender: string;
  logo: string;
  motto: string;
  description: string;
  captain: ProfileCardData;
  viceCaptain: ProfileCardData;
  players: ProfileCardData[];
}

export function useGetParticularTeam(id?: string) {
  return useGetQueryWithId<TeamProps>(["particularTeam"], teamApiClient, "viewTeam", id);
}
