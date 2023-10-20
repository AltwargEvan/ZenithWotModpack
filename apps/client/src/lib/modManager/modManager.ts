import { CloudInstallConfig } from "@zenith/utils/apitypes";
import { ObservableMap, ObservableSet, runInAction } from "mobx";
import { AuthStore } from "../supabase/supabaseContext";
import {
  CachedMod,
  LocalInstallConfig,
  installMod,
  uninstallMod,
} from "@/api/rust";
import { SettingsManager } from "../settingsManager/settingsManager";

const NotYetImplemented = new Error("Not Yet Implemented");

export class ModManager {
  installConfigsLocal: ObservableMap<number, LocalInstallConfig>;
  installConfigsCloud: ObservableMap<number, CloudInstallConfig>;
  lockedModIds: ObservableSet<number> = new ObservableSet();
  settingsManager: SettingsManager;

  constructor(settingsManager: SettingsManager) {
    this.settingsManager = settingsManager;
    // TODO - if user is logged in fetch cloud configs that are installed
    this.installConfigsCloud = new ObservableMap();
    // TODO - fetch local configs that are installed
    this.installConfigsLocal = new ObservableMap();
    // TODO - resolve the diff between cloud and local configs and update the cloud accordingly (Ex. user on a diff machine)
  }

  lockMod = (modId: number) => runInAction(() => this.lockedModIds.add(modId));
  unlockMod = (modId: number) =>
    runInAction(() => this.lockedModIds.delete(modId));

  async addModMultipleConfigs(
    mod: CachedMod,
    installConfigs: CloudInstallConfig[]
  ) {
    throw NotYetImplemented;
  }

  async addMod(
    mod: CachedMod,
    installConfig: CloudInstallConfig,
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
        runInAction(() =>
          this.installConfigsCloud.set(installConfig.id, installConfig)
        );
        resolve(true);
      } catch (e) {
        console.error(e);
        reject(e);
      }
    });

    const installLocallyPromise = new Promise(async (resolve, reject) => {
      try {
        const localInstallConfig: LocalInstallConfig = {
          id: installConfig.id,
          mod_id: installConfig.modId,
          name: installConfig.name,
          mods_path: installConfig.modsPath,
          res_path: installConfig.resModsPath,
          configs_path: installConfig.configsPath,
          game_directory: this.settingsManager.gameDirectory,
        };
        await installMod(mod, localInstallConfig, downloadUrl);
        runInAction(() =>
          this.installConfigsLocal.set(
            localInstallConfig.id,
            localInstallConfig
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

  async removeMod(modId: number, installConfigId: number) {
    if (this.lockedModIds.has(modId)) return;
    this.lockMod(modId);

    const updateProfilePromise = new Promise((resolve, reject) => {
      const session = AuthStore.getState().session;
      if (!session) resolve(true);
      // TODO - if user is logged in, update database
      resolve(true);
    });

    const uninstallLocallyPromise = new Promise(async (resolve, reject) => {
      try {
        const localInstallConfig =
          this.installConfigsLocal.get(installConfigId);
        if (!localInstallConfig)
          throw new Error(
            "Local install Config not found in client cache layer"
          );
        await uninstallMod(localInstallConfig);
        runInAction(() => {
          this.installConfigsLocal.delete(installConfigId);
        });
        resolve(true);
      } catch (e) {
        console.error("Failed to uninstall mod", e);
        reject(e);
      }
    });

    await Promise.allSettled([updateProfilePromise, uninstallLocallyPromise]);
    this.unlockMod(modId);
  }
}
