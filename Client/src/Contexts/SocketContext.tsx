import { createContext, useEffect } from "react";
import SocketService from "../Match/socketService";

// Create a Socket Context
export const SocketContext = createContext<SocketService | null>(null);

// Create a custom hook to use the SocketContext

// Create a SocketProvider component
export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const socketService = SocketService.getInstance();

  useEffect(() => {
    socketService.connect(); // Establish the connection when provider mounts

    return () => {
      socketService.disconnect(); // Clean up the connection when provider unmounts
    };
  }, [socketService]);

  return (
    <SocketContext.Provider value={socketService}>
      {children} {/* Render children to allow for flexible usage */}
    </SocketContext.Provider>
  );
};
