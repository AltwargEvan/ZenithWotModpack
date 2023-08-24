import { appDataDir, appCacheDir } from "@tauri-apps/api/path";
import { readTextFile, removeDir, writeTextFile } from "@tauri-apps/api/fs";
import { create } from "zustand";
import superjson from "superjson";
import { ModType } from "../modInstaller/mod";

const getGameInstallsDataPath = async () => {
  const appDataDirPath = await appDataDir();
  return `${appDataDirPath}/gameInstalls.json`;
};

const getAppCacheDataPath = async () => {
  const appDataDirPath = await appDataDir();
  return `${appDataDirPath}/appCache.json`;
};

interface InstallState {
  gameInstalls: Map<number, ModType>;
  appCache: Map<number, ModType>;
  initialized: boolean;
  addToGameInstalls: (mod: ModType) => Promise<void>;
  removeFromGameInstalls: (id: number) => Promise<void>;
  addToAppCache: (mod: ModType) => Promise<void>;
  removeFromAppCache: (id: number) => Promise<void>;
  clearCache: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useModInstallState = create<InstallState>()((set, getPrev) => ({
  gameInstalls: new Map(),
  appCache: new Map(),
  initialized: false,
  clearCache: async () => {
    const path = await getAppCacheDataPath();
    await writeTextFile(path, superjson.stringify(new Map<number, ModType>()));
    const cacheDir = await appCacheDir();
    set((prev) => ({ ...prev, appCache: new Map() }));
    await removeDir(`${cacheDir}/mods`, { recursive: true });
  },
  addToGameInstalls: async (mod) => {
    const prev = getPrev();
    await prev.initialize();
    prev.gameInstalls.set(mod.id, mod);
    const path = await getGameInstallsDataPath();
    await writeTextFile(path, superjson.stringify(prev.gameInstalls));
    set((prev) => ({ ...prev, gameInstalls: new Map(prev.gameInstalls) }));
  },
  removeFromGameInstalls: async (id) => {
    const prev = getPrev();
    await prev.initialize();
    prev.gameInstalls.delete(id);
    const path = await getGameInstallsDataPath();
    await writeTextFile(path, superjson.stringify(prev.gameInstalls));
    set((prev) => ({ ...prev, gameInstalls: new Map(prev.gameInstalls) }));
  },
  addToAppCache: async (mod) => {
    const prev = getPrev();
    await prev.initialize();
    prev.appCache.set(mod.id, mod);
    const path = await getAppCacheDataPath();
    await writeTextFile(path, superjson.stringify(prev.appCache));
    set((prev) => ({ ...prev, appCache: new Map(prev.appCache) }));
  },
  removeFromAppCache: async (id) => {
    const prev = getPrev();
    await prev.initialize();
    prev.appCache.delete(id);
    const path = await getAppCacheDataPath();
    await writeTextFile(path, superjson.stringify(prev.appCache));
    set((prev) => ({ ...prev, appCache: new Map(prev.appCache) }));
  },
  initialize: async () => {
    // this is inefficient. maybe fix this when im not lazy.
    // need a better way of awaiting appDataDir but probably doesn't actually matter
    const prev = getPrev();
    if (prev.initialized) return;
    console.log("Initialize from data");
    try {
      const cachePath = await getAppCacheDataPath();
      const cacheData = await readTextFile(cachePath);
      console.log("cache data", cacheData);

      set((prev) => ({
        ...prev,
        appCache: superjson.parse<Map<number, ModType>>(cacheData),
      }));
    } catch (error) {
      console.error("Failed to parse app cache.", error);
    }
    try {
      const installPath = await getAppCacheDataPath();
      const installData = await readTextFile(installPath);
      console.log("install data", installData);

      set((prev) => ({
        ...prev,
        gameInstalls: superjson.parse<Map<number, ModType>>(installData),
      }));
    } catch (error) {
      console.error("Failed to parse install data.", error);
    }
    set((prev) => ({
      ...prev,
      initialized: true,
    }));
  },
}));
