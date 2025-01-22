import { useGetQueryWithId } from "../../ReusableQueryFunctions";
import { TeamsCardProps } from "../../Team/Hooks/useGetTeams";
import { profileApiClient } from "../../apiClient";
import useClientStateManagement from "../../store";

export interface ProfileData {
  _id: string;
  name: string;
  profilePic: string;
  gender: string;
  department?: { _id: string; name: string };
  about: string;
  achievements: string;
  teamsAccepted?: TeamsCardProps[];
}

export function useGetProfile(id?: string) {
  const { profile } = useClientStateManagement();
  if (id === "ownProfile") id = profile?._id;
  return useGetQueryWithId<ProfileData>(["profile"], profileApiClient, "viewProfile", id);
}
