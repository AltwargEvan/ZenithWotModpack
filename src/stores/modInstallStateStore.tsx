import { create } from "zustand";
import { InstallData, compareInstallData } from "../features/mod";
import { kv } from "./localKeyValueStore";
import { useProfileStore } from "./profileStore";
import { appCacheDir } from "@tauri-apps/api/path";
import { cleanFilename } from "../utils/cleanFilename";
import { getFileExtension } from "../utils/getFileExtension";
import { createDir, exists, removeDir, removeFile } from "@tauri-apps/api/fs";
import { downloadFile, unzipFile } from "../utils/installUtils";
import { useSettings } from "./settingsStore";
import { copyDirectory } from "../utils/copyDirectory";
import { fs } from "@tauri-apps/api";

type ModInstallStateStore = {
  installed: Map<number, InstallData>; // [id, moddata]
  cached: Map<number, InstallData>; // [id, moddata]
  install: (
    mod: InstallData,
    options?: { updateProfile?: boolean; installConfigIndex?: number }
  ) => Promise<void>;
  uninstall: (
    mod: InstallData,
    options?: { updateProfile?: boolean }
  ) => Promise<void>;
  clearCache: () => Promise<void>;
};

export const useModInstallState = create<ModInstallStateStore>((set, get) => ({
  installed: new Map<number, InstallData>(),
  cached: new Map<number, InstallData>(),
  install: async (mod, options) => {
    // default options
    if (options === undefined) {
      options = {};
    }
    if (options.installConfigIndex === undefined)
      options.installConfigIndex = 0;
    if (!options.updateProfile === undefined) options.updateProfile = true;
    // state stores
    const internalState = get();
    const settings = useSettings.getState();
    if (!settings.gameDirectory)
      throw new Error(
        "Cannot install mod. You must set game directory in settings."
      );
    // folder stuffs
    const appCacheDirPath = await appCacheDir();
    const fileExtension = getFileExtension(mod.downloadUrl);
    const modNameCleaned = cleanFilename(mod.name);
    const cacheFolderPath = `${appCacheDirPath}/mods/${modNameCleaned}`;
    const downloadPath = `${cacheFolderPath}/${modNameCleaned}.${fileExtension}`;

    // CACHE (add or check already there)
    const cachedMod =
      internalState.cached.has(mod.id) && internalState.cached.get(mod.id);
    const modIsCached = cachedMod && compareInstallData(cachedMod, mod);

    if (!modIsCached) {
      // clean out the cache folder
      if (await exists(cacheFolderPath)) {
        await removeDir(cacheFolderPath, { recursive: true });
      }
      await createDir(cacheFolderPath, { recursive: true });

      await downloadFile(mod.downloadUrl, downloadPath);

      if (fileExtension === "zip") {
        await unzipFile(downloadPath, cacheFolderPath);
        await removeFile(downloadPath); // delete the original zip
      }
      internalState.cached.set(mod.id, mod);
      set((prev) => ({
        ...prev,
        cached: new Map(internalState.cached),
      }));
      await kv.set("cachedMods", internalState.cached);
    }

    // INSTALL
    const config = mod.installConfig.filter((_, index) =>
      mod.installConfigIndices.includes(index)
    );

    const gameResModsFolderPath = `${settings.gameDirectory}/res_mods/${settings.gameVersion}/${modNameCleaned}`;
    const gameModsFolderPath = `${settings.gameDirectory}/mods/${settings.gameVersion}/${modNameCleaned}`;
    if (await exists(gameModsFolderPath)) {
      await removeDir(gameModsFolderPath, { recursive: true });
    }
    if (await exists(gameResModsFolderPath)) {
      await removeDir(gameResModsFolderPath, { recursive: true });
    }

    for (const item of config) {
      if (item.modsPath !== null) {
        await createDir(gameModsFolderPath, { recursive: true });
        await copyDirectory(
          `${cacheFolderPath}/${item.modsPath}`,
          gameModsFolderPath
        );
      }
      if (item.resPath !== null) {
        await createDir(gameModsFolderPath, { recursive: true });
        await copyDirectory(
          `${cacheFolderPath}/${item.resPath}`,
          gameModsFolderPath
        );
      }
    }

    internalState.installed.set(mod.id, mod);
    set((prev) => ({
      ...prev,
      installed: new Map(internalState.installed),
    }));

    if (options.updateProfile) {
      const profileStore = useProfileStore.getState();
      const profile = profileStore.activeProfile;
      await profileStore.updateProfile({
        ...profile,
        mods: profile.mods.concat(mod),
      });
    }

    await kv.set("installedMods", internalState.installed);
  },
  uninstall: async (mod, options) => {
    if (options === undefined) options = {};
    if (options.updateProfile === undefined) options.updateProfile = true;
    const profileStore = useProfileStore.getState();
    const internalState = get();
    const settings = useSettings.getState();
    if (!settings.gameDirectory)
      throw new Error(
        "Cannot uninstall mod. You must set game directory in settings."
      );
    const modNameCleaned = cleanFilename(mod.name);

    const modsFolder = `${settings.gameDirectory}/mods/${settings.gameVersion}/${modNameCleaned}`;
    if (await exists(modsFolder))
      await fs.removeDir(modsFolder, { recursive: true });
    const resFolder = `${settings.gameDirectory}/res_mods/${settings.gameVersion}/${modNameCleaned}`;
    if (await exists(resFolder))
      await fs.removeDir(resFolder, { recursive: true });

    internalState.installed.delete(mod.id);
    set((prev) => ({ ...prev, installed: internalState.installed }));
    if (options.updateProfile) {
      const profile = profileStore.activeProfile;
      await profileStore.updateProfile({
        ...profile,
        mods: profile.mods.filter((x) => x.id !== mod.id),
      });
    }
    await kv.set("installedMods", internalState.installed);
  },
  clearCache: async () => {
    const settings = useSettings.getState();
    if (!settings.gameDirectory)
      throw new Error(
        "Cannot install mod. You must set game directory in settings."
      );
    const appCacheDirPath = await appCacheDir();
    await fs.removeDir(`${appCacheDirPath}/mods`, { recursive: true });
    set((prev) => ({ ...prev, cached: new Map<number, InstallData>() }));
    await kv.set("cachedMods", new Map<number, InstallData>());
  },
}));

export async function initializeModInstallState() {
  const installed = await kv.get("installedMods");
  const cached = await kv.get("cachedMods");
  useModInstallState.setState((prev) => ({
    ...prev,
    installed: installed || new Map(),
    cached: cached || new Map(),
  }));
}
