import { useDeleteQuery } from "../../ReusableQueryFunctions";
import { teamApiClient } from "../../apiClient";

export const useDeleteTeam = () => {
  return useDeleteQuery(teamApiClient, "deleteTeam", ["ParticularDepartmentTeams"], "DNN");
};
