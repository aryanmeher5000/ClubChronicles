import { z } from "zod";
import { usePutQuery } from "../../ReusableQueryFunctions";
import { zodFileSchema } from "../../ReusableZodSchemas";
import { departmentApiClient } from "../../apiClient";

export const updateDepartmentSchema = z.object({
  name: z
    .string()
    .min(3, "Name should be atleast 3 characters long.")
    .max(100, "Name is too long.")
    .optional()
    .or(z.literal("")),
  about: z
    .string()
    .min(3, "About should be atleast 3 characters long.")
    .max(1000, "About is too long.")
    .optional()
    .or(z.literal("")),
  logo: zodFileSchema("image", 1, false),
});

export type UpdateDepartmentZod = z.infer<typeof updateDepartmentSchema>;

export default function useUpdateDepartment() {
  return usePutQuery(departmentApiClient, "updateDepartment", ["department"], true);
}
