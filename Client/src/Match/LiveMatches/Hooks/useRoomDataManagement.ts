import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useShowToast from "../../../useShowToast";
import { useGetSocketIOInstance } from "../../MatchManagement/Hooks/useGetSocketIOInstance";
import { TeamProps } from "../../socketService";

export interface LiveMatchDataInitial {
  roomId: string;
  team1: TeamProps;
  team2: TeamProps;
  team1Score: string;
  team2Score: string;
  venue?: string;
  date?: string;
  time?: string;
}

export interface LiveMatchDataUpdate {
  team1Score: string;
  team2Score: string;
}

const useRoomDataManagement = (roomId?: string) => {
  const showToast = useShowToast();
  const navigate = useNavigate();
  const [data, setData] = useState<LiveMatchDataInitial | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [isJoined, setIsJoined] = useState<boolean>(false); // Track join state
  const { socket } = useGetSocketIOInstance();

  // Fetch initial data on component mount
  useEffect(() => {
    if (!roomId) {
      showToast("error", "Room ID not provided!");
      return;
    }

    socket.connect();
    setIsLoading(true);

    const handleRoomJoining = (initialData: LiveMatchDataInitial) => {
      setData(initialData);
      setIsLoading(false);
      setIsJoined(true); // Set as joined after successful data fetch
    };

    const handleRoomDNE = (msg: string) => {
      showToast("error", msg);
      setError(msg);
      setIsLoading(false);
    };

    const handleRoomJoiningError = (msg: string) => {
      showToast("error", msg);
      setError(msg);
      setIsLoading(false);
    };

    // Emit initial request and set up listeners
    socket.emit("joinParticularRoom", roomId);
    socket.on("roomJoinSuccess", handleRoomJoining);
    socket.on("roomDNE", handleRoomDNE);
    socket.on("errorJoiningRoom", handleRoomJoiningError);

    // Clean up listeners on unmount
    return () => {
      socket.off("roomJoinSuccess", handleRoomJoining);
      socket.off("roomDNE", handleRoomDNE);
      socket.off("errorJoiningRoom", handleRoomJoiningError);
    };
  }, [roomId, navigate]);

  // Handle score updates and room leave on component unmount
  useEffect(() => {
    const handleScoreUpdate = (updatedData: LiveMatchDataUpdate) => {
      setData((prevData) => (prevData ? { ...prevData, ...updatedData } : null));
    };

    const handleRoomClosing = (msg: string) => {
      showToast("info", msg);
      setTimeout(() => {
        navigate(-1);
      }, 3000);
    };

    const leaveRoom = () => {
      if (roomId && isJoined) {
        // Only leave if joined
        socket.emit("leaveParticularRoom", roomId);
      }
      socket.off("updateLiveScore", handleScoreUpdate);
      socket.off("roomClosing", handleRoomClosing);
    };

    // Set up listeners for ongoing updates
    socket.on("updateLiveScore", handleScoreUpdate);
    socket.on("roomClosing", handleRoomClosing);

    // Clean up listeners on unmount
    return leaveRoom;
  }, [roomId, navigate, isJoined]);

  return { isLoading, data, error };
};

export default useRoomDataManagement;
