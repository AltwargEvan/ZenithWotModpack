import { CloudInstallConfig } from "@zenith/utils/apitypes";
import { ObservableMap, ObservableSet, runInAction } from "mobx";
import { AuthStore } from "../supabase/supabaseContext";
import {
  CachedMod,
  LocalInstallConfig,
  installMods,
  uninstallMod,
} from "@/api/rust";
import { SettingsManager } from "../settingsManager/settingsManager";

export class ModManager {
  installConfigs: ObservableMap<number, LocalInstallConfig>;
  lockedModIds: ObservableSet<number> = new ObservableSet();
  settingsManager: SettingsManager;

  constructor(
    initialLocalInstallConfigs: LocalInstallConfig[],
    settingsManager: SettingsManager
  ) {
    this.settingsManager = settingsManager;
    this.installConfigs = new ObservableMap();
    initialLocalInstallConfigs.forEach((cfg) =>
      this.installConfigs.set(cfg.id, cfg)
    );
    // TODO - resolve the diff between cloud and local configs and update the cloud accordingly (Ex. user on a diff machine)
  }

  lockMod = (modId: number) => runInAction(() => this.lockedModIds.add(modId));
  unlockMod = (modId: number) =>
    runInAction(() => this.lockedModIds.delete(modId));

  async addInstallConfigs(
    mod: CachedMod,
    installConfigs: CloudInstallConfig[],
    downloadUrl: string
  ) {
    // prevent mods already being modified from being installed twice or some weird shit
    if (this.lockedModIds.has(mod.id)) return;
    this.lockMod(mod.id);
    const updateProfilePromise = new Promise((resolve, reject) => {
      try {
        const session = AuthStore.getState().session;
        if (!session) resolve(true);
        // TODO - if user is logged in, update database
        resolve(true);
      } catch (e) {
        console.error(e);
        reject(e);
      }
    });

    const installLocallyPromise = new Promise(async (resolve, reject) => {
      try {
        const localInstallConfigs = installConfigs.map((cfg) => {
          const data: LocalInstallConfig = {
            id: cfg.id,
            mod_id: cfg.modId,
            name: cfg.name,
            mods_path: cfg.modsPath,
            res_path: cfg.resModsPath,
            configs_path: cfg.configsPath,
            game_directory: this.settingsManager.gameDirectory,
          };
          return data;
        });
        await installMods(mod, localInstallConfigs, downloadUrl);
        runInAction(() =>
          localInstallConfigs.forEach((cfg) =>
            this.installConfigs.set(cfg.id, cfg)
          )
        );
        resolve(true);
      } catch (e) {
        console.error("Failed to install mod", e);
        reject(e);
      }
    });

    await Promise.allSettled([updateProfilePromise, installLocallyPromise]);
    this.unlockMod(mod.id);
  }

  async removeInstallConfigs(mod: CachedMod, installConfigIds: number[]) {
    if (this.lockedModIds.has(mod.id)) return;
    this.lockMod(mod.id);

    const updateProfilePromise = new Promise((resolve, reject) => {
      const session = AuthStore.getState().session;
      if (!session) resolve(true);
      // TODO - if user is logged in, update database
      resolve(true);
    });

    const uninstallLocallyPromises = installConfigIds.map((id) => {
      return new Promise(async (resolve, reject) => {
        try {
          const localInstallConfig = this.installConfigs.get(id);
          if (!localInstallConfig)
            throw new Error(
              "Local install Config not found in client cache layer"
            );
          await uninstallMod(mod, localInstallConfig);
          runInAction(() => {
            this.installConfigs.delete(id);
          });
          resolve(true);
        } catch (e) {
          console.error("Failed to uninstall mod", e);
          reject(e);
        }
      });
    });

    await Promise.all([updateProfilePromise, ...uninstallLocallyPromises]);
    this.unlockMod(mod.id);
  }
}
