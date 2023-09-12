import { Store } from "tauri-plugin-store-api";
import Profile from "../features/profile";
import { Settings } from "./settingsStore";
import { ModType } from "../features/mod";
import SuperJSON from "superjson";

export const store = new Store(`data.json`);

type KVTypeMap = {
  profiles: Profile[];
  activeProfile: Profile;
  settings: Settings;
  installedMods: Map<number, ModType>;
  cachedMods: Map<number, ModType>;
};

async function get<K extends keyof KVTypeMap>(key: K) {
  const res = await store.get<string>(key);
  return res ? SuperJSON.parse<KVTypeMap[K]>(res) : null;
}

async function set<K extends keyof KVTypeMap>(key: K, value: KVTypeMap[K]) {
  await store.set(key, SuperJSON.stringify(value));
  await store.save();
}

function has<K extends keyof KVTypeMap>(key: K) {
  return store.has(key);
}

async function deleteFromStore<K extends keyof KVTypeMap>(key: K) {
  await store.delete(key);
  store.save();
}

export const kv = {
  path: store.path,
  get,
  set,
  has,
  save: store.save,
  delete: deleteFromStore,
  load: store.load,
  clear: store.clear,
  reset: store.reset,
  // keys,
  // values,
  // entries: store.entries,
  length: store.length,
  onKeyChange: store.onKeyChange,
  onChange: store.onChange,
};
