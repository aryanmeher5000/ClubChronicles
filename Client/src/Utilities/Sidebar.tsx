import { Box, Divider, Flex, HStack, Icon, Text, useColorModeValue } from "@chakra-ui/react";
import { FaUniversity, FaWpforms } from "react-icons/fa";
import { TiHomeOutline } from "react-icons/ti";
import { MdOutlineManageAccounts } from "react-icons/md";
import { IoArchive } from "react-icons/io5";
import { RiTeamLine, RiLogoutCircleLine } from "react-icons/ri";
import { TbTournament } from "react-icons/tb";
import { GrAnnounce } from "react-icons/gr";
import { FaTableList } from "react-icons/fa6";
import { CiViewTimeline } from "react-icons/ci";
import { useNavigate, useLocation } from "react-router-dom";
import useClientStateManagement from "../store";
import ToggleMode from "../ToggleTheme";

const Sidebar = ({ sbStat, setSbStat }: { sbStat: boolean; setSbStat: React.Dispatch<React.SetStateAction<boolean>> }) => {
  const nav = useNavigate();
  const location = useLocation();
  const filteredOptions = FilterOptions();

  const bg = useColorModeValue("whiteAlpha.900", "blackAlpha.900");
  const bgSelected = useColorModeValue("blackAlpha.100", "whiteAlpha.100");
  const boxShadow = useColorModeValue("#000", "#222");

  return (
    <Flex
      display={sbStat ? "flex" : "none"}
      alignItems="center"
      direction="column"
      bg={bg}
      w={["60%", "60%", "30%", "20%"]}
      h="91vh"
      maxH="92vh"
      p={2}
      zIndex={1000}
      position="fixed"
      left={0}
      borderRadius={10}
      gap={2}
      overflowY="scroll"
      mt={2}
      ml={1}
      boxShadow={`0px 0px 10px 0.1px ${boxShadow}`}
      className="scrollBarHidden"
    >
      {filteredOptions.map(({ name, icon, link }) => {
        const isActive = location.pathname === `/${link}`;

        return (
          <Box
            as="button"
            w="100%"
            borderRadius={25}
            p={3}
            onClick={() => {
              nav(link);
              setSbStat(false);
            }}
            bg={isActive ? bgSelected : bg}
            aria-label={`Navigate to ${name}`}
            key={name}
          >
            <HStack>
              <Icon as={icon} fontSize="xl" color="#f05d40" />
              <Text fontWeight={500} fontSize="lg">
                {name}
              </Text>
            </HStack>
            <Divider />
          </Box>
        );
      })}
      <ToggleMode />
    </Flex>
  );
};

function FilterOptions() {
  const { profile } = useClientStateManagement();

  const sideBarOpts = [
    { name: "Home", icon: TiHomeOutline, link: "" },
    { name: "Departments", icon: FaUniversity, link: "departments" },
    { name: "Teams", icon: RiTeamLine, link: "teams" },
    { name: "Matches", icon: TbTournament, link: "matches" },
    {
      name: "Applications",
      icon: FaWpforms,
      link: "applications",
      roles: ["DEPARTMENT_HEAD", "DEPARTMENT_SPORTS_LEAD", "USER", "HELPER"],
    },
    { name: "Announcement", icon: GrAnnounce, link: "announcements" },
    { name: "Time Table", icon: CiViewTimeline, link: "timeTable" },
    { name: "Point Table", icon: FaTableList, link: "pointTable" },
    { name: "GC Archive", icon: IoArchive, link: "gcArchive" },
    {
      name: "ADMIN HQ",
      icon: MdOutlineManageAccounts,
      link: "adminDashboard",
      roles: ["DEPARTMENT_HEAD", "DEPARTMENT_SPORTS_LEAD", "ADMIN", "HELPER"],
    },
    {
      name: "Logout",
      icon: RiLogoutCircleLine,
      link: "/logout",
      roles: ["DEPARTMENT_HEAD", "DEPARTMENT_SPORTS_LEAD", "ADMIN", "USER", "HELPER"],
    },
  ];

  return sideBarOpts.filter((option) => !option.roles || (profile && option.roles.includes(profile.role)));
}

export default Sidebar;
