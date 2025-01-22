import { pointTableApiClient } from "../../apiClient";
import { useGetQuery } from "../../ReusableQueryFunctions";

export interface PointsTable {
  _id: string;
  name: string;
  logo: string;
  points: number;
}

export const useGetPointsTable = () => {
  return useGetQuery<PointsTable[]>(["pointTable"], pointTableApiClient, "");
};
