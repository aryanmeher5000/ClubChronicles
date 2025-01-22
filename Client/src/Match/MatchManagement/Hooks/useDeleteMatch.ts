import { matchApiClient } from "../../../apiClient";
import { useDeleteQuery } from "../../../ReusableQueryFunctions";

export const useDeleteMatch = () => {
  return useDeleteQuery(matchApiClient, "deleteMatch", ["matches", "highlight"], "DNN");
};
