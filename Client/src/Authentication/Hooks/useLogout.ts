import { authApiClient } from "../../apiClient";
import { usePostQuery } from "../../ReusableQueryFunctions";
import useClientStateManagement from "../../store";

export default function useLogout() {
  const { clearProfile, clearMultiSessionProfile } = useClientStateManagement();
  function extraTask() {
    clearProfile();
    clearMultiSessionProfile();
  }

  return usePostQuery(authApiClient, "logout", undefined, false, "/", undefined, extraTask);
}
