import { departmentApiClient } from "../../apiClient";
import { useGetQuery } from "../../ReusableQueryFunctions";

interface AppliStatus {
  applicationStatus: string;
}

export function useCheckAppliStatus() {
  return useGetQuery<AppliStatus>(
    ["applicationStatus"],
    departmentApiClient,
    "checkAppliStatus"
  );
}
