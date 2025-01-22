import { teamApiClient } from "../../apiClient";
import { useGetQuery } from "../../ReusableQueryFunctions";
import { TeamsCardProps } from "./useGetTeams";

export default function useGetTeamFoeUpdate() {
  return useGetQuery<TeamsCardProps[]>(["ParticularDepartmentTeams"], teamApiClient, "updateCardDetails");
}
