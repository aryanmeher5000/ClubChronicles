import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useShowToast from "../../../useShowToast";
import { useGetSocketIOInstance } from "./useGetSocketIOInstance";
import { z } from "zod";

export const createLiveMatchSchema = z.object({
  team1: z.string().regex(/^[a-fA-F0-9]{24}$/, "Invalid team ID"),
  team2: z.string().regex(/^[a-fA-F0-9]{24}$/, "Invalid team ID"),
  sport: z.enum([
    "CRICKET",
    "FOOTBALL",
    "VOLLEYBALL",
    "BASKETBALL",
    "CHESS",
    "CARROM",
    "TABLE_TENNIS",
    "BADMINTON",
    "KABBADI",
    "TUG_OF_WAR",
    "SHOTPUT",
  ]),
  gender: z.enum(["MALE", "FEMALE"]),
  tag: z.enum(["FINAL", "SEMI_FINAL", "QUARTER_FINAL", "DO_OR_DIE"]).or(z.literal("")),
  scoreUpdater: z.string().regex(/^[a-fA-F0-9]{24}$/, "Invalid user ID"),
  venue: z.string().min(3).max(100).optional().or(z.literal("")),
});

export type CreateLiveMatchProps = z.infer<typeof createLiveMatchSchema>;

const useCreateLiveMatchEnteredData = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const showToast = useShowToast();
  const nav = useNavigate();
  const { socket } = useGetSocketIOInstance();

  useEffect(() => {
    const handleSuccess = (roomId: string) => {
      setIsLoading(false);
      showToast("success", "Room created successfully");
      nav(`/adminDashboard/liveMatchManagement/scoreUpdation/${roomId}`);
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
  const createLiveMatch = (data: CreateLiveMatchProps) => {
    // Emit event and start loading
    setIsLoading(true);
    socket.connect();
    socket.emit("createLiveMatchFromEnteredData", data);
  };

  return { isLoading, createLiveMatch };
};

export default useCreateLiveMatchEnteredData;
