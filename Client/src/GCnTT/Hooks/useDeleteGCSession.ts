import { useDeleteQuery } from "../../ReusableQueryFunctions";
import { gcApiClient } from "../../apiClient";

export const useDeleteGCSession = () => {
  return useDeleteQuery(gcApiClient, "deleteGCRecord", ["gcRecords"], "DNN");
};
