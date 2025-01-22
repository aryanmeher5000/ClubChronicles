import { departmentApiClient } from "../../apiClient";
import { useGetQueryWithId } from "../../ReusableQueryFunctions";

export interface DepartmentProps {
  _id: string;
  name: string;
  logo: string;
  about: string;
  sportsLead?: string;
  gcWon?: number;
}

export function useGetParticularDepartment(id?: string) {
  return useGetQueryWithId<DepartmentProps>(
    ["department"],
    departmentApiClient,
    "departments",
    id
  );
}
