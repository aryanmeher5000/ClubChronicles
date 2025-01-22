import { z } from "zod";
import { usePostQuery } from "../../ReusableQueryFunctions";
import { zodFileSchema } from "../../ReusableZodSchemas";
import { gcApiClient } from "../../apiClient";

export const fileSchema = z.object({ timeTable: zodFileSchema("image", 1, true) });

export type TimeTableUpl = z.infer<typeof fileSchema>;

export const useUploadTimeTable = () => {
  return usePostQuery<TimeTableUpl>(gcApiClient, "uploadTimeTable", ["timeTable"], true, "DNN");
};
