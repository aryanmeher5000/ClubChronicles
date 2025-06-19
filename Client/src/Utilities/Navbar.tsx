import { Flex, Text, Button, Avatar, Box, useColorModeValue } from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import { AiOutlineUser } from "react-icons/ai";
import { createImageUrlFromId } from "./utilFxns";
import useClientStateManagement from "../store";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { useColorMode } from "@chakra-ui/react";

interface NavbarProps {
  sbStat: boolean;
  setSbStat: React.Dispatch<React.SetStateAction<boolean>>;
}

const Navbar = ({ setSbStat }: NavbarProps) => {
  const bg = useColorModeValue("whiteAlpha.800", "#000");
  const bgHam = useColorModeValue("blackAlpha.200", "whiteAlpha.200");
  const color = useColorModeValue("gray.900", "gray.100");
  const boxShadow = useColorModeValue("#000", "#151515");

  return (
    <Flex
      flex={1}
      bg={bg}
      color={color}
      p={1.5}
      borderRadius={10}
      alignItems="center"
      justifyContent="space-between"
      boxShadow={`0px 0px 10px 0.1px ${boxShadow}`}
      position="sticky"
      top={1}
      mx={1}
      zIndex={1000}
    >
      <Flex alignItems="center" gap={[1, 1, 4]}>
        <HamburgerIcon
          color="#f04d50"
          fontSize="4xl"
          p={1.5}
          borderRadius={15}
          _hover={{ bg: bgHam }}
          aria-label="Toggle sidebar"
          cursor="pointer"
          onClick={() => setSbStat((prevState) => !prevState)}
        />

        <Text fontSize="2xl" fontFamily="Rubik" onClick={() => {}} whiteSpace="nowrap">
          SATEJ x DYPCOE
        </Text>
      </Flex>

      <Flex gap={2} alignItems="center">
        <ToggleTheme />
        <UserProfile />
      </Flex>
    </Flex>
  );
};

const ToggleTheme = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Button
      onClick={toggleColorMode}
      alignSelf="center"
      size={["sm", "sm", "md"]}
      colorScheme={colorMode === "light" ? "gray" : "orange"}
    >
      {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
    </Button>
  );
};

const UserProfile = () => {
  const profile = useClientStateManagement((state) => state.profile);
  const navigate = useNavigate();

  return (
    <Box>
      {profile ? (
        <Avatar
          border="2px solid #e5e5e5"
          src={profile.profilePic ? createImageUrlFromId(profile.profilePic) : undefined}
          size="md"
          cursor="pointer"
          onClick={() => navigate("/profile/ownProfile")}
          bg="#f04d50"
          icon={<AiOutlineUser fontSize="1.5rem" />}
          aria-label="User Profile"
        />
      ) : (
        <Button onClick={() => navigate("/login")} aria-label="Login" colorScheme="green" size={["sm", "sm", "md"]}>
          Login
        </Button>
      )}
    </Box>
  );
};

export default Navbar;
