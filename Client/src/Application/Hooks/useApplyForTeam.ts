import { usePostQuery } from "../../ReusableQueryFunctions";
import { applicationServices } from "../../apiClient";

export function useApplyForTeam() {
  return usePostQuery<{ teamId: string }>(applicationServices, "apply", ["applications"], false, "DNN");
}
