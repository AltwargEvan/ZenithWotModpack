import {
  exists,
  createDir,
  removeFile,
  copyFile,
  removeDir,
} from "@tauri-apps/api/fs";
import { appCacheDir } from "@tauri-apps/api/path";
import { downloadFile, unzipFile } from "./installUtils";
import { CURRENT_GAME_VERSION } from "../utils/gameVersion";

export const ModCategories = [
  "Tools",
  "Reticle",
  "Mark Of Excellence",
] as const;
export type ModCategory = (typeof ModCategories)[number];

export class Mod {
  name: string;
  downloadUrl: string;
  thumbnailUrl: string;
  wgModsId?: number;
  category: ModCategory;
  downloadModsFolderPath: string;
  private customInstallScript?: (gameDir: string) => Promise<void>;

  constructor(params: {
    name: string;
    downloadUrl: string;
    thumbnailUrl: string;
    wgModsId?: number;
    category: ModCategory;
    downloadModsFolderPath: string;
    customInstallScript?: (mod: Mod, gameDir: string) => Promise<void>;
  }) {
    this.name = params.name;
    this.downloadUrl = params.downloadUrl;
    this.thumbnailUrl = params.thumbnailUrl;
    this.wgModsId = params.wgModsId;
    this.category = params.category;
    this.downloadModsFolderPath = params.downloadModsFolderPath;
    if (params.customInstallScript) {
      // this is stupid. why do i need this. fuck this is dumb
      const script = params.customInstallScript;
      this.customInstallScript = async (gameDir: string) => {
        // this isn't legal for some reason
        // params.customInstallScript(this, gameDir);
        script(this, gameDir);
      };
    }
  }
  public modNameCleaned() {
    return this.name.replace(/([^a-z0-9 ._-]+)/gi, "");
  }

  public async uninstall(gameDirectory: string) {
    const gameModsFolder = `${gameDirectory}/mods`;
    const modNameCleaned = this.modNameCleaned();
    const modDirInModsFolder = `${gameModsFolder}/${CURRENT_GAME_VERSION}/${modNameCleaned}`;
    if (await exists(modDirInModsFolder)) {
      removeDir(modDirInModsFolder, { recursive: true });
    }
  }

  public async uninstallAndRemoveFromCache(gameDirectory: string) {
    await this.uninstall(gameDirectory);
    const modNameCleaned = this.modNameCleaned();
    const appCacheDirPath = await appCacheDir();
    const modInModsCacheDir = `${appCacheDirPath}/mods/${modNameCleaned}`;
    if (await exists(modInModsCacheDir)) {
      removeDir(modInModsCacheDir, { recursive: true });
    }
  }

  public async install(gameDirectory: string): Promise<void> {
    // Create App Mods Cache If Not Exists
    const appCacheDirPath = await appCacheDir();
    const modsCacheDir = `${appCacheDirPath}/mods`;
    if (!(await exists(modsCacheDir))) createDir(modsCacheDir);

    // lmao regex https://stackoverflow.com/questions/30075649/javascript-regex-for-cleaning-string-value
    const modNameCleaned = this.modNameCleaned();

    // get file extension of download to decide how to handle
    const fileExtension = this.downloadUrl.split(".").pop();
    if (!fileExtension)
      throw new Error("Unable to parse file extension from downloadURL");

    // If mod directory doesn't exist, create it
    const modFolderInCache = `${modsCacheDir}/${modNameCleaned}`;
    if (!(await exists(modFolderInCache))) createDir(modFolderInCache);

    // Download Mod
    const filename = `${modNameCleaned}.${fileExtension}`;
    const downloadDest = `${modFolderInCache}/${filename}`;
    await downloadFile(this.downloadUrl, downloadDest);

    // Create if not exists folder in mods/version/{modname}
    const gameModsFolder = `${gameDirectory}/mods`;
    if (!(await exists(gameModsFolder))) createDir(gameModsFolder);
    const gameVersionInModsFolderPath = `${gameModsFolder}/${CURRENT_GAME_VERSION}`;
    if (!(await exists(gameVersionInModsFolderPath)))
      createDir(gameVersionInModsFolderPath);
    const modInGameVersionFolderPath = `${gameVersionInModsFolderPath}/${modNameCleaned}`;
    if (!(await exists(modInGameVersionFolderPath)))
      createDir(modInGameVersionFolderPath);

    switch (fileExtension) {
      case "wotmod":
        // copy file to destination
        await copyFile(
          downloadDest,
          `${modInGameVersionFolderPath}/${filename}`
        );
        break;
      case "zip":
        // unzip download into mods/modname
        await unzipFile(downloadDest, modFolderInCache);

        // delete the original zip
        await removeFile(downloadDest);

        // recursively iterate through upzipped folder and copy all .wotmod files to mods folder

        // move over config from specified location?

        break;
      default:
        throw new Error("Downloaded file format is not currently supported.");
    }
  }
}
