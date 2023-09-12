import { create } from "zustand";
import { useLocalKVStore } from "./localKeyValueStore";
import { readDir } from "@tauri-apps/api/fs";

export type Settings = {
  gameDirectory: string | null;
};

type SettingOperations = {
  gameVersion: string;
  setGameDirectory: (folder: string) => Promise<void>;
};

export const useSettings = create<Settings & SettingOperations>((set, get) => ({
  gameDirectory: null,
  gameVersion: "1.21.1.0",
  setGameDirectory: async (folder) => {
    const state = get();
    const entries = await readDir(folder);
    if (!entries.find((entry) => entry.name === "WorldOfTanks.exe"))
      throw new Error(
        "The game client was not detected in the specified folder."
      );
    set((prev) => ({ ...prev, gameDirectory: folder }));
    await useLocalKVStore.getState().set("settings", {
      gameDirectory: state.gameDirectory,
    });
  },
}));

export const initSettingsStore = async () => {
  const kv = useLocalKVStore.getState();
  const settings = await kv.get("settings");
  useSettings.setState((prev) => ({
    ...prev,
    gameDirectory: settings?.gameDirectory || null,
  }));
};
