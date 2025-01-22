import { useDeleteQuery } from "../../ReusableQueryFunctions";
import { anncApiClient } from "../../apiClient";

export const useDeleteAnnouncement = () => {
  return useDeleteQuery(anncApiClient, "deleteAnnouncement", ["ownAnnouncements"], "DNN");
};
