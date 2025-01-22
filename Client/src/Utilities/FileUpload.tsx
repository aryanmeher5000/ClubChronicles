import { FormControl, FormLabel, Input, FormErrorMessage } from "@chakra-ui/react";
import { Control, Controller, FieldError, FieldErrorsImpl, Merge, UseFormSetValue } from "react-hook-form";
import { isFieldError } from "../ReusableZodSchemas";

interface FileUploadProps {
  label: string;
  name: string;
  setValue: UseFormSetValue<any>;
  control: Control<any>;
  fileType: "pdf" | "image";
  error?: FieldError | Merge<FieldError, FieldErrorsImpl<any>>;
  multiple?: boolean;
}

export default function FileUpload({ label, name, setValue, control, fileType, error, multiple = false }: FileUploadProps) {
  return (
    <FormControl isInvalid={!!error}>
      <FormLabel>{label}</FormLabel>

      <Controller
        name={name} // TypeScript safe cast for dynamic keys
        control={control}
        render={({ field }) => (
          <Input
            id={name as string}
            border="none"
            mb={4}
            type="file"
            accept={fileType === "pdf" ? "application/pdf" : "image/jpg, image/webp, image/jpeg, image/png"}
            multiple={multiple}
            onChange={(e) => {
              setValue(name, e.target.files, { shouldValidate: true });
              field.onChange(e.target.files);
            }}
          />
        )}
      />

      {isFieldError(error) && <FormErrorMessage mb={4}>{error.message}</FormErrorMessage>}
    </FormControl>
  );
}
