import { FormControl, FormErrorMessage, FormLabel, Input } from "@chakra-ui/react";
import { FieldError, UseFormRegisterReturn } from "react-hook-form";

interface Props {
  label?: string;
  placeholder: string;
  isReq: boolean;
  registerFxn: UseFormRegisterReturn<string>;
  type?: string;
  width?: string | string[];
  error?: FieldError;
}

const NameTitle = ({ label, placeholder, isReq, registerFxn, type, error }: Props) => {
  return (
    <FormControl mb={5} isRequired={isReq} isInvalid={!!error}>
      {label && <FormLabel>{label}</FormLabel>}
      <Input type={type ? type : "text"} placeholder={placeholder} {...registerFxn} />
      <FormErrorMessage>{error?.message}</FormErrorMessage>
    </FormControl>
  );
};

export default NameTitle;
