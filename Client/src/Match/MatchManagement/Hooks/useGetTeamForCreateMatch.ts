import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { teamApiClient } from "../../../apiClient";

export interface Team {
  _id: string;
  name: string;
}

export const useGetTeamForCreateMatch = (sport?: string, gender?: string) => {
  return useQuery<{ message: string; body: Team[] }, AxiosError<string>>({
    queryKey: ["teamForMatchMaking", sport, gender],
    queryFn: async () => {
      const response = await teamApiClient.get("/getTeamsMatch", {
        params: { sport: sport, gender: gender },
      });
      return response.data;
    },
    enabled: sport && gender ? true : false,
    staleTime: 24 * 60 * 60 * 1000,
    retry: 2,
    retryDelay: 5000,
  });
};
