import { Text, Heading, Box } from "@chakra-ui/react";

const AuthorizationDeniedPage = () => {
  return (
    <Box textAlign="center" color="whitesmoke">
      <Heading p={2}>You are not an ADMIN!</Heading>
      <Text>
        You are not an ADMIN if you are an ADMIN please try to re-login or if
        issue persists contact an ADMIN!
      </Text>
    </Box>
  );
};

export default AuthorizationDeniedPage;
