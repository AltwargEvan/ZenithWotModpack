import { create } from "zustand";
import Profile from "../features/profile";
import { useLocalKVStore } from "./localKeyValueStore";

type ProfileStore = {
  activeProfile: Profile | null;
  profiles: Array<Profile>;
  createProfile: (profile: Profile) => Promise<void>;
  updateProfile: (profile: Profile) => Promise<void>;
  deleteProfile: (profile: Profile) => Promise<void>;

  setActiveProfile: (profile: Profile) => Promise<void>;
};

export const useProfileStore = create<ProfileStore>((set, getState) => ({
  activeProfile: null,
  profiles: [],

  createProfile: async (profile) => {
    const state = getState();
    const kv = useLocalKVStore.getState();
    const alreadyExists = state.profiles.find(
      (item) => item.name === profile.name
    );
    if (alreadyExists) throw new Error("Profile with name already exists");
    const newProfiles = [...state.profiles, profile];
    set((prev) => ({ ...prev, profiles: newProfiles }));
    await kv.set("profiles", newProfiles);
    await kv.save();
  },
  updateProfile: async (profile) => {
    const state = getState();
    const kv = useLocalKVStore.getState();
    const newProfiles = state.profiles.map((item) =>
      item.name === profile.name ? profile : item
    );
    const activeProfile =
      state.activeProfile?.name === profile.name
        ? profile
        : state.activeProfile;
    set((prev) => ({ ...prev, profiles: newProfiles, activeProfile }));
    await kv.set("profiles", newProfiles);
    if (activeProfile) await kv.set("activeProfile", activeProfile);
    await kv.save();
  },
  deleteProfile: async (profile) => {
    const state = getState();
    const kv = useLocalKVStore.getState();
    const newProfiles = state.profiles.filter(
      (item) => item.name !== profile.name
    );
    if (profile.name === state.activeProfile?.name)
      throw new Error("Cannot delete the current active profile");
    if (state.profiles.length === 1)
      throw new Error("Cannot delete the last profile. Must have at least 1");

    set((prev) => ({ ...prev, profiles: newProfiles }));
    await kv.set("profiles", newProfiles);
    await kv.save();
  },
  setActiveProfile: async (profile) => {
    const state = getState();
    const kv = useLocalKVStore.getState();
    const newActiveProfile = state.profiles.find(
      (prof) => prof.name === profile.name
    );
    if (!newActiveProfile)
      throw new Error("Profile with provided name not found in state.");
    set((prev) => ({ ...prev, activeProfile: newActiveProfile }));
    await kv.set("activeProfile", newActiveProfile);
    await kv.save();
  },
}));
const defaultProfile: Profile = {
  name: "Default",
  mods: [],
};
export async function initProfileStore() {
  const kv = useLocalKVStore.getState();
  const profiles = (await kv.get("profiles")) || [];
  const activeProfile = (await kv.get("activeProfile")) || defaultProfile;
  useProfileStore.setState((prev) => ({ ...prev, profiles, activeProfile }));
}
