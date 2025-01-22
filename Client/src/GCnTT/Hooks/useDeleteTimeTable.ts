import { useDeleteQuery } from "../../ReusableQueryFunctions";
import { gcApiClient } from "../../apiClient";

export const useDeleteTimeTable = () => {
  return useDeleteQuery(gcApiClient, "deleteTimeTable", ["timeTable"], "DNN");
};
