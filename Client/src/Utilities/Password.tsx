import { Button, FormControl, FormErrorMessage, FormLabel, Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import { useState } from "react";
import { FieldError, UseFormRegisterReturn } from "react-hook-form";

interface Props {
  registerFxn: UseFormRegisterReturn<string>;
  error?: FieldError;
  label?: string;
}

const Password = ({ registerFxn, error, label }: Props) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <FormControl mb={5} isRequired isInvalid={!!error?.message}>
      <FormLabel>{label || "Password"}</FormLabel>
      <InputGroup>
        <Input type={showPassword ? "text" : "password"} placeholder="*************" {...registerFxn} />
        <InputRightElement width="4.5rem">
          <Button size="sm" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? "Hide" : "Show"}
          </Button>
        </InputRightElement>
      </InputGroup>
      <FormErrorMessage>{error?.message}</FormErrorMessage>
    </FormControl>
  );
};

export default Password;
