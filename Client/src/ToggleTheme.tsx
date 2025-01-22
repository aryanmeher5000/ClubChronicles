import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { Box, Button, useColorMode } from "@chakra-ui/react";

const ToggleMode = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Box>
      <Button onClick={toggleColorMode} alignSelf="center" colorScheme="green">
        Swith Mode
        {colorMode === "light" ? <MoonIcon ml={2} /> : <SunIcon ml={2} />}
      </Button>
    </Box>
  );
};

export default ToggleMode;
