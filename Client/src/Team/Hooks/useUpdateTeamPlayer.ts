import { teamApiClient } from "../../apiClient";
import { usePutQuery } from "../../ReusableQueryFunctions";
import { PlayerProps } from "./useGetApplicantsNPlayers";

interface PlayersData {
  addedPlayers: PlayerProps[];
  removedPlayers: PlayerProps[];
  captain?: string;
  viceCaptain?: string;
}

export default function useUpdateTeamPlayer() {
  return usePutQuery<PlayersData>(teamApiClient, "updateTeamPlayers", ["applicantsAndPlayers"]);
}
