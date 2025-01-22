import { usePostQuery } from "../../ReusableQueryFunctions";
import { profileApiClient } from "../../apiClient";

export const useDeassignRole = () => {
  return usePostQuery(profileApiClient, "deassignRole", undefined, false, "DNN");
};
