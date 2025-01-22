import { departmentApiClient } from "../../apiClient";
import { usePostQuery } from "../../ReusableQueryFunctions";

export default function useStopApplications() {
  return usePostQuery(departmentApiClient, "stopApplications", ["applications", "applicationStatus"], false, "DNN");
}
