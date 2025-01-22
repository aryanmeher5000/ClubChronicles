import { useGetQueryWithId } from "../../ReusableQueryFunctions";
import { teamApiClient } from "../../apiClient";

export interface PlayerProps {
  _id: string;
  name: string;
  profilePic: string;
}

export interface ManageTeamPlayer {
  teamName: string;
  applicants: PlayerProps[];
  players: PlayerProps[];
  captain: PlayerProps;
  viceCaptain: PlayerProps;
}

export default function useGetApplicantsNPlayers(id?: string) {
  return useGetQueryWithId<ManageTeamPlayer>(["applicantsAndPlayers"], teamApiClient, "getAppliPlayers", id);
}
