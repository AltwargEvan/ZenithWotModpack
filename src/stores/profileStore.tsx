import { create } from "zustand";
import Profile, { defaultProfile } from "../features/profile";
import { useLocalKVStore } from "./localKeyValueStore";
import { stringToHslColor } from "../utils/stringToHslColor";

type ProfileStore = {
  activeProfile: Profile;
  profiles: Array<Profile>;
  duplicateProfile: (profile: Profile) => Promise<void>;
  updateProfile: (profile: Profile) => Promise<void>;
  deleteProfile: (profile: Profile) => Promise<void>;
  resetAllProfileData: () => Promise<void>;
  setActiveProfile: (profile: Profile) => Promise<void>;
};

const getUniqueName = (fileName: string, index = 0): any => {
  let checkName = fileName,
    ext = "";
  if (index) {
    if (checkName.indexOf(".") > -1) {
      let tokens = checkName.split(".");
      ext = "." + tokens.pop();
      checkName = tokens.join(".");
    }

    // make any pattern here
    checkName = `${checkName} (${index})${ext}`;
  }
  const state = useProfileStore.getState();
  const nameExists =
    state.profiles.filter((f) => f.name === checkName).length > 0;
  return nameExists ? getUniqueName(fileName, index + 1) : checkName;
};
export const useProfileStore = create<ProfileStore>((set, getState) => ({
  // this gets inited so its fine
  activeProfile: {} as Profile,
  profiles: [],

  duplicateProfile: async (profile) => {
    const state = getState();
    const kv = useLocalKVStore.getState();
    const newProfile = structuredClone(profile);
    newProfile.name = getUniqueName(profile.name) as string;
    newProfile.id = crypto.randomUUID();
    newProfile.avatar.color = stringToHslColor(newProfile.name);
    newProfile.createdAt = new Date().toLocaleDateString();
    const newProfiles = [...state.profiles, newProfile];
    set((prev) => ({ ...prev, profiles: newProfiles }));
    await kv.set("profiles", newProfiles);
    await kv.save();
  },
  updateProfile: async (profile) => {
    const state = getState();
    const kv = useLocalKVStore.getState();
    const newProfiles = state.profiles.map((item) =>
      item.id === profile.id ? profile : item
    );
    const activeProfile =
      state.activeProfile?.id === profile.id ? profile : state.activeProfile;
    set((prev) => ({ ...prev, profiles: newProfiles, activeProfile }));
    await kv.set("profiles", newProfiles);
    if (activeProfile) await kv.set("activeProfile", activeProfile);
    await kv.save();
  },
  deleteProfile: async (profile) => {
    const state = getState();
    const kv = useLocalKVStore.getState();
    const newProfiles = state.profiles.filter((item) => item.id !== profile.id);
    if (profile.id === state.activeProfile?.id)
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
      (prof) => prof.id === profile.id
    );
    if (!newActiveProfile)
      throw new Error("Profile with provided name not found in state.");
    set((prev) => ({ ...prev, activeProfile: newActiveProfile }));
    await kv.set("activeProfile", newActiveProfile);
    await kv.save();
  },
  resetAllProfileData: async () => {
    const kv = useLocalKVStore.getState();
    const activeProfile = defaultProfile;
    const profiles = [activeProfile];
    useProfileStore.setState((prev) => ({ ...prev, profiles, activeProfile }));
    kv.set("activeProfile", activeProfile);
    kv.set("profiles", profiles);
  },
}));

export async function initProfileStore() {
  const kv = useLocalKVStore.getState();
  const activeProfile = (await kv.get("activeProfile")) || defaultProfile;
  const profiles = (await kv.get("profiles")) || [activeProfile];
  useProfileStore.setState((prev) => ({ ...prev, profiles, activeProfile }));
}
