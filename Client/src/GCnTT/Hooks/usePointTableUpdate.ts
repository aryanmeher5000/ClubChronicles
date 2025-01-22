import { usePutQuery } from "../../ReusableQueryFunctions";
import { pointTableApiClient } from "../../apiClient";

interface UpdateData {
  points?: string;
}

export default function usePointTableUpdate() {
  return usePutQuery<UpdateData>(pointTableApiClient, "updatePointTable", ["pointTable"]);
}
