import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useShowToast from "../../../useShowToast";
import { useGetSocketIOInstance } from "./useGetSocketIOInstance";
import useClientStateManagement from "../../../store";

const useCreateLiveMatchFromUpcoming = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const showToast = useShowToast();
  const profile = useClientStateManagement((p) => p.profile);
  const nav = useNavigate();
  const { socket } = useGetSocketIOInstance();

  useEffect(() => {
    const handleSuccess = (roomId: string) => {
      setIsLoading(false);
      showToast("success", "Room created successfully");
      nav(`scoreUpdation/${roomId}`);
    };

    const handleError = (errMsg: string) => {
      setIsLoading(false); // Stop loading on error
      showToast("error", errMsg);
    };

    // Listen for success and error events
    socket.on("roomCreationSuccess", handleSuccess);
    socket.on("errorCreatingRoom", handleError);

    // Cleanup on unmount
    return () => {
      socket.off("roomCreationSuccess", handleSuccess);
      socket.off("errorCreatingRoom", handleError);
    };
  }, [socket, nav, showToast]);

  // Callable function to create a live match room
  const createLiveMatch = (id: string) => {
    if (!profile?._id) {
      showToast("error", "User profile not available");
      return;
    }

    // Emit event and start loading
    setIsLoading(true);
    socket.connect();
    socket.emit("createLiveMatchFromUpcomingMatch", {
      userId: profile._id,
      matchId: id,
    });
  };

  return { isLoading, createLiveMatch };
};

export default useCreateLiveMatchFromUpcoming;
