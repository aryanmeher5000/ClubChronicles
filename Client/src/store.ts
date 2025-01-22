import { create } from "zustand";

export interface Profile {
  _id: string;
  isAdmin: boolean;
  role: string;
  department: string;
  profilePic: string | undefined;
}

interface ProfileStore {
  profile: Profile | undefined;
  setProfile: (data: Profile) => void;
  setMultiSessionProfile: (data: Profile) => void;
  clearProfile: () => void;
  clearMultiSessionProfile: () => void;
}

const useClientStateManagement = create<ProfileStore>((set) => ({
  profile: undefined,
  setProfile: (data: Profile) => set({ profile: data }),
  clearProfile: () => set({ profile: undefined }),
  setMultiSessionProfile: (data: Profile) => {
    localStorage.setItem("profile", JSON.stringify(data));
  },
  clearMultiSessionProfile: () => {
    localStorage.removeItem("profile");
  },
}));

export default useClientStateManagement;
