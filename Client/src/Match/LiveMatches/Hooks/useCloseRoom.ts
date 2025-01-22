import { useEffect, useState } from "react";
import useShowToast from "../../../useShowToast";
import { useGetSocketIOInstance } from "../../MatchManagement/Hooks/useGetSocketIOInstance";
import { useNavigate } from "react-router-dom";
import useClientStateManagement from "../../../store";

interface InpProps {
  roomId: string;
  winnerTeam: "TEAM1" | "TEAM2" | "TIE";
  scoreUpdater?: string;
}

const useCloseRoom = () => {
  const { socket } = useGetSocketIOInstance();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { profile } = useClientStateManagement();
  const nav = useNavigate();
  const showToast = useShowToast();

  useEffect(() => {
    function handleRoomClosingError(msg: string) {
      setIsLoading(false);
      showToast("error", msg);
    }

    function handleRoomClosed() {
      setIsLoading(false);
      showToast("success", "Room closed and auto match summary created.");
    }

    // Register listeners
    socket.on("errorClosingRoom", handleRoomClosingError);
    socket.on("roomClosed", handleRoomClosed);

    // Cleanup listeners on unmount
    return () => {
      socket?.off("errorClosingRoom", handleRoomClosingError);
      socket?.off("roomClosed", handleRoomClosed);
    };
  }, [socket, nav, showToast]);

  function closeRoom({ roomId, winnerTeam, scoreUpdater }: InpProps) {
    if (!roomId || !winnerTeam || !scoreUpdater) {
      showToast("error", "Provide roomId and winner team to proceed!");
      return;
    }
    if (!profile?._id) {
      showToast("error", "User not authenticated to close the room!");
      return;
    }

    setIsLoading(true);
    showToast("info", "Closing this room");
    socket?.emit("closeParticularRoom", {
      roomId,
      winnerTeam,
      scoreUpdater,
    });
  }

  return { isLoading, closeRoom };
};

export default useCloseRoom;
