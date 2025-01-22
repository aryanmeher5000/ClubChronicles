import { FieldError, Merge, FieldErrorsImpl } from "react-hook-form";
import { z } from "zod";

export function zodRequiredSchema(minLen: number = 3, maxLen: number = 50): z.ZodString {
  return z.string().min(minLen, "The input is too small!").max(maxLen, "The input is too large!");
}

export function zodOptionalSchema(
  minLen: number = 3,
  maxLen: number = 50
): z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodLiteral<"">]>> {
  return z.string().min(minLen, "Input is too small!").max(maxLen, "Input is too large!").or(z.literal("")).optional();
}

export function zodFileSchema(fileType: "pdf" | "image", maxAmount: number = 1, isRequired: boolean = false): z.ZodTypeAny {
  return z
    .instanceof(FileList)
    .optional()
    .refine(
      (fileList) => {
        if (isRequired) return !!fileList && fileList.length > 0;
        return true; // Optional if not required
      },
      {
        message: isRequired ? "At least one file is required!" : "File is optional, but must be provided if included.",
      }
    )
    .refine(
      (fileList) => {
        if (!fileList) return true; // Skip validation if no files provided
        return fileList.length <= maxAmount;
      },
      {
        message: maxAmount === 1 ? "Only 1 file can be uploaded!" : `Maximum of ${maxAmount} files are allowed!`,
      }
    )
    .refine(
      (fileList) => {
        if (!fileList) return true; // Skip validation if no files provided
        const validTypes = fileType === "pdf" ? ["application/pdf"] : ["image/jpg", "image/webp", "image/jpeg", "image/png"];
        return Array.from(fileList).every((file) => validTypes.includes(file.type));
      },
      {
        message: `Invalid file type. Only ${fileType === "pdf" ? "PDF" : "Image"} files are allowed.`,
      }
    )
    .refine(
      (fileList) => {
        if (!fileList) return true; // Skip validation if no files provided
        return Array.from(fileList).every((file) => file.size <= 5 * 1024 * 1024); // 5MB
      },
      {
        message: "File size must be less than 5MB.",
      }
    );
}

export function schemaBuilder(zodObject: Record<string, z.ZodTypeAny>) {
  return z.object({ ...zodObject });
}

export type InferZodType<T extends z.ZodTypeAny> = z.infer<T>;

export const isFieldError = (error: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined): error is FieldError =>
  Boolean(error && "type" in error);
