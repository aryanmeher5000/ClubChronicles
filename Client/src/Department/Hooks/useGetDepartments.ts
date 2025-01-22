import { departmentApiClient } from "../../apiClient";
import { useGetQuery } from "../../ReusableQueryFunctions";

export interface DepartmentCardProps {
  _id: string;
  name: string;
  logo: string;
}

export default function useGetDepartments() {
  return useGetQuery<DepartmentCardProps[]>(
    ["departments"],
    departmentApiClient,
    "departments"
  );
}
