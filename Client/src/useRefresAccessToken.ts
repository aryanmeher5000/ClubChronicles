import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import useShowToast from "./useShowToast";
import useClientStateManagement from "./store";
import { authApiClient } from "./apiClient";

export function useRefreshAccessToken() {
  const showToast = useShowToast();
  const { profile, setProfile, clearProfile, clearMultiSessionProfile } = useClientStateManagement();

  const logout = () => {
    clearProfile();
    clearMultiSessionProfile();
  };

  return useMutation<string, AxiosError<string>>({
    mutationFn: async () => {
      const sessionValid = localStorage.getItem("profile");
      if (!sessionValid) return;

      const parsedProfile = JSON.parse(sessionValid);
      if (!parsedProfile || Object.keys(parsedProfile).length === 0) return;

      setProfile(parsedProfile); // Update Zustand state from localStorage.

      // Call API to refresh token.
      const resp = await authApiClient.post("/refreshToken");
      return resp.data.accessToken; // Assuming API returns the new access token.
    },
    onError: (err) => {
      if (err.response) {
        const { status } = err.response;

        // Handle errors based on response status.
        if (status === 403 && profile?._id) {
          logout();
        } else if (status === 401 || status === 500) {
          showToast(
            "error",
            status === 401 ? "Unauthorized! Please log in again." : "Error occurred while authenticating! Please log in."
          );
          logout();
        }
      } else {
        // General error handler for network or unexpected issues.
        showToast("error", "An unexpected error occurred. Please try again.");
        clearProfile();
        clearMultiSessionProfile();
      }
    },
  });
}
