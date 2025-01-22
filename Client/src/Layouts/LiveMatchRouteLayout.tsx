import { Outlet } from "react-router-dom";
import { SocketProvider } from "../Contexts/SocketContext";

const LiveMatchRouteLayout = () => {
  return (
    <SocketProvider>
      <Outlet />
    </SocketProvider>
  );
};

export default LiveMatchRouteLayout;
