import { InstallConfig } from "@zenith/utils/apitypes";
import { makeAutoObservable } from "mobx";
import { observer } from "mobx-react-lite";
import { create } from "zustand";

const NotYetImplemented = new Error("Not Yet Implemented");

export class ModManager {
  installConfigsLocal: InstallConfig[];
  installConfigsCloud: InstallConfig[] | null;

  constructor() {
    this.installConfigsCloud = [];
    // TODO - fetch local configs that are installed
    this.installConfigsLocal = [];
    makeAutoObservable(this);
  }

  addMod(modId: number) {
    const cfg: InstallConfig = {
      configsPath: null,
      created_at: "",
      id: modId,
      modId: modId,
      modsPath: null,
      name: "",
      resModsPath: null,
    };
    this.installConfigsLocal.push(cfg);
  }

  modIsInstalled(modId: number) {
    return this.installConfigsLocal.some((cfg) => cfg.modId == modId);
  }

  removeMod() {
    throw NotYetImplemented;

    // update web if user
    // update local install configs
  }
  installMod() {
    throw NotYetImplemented;

    // if not downloaded version, download it to cache
    // copy correct files
    // update local install configs
  }
  uninstallMod() {
    throw NotYetImplemented;
  }
  cacheMod() {
    throw NotYetImplemented;
  }
  uncacheMod() {
    throw NotYetImplemented;
  }
}
