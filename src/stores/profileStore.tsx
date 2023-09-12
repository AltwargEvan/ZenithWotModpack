import { create } from "zustand";
import Profile, { defaultProfile } from "../features/profile";
import { stringToHslColor } from "../utils/stringToHslColor";
import { kv } from "./localKeyValueStore";
import { useModInstallState } from "./modInstallStateStore";
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
    const newProfile = structuredClone(profile);
    newProfile.name = getUniqueName(profile.name) as string;
    newProfile.id = crypto.randomUUID();
    newProfile.avatar.color = stringToHslColor(newProfile.name);
    newProfile.createdAt = new Date().toLocaleDateString();
    const newProfiles = [...state.profiles, newProfile];
    set((prev) => ({ ...prev, profiles: newProfiles }));
    await kv.set("profiles", newProfiles);
  },
  updateProfile: async (profile) => {
    const state = getState();
    const newProfiles = state.profiles.map((item) =>
      item.id === profile.id ? profile : item
    );
    const activeProfile =
      state.activeProfile?.id === profile.id ? profile : state.activeProfile;
    set((prev) => ({ ...prev, profiles: newProfiles, activeProfile }));
    await kv.set("profiles", newProfiles);
    if (activeProfile) await kv.set("activeProfile", activeProfile);
  },
  deleteProfile: async (profile) => {
    const state = getState();
    const newProfiles = state.profiles.filter((item) => item.id !== profile.id);
    if (profile.id === state.activeProfile?.id)
      throw new Error("Cannot delete the current active profile");
    if (state.profiles.length === 1)
      throw new Error("Cannot delete the last profile. Must have at least 1");

    set((prev) => ({ ...prev, profiles: newProfiles }));
    await kv.set("profiles", newProfiles);
  },
  setActiveProfile: async (newProfile) => {
    const state = getState();
    const oldProfile = state.activeProfile;
    const installer = useModInstallState.getState();
    const newActiveProfile = state.profiles.find(
      (prof) => prof.id === newProfile.id
    );

    if (!newActiveProfile)
      throw new Error("Profile with provided name not found in state.");
    set((prev) => ({ ...prev, activeProfile: newActiveProfile }));
    await kv.set("activeProfile", newActiveProfile);

    // this could cause version issues. make a mod version compare function later
    const modsToInstall = newActiveProfile.mods.filter(
      (x) => !oldProfile.mods.find((y) => y.id === x.id)
    );
    const modsToUninstall = oldProfile.mods.filter(
      (x) => !newActiveProfile.mods.find((y) => y.id === x.id)
    );

    for (const mod of modsToUninstall) {
      await installer.uninstall(mod, { updateProfile: false });
    }

    for (const mod of modsToInstall) {
      await installer.install(mod, {
        updateProfile: false,
        installConfigIndex: mod.installConfigIndex,
      });
    }
  },
  resetAllProfileData: async () => {
    const activeProfile = defaultProfile;
    const profiles = [activeProfile];
    useProfileStore.setState((prev) => ({ ...prev, profiles, activeProfile }));
    kv.set("activeProfile", activeProfile);
    kv.set("profiles", profiles);
  },
}));

export async function initProfileStore() {
  const activeProfile = (await kv.get("activeProfile")) || defaultProfile;
  const profiles = (await kv.get("profiles")) || [activeProfile];
  useProfileStore.setState((prev) => ({ ...prev, profiles, activeProfile }));
}
