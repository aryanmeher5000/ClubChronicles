import { FormControl, FormErrorMessage, FormLabel, Textarea } from "@chakra-ui/react";
import { FieldError, UseFormRegisterReturn } from "react-hook-form";

interface Props {
  label: string;
  placeholder: string;
  isReq: boolean;
  registerFxn: UseFormRegisterReturn<string>;
  error?: FieldError;
}

const AnnDesc = ({ label, placeholder, isReq, registerFxn, error }: Props) => {
  return (
    <FormControl mb={5} isRequired={isReq} isInvalid={!!error}>
      <FormLabel>{label}</FormLabel>
      <Textarea placeholder={placeholder} {...registerFxn} h="20vh" maxH="50vh" maxLength={1000} />
      <FormErrorMessage>{error?.message}</FormErrorMessage>
    </FormControl>
  );
};

export default AnnDesc;
