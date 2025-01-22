import { Box, SimpleGrid, Spinner, Text } from "@chakra-ui/react";
import { useEffect } from "react";
import useLogout from "../Hooks/useLogout";
import useClientStateManagement from "../../store";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const { mutate } = useLogout();
  const profile = useClientStateManagement((p) => p.profile);
  const nav = useNavigate();

  // Automatically trigger the logout when the component mounts
  useEffect(() => {
    if (!profile) nav("/");
    else mutate({});
  }, []); // Run this only once when the component mounts

  return (
    <Box display="grid" placeItems="center" bg="#111" w="100vw" h="100vh">
      <SimpleGrid placeItems="center">
        <Spinner size="xl" color="#f04d50" thickness="1vh" />
        <Text fontSize="5vh" fontWeight={700} color="#f04d50">
          Logging you out...
        </Text>
      </SimpleGrid>
    </Box>
  );
};

export default Logout;
