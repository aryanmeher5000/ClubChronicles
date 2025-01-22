import { usePostQuery } from "../../ReusableQueryFunctions";
import { applicationServices } from "../../apiClient";

export function useUnapplyForTeam() {
  return usePostQuery<{ applicationId: string }>(applicationServices, "unapply", ["applications"], false, "DNN");
}
