import { Box, Button, Text } from "@chakra-ui/react";
import { AxiosError } from "axios";
import { ErrorResponse } from "../ReusableQueryFunctions";

const ErrorDisplay = ({
  errorObj,
  message,
  retryFxn,
}: {
  errorObj: AxiosError<ErrorResponse> | null;
  message?: string;
  retryFxn?: () => void;
}) => {
  return (
    <Box textAlign="center" p={10}>
      <Text color="red.500" fontWeight={500}>
        {message ||
          errorObj?.response?.data.error ||
          errorObj?.message ||
          "Error fetching data!"}
      </Text>
      <Button
        colorScheme="red"
        border="1px solid red.500"
        my={4}
        onClick={retryFxn}
      >
        Retry
      </Button>
    </Box>
  );
};

export default ErrorDisplay;
