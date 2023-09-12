import { create } from "zustand";
import { ModType } from "../features/mod";
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
  installed: Map<number, ModType>; // [id, moddata]
  cached: Map<number, ModType>; // [id, moddata]
  install: (mod: ModType) => Promise<void>;
  uninstall: (mod: ModType) => Promise<void>;
  clearCache: () => Promise<void>;
};

export const useModInstallState = create<ModInstallStateStore>((set, get) => ({
  installed: new Map<number, ModType>(),
  cached: new Map<number, ModType>(),
  install: async (mod, installConfigIndex?: number) => {
    // state stores
    const internalState = get();
    const settings = useSettings.getState();
    if (!settings.gameDirectory)
      throw new Error(
        "Cannot install mod. You must set game directory in settings."
      );
    const profileStore = useProfileStore.getState();
    // folder stuffs
    const appCacheDirPath = await appCacheDir();
    const fileExtension = getFileExtension(mod.downloadUrl);
    const modNameCleaned = cleanFilename(mod.name);
    const cacheFolderPath = `${appCacheDirPath}/mods/${modNameCleaned}`;
    const downloadPath = `${cacheFolderPath}/${modNameCleaned}.${fileExtension}`;

    // CACHE (add or check already there)
    const modInCache = internalState.cached.has(mod.id);
    const cachedMod = internalState.cached.get(mod.id);
    const modMatchesCachedModVersions =
      cachedMod?.modversion === mod.modversion &&
      cachedMod.gameversion === mod.gameversion;

    if (!modInCache && !modMatchesCachedModVersions) {
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
    let installConfig = mod.installdata[installConfigIndex || 0];
    if (!installConfig)
      installConfig = {
        modsPath: "",
        name: mod.name,
      };

    if (installConfig.modsPath !== undefined) {
      const gameModsFolderPath = `${settings.gameDirectory}/mods/${settings.gameVersion}/${modNameCleaned}`;
      if (await exists(gameModsFolderPath)) {
        await removeDir(gameModsFolderPath, { recursive: true });
      }
      await createDir(gameModsFolderPath, { recursive: true });
      await copyDirectory(
        `${cacheFolderPath}/${installConfig.modsPath}`,
        gameModsFolderPath
      );
    }
    if (installConfig.resPath !== undefined) {
      const gameResModsFolderPath = `${settings.gameDirectory}/res_mods/${settings.gameVersion}/${modNameCleaned}`;
      if (await exists(gameResModsFolderPath)) {
        await removeDir(gameResModsFolderPath, { recursive: true });
      }
      await createDir(gameResModsFolderPath, { recursive: true });
      await copyDirectory(
        `${cacheFolderPath}/${installConfig.resPath}`,
        gameResModsFolderPath
      );
    }

    internalState.installed.set(mod.id, mod);
    set((prev) => ({
      ...prev,
      installed: new Map(internalState.installed),
    }));

    const profile = profileStore.activeProfile;
    await profileStore.updateProfile({
      ...profile,
      mods: profile.mods.concat(mod),
    });
    await kv.set("installedMods", internalState.installed);
  },
  uninstall: async (mod) => {
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
    const profile = profileStore.activeProfile;
    await profileStore.updateProfile({
      ...profile,
      mods: profile.mods.filter((x) => x.id != mod.id),
    });
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
    set((prev) => ({ ...prev, cached: new Map<number, ModType>() }));
    kv.set("cachedMods", new Map<number, ModType>());
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
