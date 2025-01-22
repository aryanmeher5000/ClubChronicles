import { z } from "zod";
import { departmentApiClient } from "../../apiClient";
import { usePostQuery } from "../../ReusableQueryFunctions";
import { zodFileSchema } from "../../ReusableZodSchemas";

export const createDepartmentSchema = z.object({
  name: z.string().min(3, "Name should be atleast 2 characters long.").max(100, "Name is too long."),
  about: z
    .string()
    .min(3, "About should be atleast 3 characters long.")
    .max(1000, "About is too long.")
    .optional()
    .or(z.literal("")),
  logo: zodFileSchema("image", 1, false),
});

export type CreateDepartmentZod = z.infer<typeof createDepartmentSchema>;

export default function useCreateDepartment() {
  return usePostQuery(departmentApiClient, "createDepartment", ["departments"], true);
}
