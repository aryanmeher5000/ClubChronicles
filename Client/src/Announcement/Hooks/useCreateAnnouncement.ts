import { z } from "zod";
import { usePostQuery } from "../../ReusableQueryFunctions";
import { zodFileSchema } from "../../ReusableZodSchemas";
import { anncApiClient } from "../../apiClient";

export const createAnnouncementSchema = z.object({
  title: z.string().min(3, "Title should be at least 3 characters long.").max(100, "Title is too long."),
  description: z
    .string()
    .min(3, "Description should be at least 3 characters long.")
    .max(1000, "Description is too long.")
    .optional()
    .or(z.literal("")),
  department: z
    .string()
    .regex(/^[a-fA-F0-9]{24}$/, "Invalid department ID")
    .optional()
    .or(z.literal("")),
  gender: z.enum(["MALE", "FEMALE"]).optional().or(z.literal("")),
  sport: z
    .enum([
      "CRICKET",
      "FOOTBALL",
      "VOLLEYBALL",
      "BASKETBALL",
      "CHESS",
      "CARROM",
      "TABLE_TENNIS",
      "BADMINTON",
      "KABBADI",
      "TUG_OF_WAR",
      "SHOTPUT",
    ])
    .optional()
    .or(z.literal("")),
  images: zodFileSchema("image", 2, false),
  pdf: zodFileSchema("pdf", 1, false),
  url: z.string().url().optional().or(z.literal("")),
});

export type CreateAnnounce = z.infer<typeof createAnnouncementSchema>;

export const useCreateAnnouncement = () => {
  return usePostQuery(anncApiClient, "createAnnouncement", ["ownAnnouncements"], true);
};
