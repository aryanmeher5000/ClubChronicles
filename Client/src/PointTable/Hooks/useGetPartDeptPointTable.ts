import { useGetQueryWithId } from "../../ReusableQueryFunctions";
import { pointTableApiClient } from "../../apiClient";

export interface PartDeptPT {
  _id: string;
  team1: { _id: string; name: string; department: string };
  team2: { _id: string; name: string; department: string };
  winner: string;
}

export interface PartDeptPointTableData {
  deptTeams: string[];
  deptMatches: PartDeptPT[];
}

export const useGetPartDeptPointsTable = (sport: string, deptId?: string) => {
  return useGetQueryWithId<PartDeptPointTableData, { sport: string }>(
    ["pointTable"],
    pointTableApiClient,
    "particularDepartment",
    deptId,
    {
      sport,
    }
  );
};
