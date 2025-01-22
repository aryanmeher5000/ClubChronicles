import { departmentApiClient } from "../../apiClient";
import { usePostQuery } from "../../ReusableQueryFunctions";

export default function useStartApplications() {
  return usePostQuery(
    departmentApiClient,
    "startApplications",
    ["applicationStatus"],
    false,
    "DNN"
  );
}
