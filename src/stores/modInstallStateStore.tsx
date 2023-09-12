import { create } from "zustand";
import { ModType } from "../features/mod";
import { useLocalKVStore } from "./localKeyValueStore";
import { useProfileStore } from "./profileStore";
import { appCacheDir } from "@tauri-apps/api/path";
import { cleanFilename } from "../utils/cleanFilename";
import { getFileExtension } from "../utils/getFileExtension";
import { createDir, exists, removeDir, removeFile } from "@tauri-apps/api/fs";
import { downloadFile, unzipFile } from "../utils/installUtils";
import { useSettings } from "./settingsStore";
import { copyDirectory } from "../utils/copyDirectory";
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
    const kv = useLocalKVStore.getState();
    const internalState = get();
    const settings = useSettings.getState();
    const profileStore = useProfileStore.getState();

    // folder stuffs
    const appCacheDirPath = await appCacheDir();
    const fileExtension = getFileExtension(mod.downloadUrl);
    const modNameCleaned = cleanFilename(mod.name);
    const cacheFolderPath = `${appCacheDirPath}/mods/${modNameCleaned}`;
    const downloadPath = `${cacheFolderPath}/${modNameCleaned}.${fileExtension}`;

    // CACHE (add or check already there)
    const modInCache = !internalState.cached.has(mod.id);
    const cachedMod = internalState.cached.get(mod.id);
    const modMatchesCachedModVersions =
      cachedMod?.modversion === mod.modversion &&
      cachedMod.gameversion === mod.gameversion;

    if (!modInCache || !modMatchesCachedModVersions) {
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
      await kv.save();
    }

    // INSTALL
    const installConfig = mod.installdata[installConfigIndex || 0];
    if (installConfig.modsPath) {
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
    if (installConfig.resPath) {
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
    await kv.save();
  },
  uninstall: async (mod) => {},
  clearCache: async () => {},
}));

export async function initializeModInstallState() {
  const kv = useLocalKVStore.getState();
  const installed =
    (await kv.get("installedMods")) || new Map<number, ModType>();
  const cached = (await kv.get("cachedMods")) || new Map<number, ModType>();
  useModInstallState.setState((prev) => ({ ...prev, installed, cached }));
}
