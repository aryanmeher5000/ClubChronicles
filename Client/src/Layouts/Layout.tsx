import { Box, useColorModeValue } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import Navbar from "../Utilities/Navbar";
import Sidebar from "../Utilities/Sidebar";
import { useEffect, useState } from "react";
import { useRefreshAccessToken } from "../useRefresAccessToken";

const Layout = () => {
  const { mutate } = useRefreshAccessToken();
  const [sidebarStatus, setSidebarStatus] = useState<boolean>(false);

  useEffect(() => {
    mutate();
  }, [mutate]);

  const bg = useColorModeValue("whiteAlpha.800", "blackAlpha.800");
  const color = useColorModeValue("gray.900", "gray.100");

  return (
    <Box color={color} bg={bg}>
      <Navbar sbStat={sidebarStatus} setSbStat={setSidebarStatus} />
      <Sidebar sbStat={sidebarStatus} setSbStat={setSidebarStatus} />
      <Box
        flex={1}
        filter={sidebarStatus ? "blur(2px) brightness(80%)" : "none"}
        pointerEvents={sidebarStatus ? "none" : "all"}
        p={3}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
