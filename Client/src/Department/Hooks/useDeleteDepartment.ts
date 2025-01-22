import { departmentApiClient } from "../../apiClient";
import { useDeleteQuery } from "../../ReusableQueryFunctions";

export const useDeleteDepartment = () => {
  return useDeleteQuery(
    departmentApiClient,
    "deleteDepartment",
    ["departments"],
    "DNN"
  );
};
