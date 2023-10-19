import { InstallConfig } from "@zenith/utils/apitypes";
import { makeAutoObservable } from "mobx";
import { AuthStore, useSession } from "../supabase/supabaseContext";
import { supabaseClient } from "../supabase/supabaseClient";
import { installMod } from "@/api/rust";

const NotYetImplemented = new Error("Not Yet Implemented");

export class ModManager {
  installConfigsLocal: InstallConfig[];
  installConfigsCloud: InstallConfig[] | null;
  installConfigsLock: InstallConfig[] = [];

  constructor() {
    this.installConfigsCloud = [];
    // TODO - fetch local configs that are installed
    this.installConfigsLocal = [];
    makeAutoObservable(this);
  }

  addMod(installConfig: InstallConfig) {
    const userId = AuthStore.getState().session?.user.id;
    const updateProfilePromise = new Promise((resolve, reject) => {
      supabaseClient.from("configsInProfile").upsert({});
    });
    installMod(installConfig, installConfig);
  }

  modIsInstalled(modId: number) {
    return this.installConfigsLocal.some((cfg) => cfg.modId == modId);
  }

  removeMod() {
    throw NotYetImplemented;

    // update web if user
    // update local install configs
  }
  async installMod() {
    throw NotYetImplemented;

    // if not downloaded version, download it to cache
    // copy correct files
    // update local install configs
  }
  async uninstallMod() {
    throw NotYetImplemented;
  }
  cacheMod() {
    throw NotYetImplemented;
  }
  uncacheMod() {
    throw NotYetImplemented;
  }
}
