import { profileApiClient } from "../../apiClient";
import { usePostQuery } from "../../ReusableQueryFunctions";

interface RoleData {
  userId: string;
  role: string;
}

export const useAssignRole = () => {
  return usePostQuery<RoleData>(profileApiClient, "assignRole", undefined, false, "DNN");
};
