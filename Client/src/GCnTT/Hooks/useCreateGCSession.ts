import { z } from "zod";
import { gcApiClient } from "../../apiClient";
import { usePostQuery } from "../../ReusableQueryFunctions";
import { zodFileSchema } from "../../ReusableZodSchemas";

export const gcRecordSchema = z.object({
  year: z.number().refine((value) => {
    if (!value) return false;
    const date = new Date();
    const year = date.getFullYear();
    if (value < 1980 || value > year) return false;
    return true;
  }),
  wonBy: z.string().length(24),
  teamPic: zodFileSchema("image", 1, false),
});

export type CreateGCRecord = z.infer<typeof gcRecordSchema>;

export default function useCreateGCSession() {
  return usePostQuery<CreateGCRecord>(gcApiClient, "createGCRecord", ["gcRecords"], true);
}
