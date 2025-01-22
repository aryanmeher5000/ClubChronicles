import { Box, Heading, Text } from "@chakra-ui/react";
import { isRouteErrorResponse, useRouteError } from "react-router-dom";

const ErrorPage = () => {
  const error = useRouteError();

  return (
    <Box>
      <Heading textAlign="center">Oops, something failed!</Heading>
      {
        <Text textAlign="center">
          {isRouteErrorResponse(error)
            ? "Invalid Page, please go back!"
            : "Refresh the page or Go back!"}
        </Text>
      }
    </Box>
  );
};

export default ErrorPage;
