import { useGetQuery } from "../../ReusableQueryFunctions";
import { applicationServices } from "../../apiClient";

export interface Application {
  _id: string;
  applicationId?: string;
  logo?: string;
  name: string;
  department: { _id: string; name: string };
  gender: string;
  sport: string;
  status: "ACCEPTED" | "APPLIED" | "ELIGIBLE";
}

export function useGetApplications() {
  return useGetQuery<Application[]>(["applications"], applicationServices, "getApplications");
}
