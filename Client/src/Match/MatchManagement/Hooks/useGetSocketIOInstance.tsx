import { useContext } from "react";
import { SocketContext } from "../../../Contexts/SocketContext";

export const useGetSocketIOInstance = () => {
  const socket = useContext(SocketContext);
  if (!socket) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return { socket };
};
