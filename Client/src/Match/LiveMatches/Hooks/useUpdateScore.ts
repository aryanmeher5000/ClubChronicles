import { useEffect, useState } from "react";
import useShowToast from "../../../useShowToast";
import { useGetSocketIOInstance } from "../../MatchManagement/Hooks/useGetSocketIOInstance";
import useClientStateManagement from "../../../store";
import { UpdateScoreData } from "../../socketService";

const useUpdateScore = () => {
  const profile = useClientStateManagement((p) => p.profile);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const showToast = useShowToast();
  const { socket } = useGetSocketIOInstance();

  useEffect(() => {
    const handleScoreUpdated = () => {
      setIsLoading(false);
    };

    const handleRoomDNE = (msg: string) => {
      setIsLoading(false);
      showToast("error", msg);
    };

    const handleErrorUpdatingScore = (msg: string) => {
      setIsLoading(false);
      showToast("error", msg);
    };

    // Register event listeners
    socket.on("updateLiveScore", handleScoreUpdated);
    socket.on("roomDNE", handleRoomDNE);
    socket.on("errorUpdatingScore", handleErrorUpdatingScore);

    // Clean up listeners on unmount
    return () => {
      socket.off("updateLiveScore", handleScoreUpdated);
      socket.off("roomDNE", handleRoomDNE);
      socket.off("errorUpdatingScore", handleErrorUpdatingScore);
    };
  }, [socket, showToast]);

  function updateScore(data: UpdateScoreData) {
    if (!data) {
      showToast("error", "No data received!");
      return;
    }
    if (!profile) {
      showToast("error", "Please login!");
      return;
    }

    setIsLoading(true);
    socket.emit("updateScore", data);
  }

  return { updateScore, isLoading };
};

export default useUpdateScore;
