import { usePostQuery } from "../../ReusableQueryFunctions";
import { gcApiClient } from "../../apiClient";

export default function useCreateCurrentGCSession() {
  return usePostQuery(gcApiClient, "createCurrentGCSession", undefined, false, "DNN");
}
