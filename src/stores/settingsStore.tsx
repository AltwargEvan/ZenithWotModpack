import { create } from "zustand";
import { readDir, readTextFile } from "@tauri-apps/api/fs";
import { kv } from "./localKeyValueStore";

export type Settings = {
  gameDirectory: string | null;
};

type SettingOperations = {
  gameVersion: string;
  setGameDirectory: (folder: string) => Promise<void>;
};

export const useSettings = create<Settings & SettingOperations>((set, get) => ({
  gameDirectory: null,
  gameVersion: "1.22.0.0",
  setGameDirectory: async (folder) => {
    const entries = await readDir(folder);
    if (!entries.find((entry) => entry.name === "WorldOfTanks.exe"))
      throw new Error(
        "The game client was not detected in the specified folder."
      );
    set((prev) => ({ ...prev, gameDirectory: folder }));
    await kv.set("settings", {
      gameDirectory: folder,
    });
  },
}));

export const initSettingsStore = async () => {
  const settings = await kv.get("settings");
  if (settings?.gameDirectory) {
    const versionXml = await readTextFile(
      `${settings.gameDirectory}/version.xml`
    );
    const data = new DOMParser().parseFromString(versionXml, "text/xml");
    const version = data
      .getElementsByTagName("version")[0]
      .innerHTML.split("#")[0]
      .replace(/[^0-9.]/g, "")
      .slice(1);
    useSettings.setState((prev) => ({
      ...prev,
      gameVersion: version,
    }));
  }
  useSettings.setState((prev) => ({
    ...prev,
    gameDirectory: settings?.gameDirectory || null,
  }));
};
