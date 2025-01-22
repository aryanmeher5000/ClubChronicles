import { usePostQuery } from "../../ReusableQueryFunctions";
import { authApiClient } from "../../apiClient";

export default function useDeleteProfile() {
  return usePostQuery<{ password: string }>(authApiClient, "deleteProfile", undefined, false, "/logout");
}
