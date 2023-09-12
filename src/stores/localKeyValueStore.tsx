import { Store } from "tauri-plugin-store-api";
import { create } from "zustand";
import Profile from "../features/profile";
import { Settings } from "./settingsStore";
import { ModType } from "../features/mod";

export const store = new Store(".settings.dat");
type KVTypeMap = {
  profiles: Profile[];
  activeProfile: Profile;
  settings: Settings;
  installedMods: Map<number, ModType>;
  cachedMods: Map<number, ModType>;
};

async function get<K extends keyof KVTypeMap>(key: K) {
  return store.get<KVTypeMap[K]>(key);
}

async function set<K extends keyof KVTypeMap>(key: K, value: KVTypeMap[K]) {
  return store.set(key, value);
}

async function has<K extends keyof KVTypeMap>(key: K) {
  return store.has(key);
}

async function deleteFromStore<K extends keyof KVTypeMap>(key: K) {
  return store.delete(key);
}

async function keys<K extends keyof KVTypeMap>() {
  return store.keys() as Promise<K[]>;
}

async function values() {
  return store.values<KVTypeMap[keyof KVTypeMap]>();
}

type StoreWrapper = {
  path: string;
  get: typeof get;
  set: typeof set;
  has: typeof has;
  save: typeof store.save;
  delete: typeof deleteFromStore;
  load: typeof store.load;
  clear: typeof store.clear;
  reset: typeof store.reset;
  keys: typeof keys;
  values: typeof values;
};
export const useLocalKVStore = create<StoreWrapper>()(() => ({
  path: store.path,
  get,
  set,
  has,
  save: store.save,
  delete: deleteFromStore,
  load: store.load,
  clear: store.clear,
  reset: store.reset,
  keys,
  values,
  entries: store.entries,
  length: store.length,
  onKeyChange: store.onKeyChange,
  onChange: store.onChange,
}));
