import { exists, createDir, removeFile, copyFile } from "@tauri-apps/api/fs";
import { appCacheDir } from "@tauri-apps/api/path";
import { downloadFile, unzipFile } from "./installUtils";

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
  private installScript: (gameDir: string) => Promise<void>;

  constructor(params: {
    name: string;
    downloadUrl: string;
    thumbnailUrl: string;
    wgModsId?: number;
    category: ModCategory;
    downloadModsFolderPath: string;
    installScript: (
      mod: Mod,
      gameDir: string,
      downloadModsFolderPath: string
    ) => Promise<void>;
  }) {
    this.name = params.name;
    this.downloadUrl = params.downloadUrl;
    this.thumbnailUrl = params.thumbnailUrl;
    this.wgModsId = params.wgModsId;
    this.category = params.category;
    this.downloadModsFolderPath = params.downloadModsFolderPath;
    this.installScript = async (gameDir: string) =>
      params.installScript(this, gameDir, this.downloadModsFolderPath);
  }

  public async install(gameDir: string): Promise<void> {
    // Create App Mods Cache If Not Exists
    const appCacheDirPath = await appCacheDir();
    const modsCacheDir = `${appCacheDirPath}/mods`;
    if (!(await exists(modsCacheDir))) createDir(modsCacheDir);

    // lmao regex https://stackoverflow.com/questions/30075649/javascript-regex-for-cleaning-string-value
    const modNameCleaned = this.name.replace(/([^a-z0-9 ._-]+)/gi, "");

    // get file extension of download to decide how to handle
    const fileExtension = this.downloadUrl.split(".").pop();
    if (!fileExtension)
      throw new Error("Unable to parse file extension from downloadURL");

    // If mod directory doesn't exist, create it
    const modFolderInCache = `${modsCacheDir}/${modNameCleaned}`;
    if (!(await exists(modFolderInCache))) createDir(modFolderInCache);

    // Download Mod
    const downloadDest = `${modFolderInCache}/${modNameCleaned}.${fileExtension}`;
    await downloadFile(this.downloadUrl, downloadDest);

    const gameModsFolder = `${gameDir}/mods`;
    switch (fileExtension) {
      case "wotmod":
        await copyFile(downloadDest, `${gameModsFolder}/${modNameCleaned}`);
        break;
      case "zip":
        // unzip download into mods/modname
        await unzipFile(downloadDest, modFolderInCache);
        // delete the original zip
        await removeFile(downloadDest);
        this.installScript(gameDir);
        break;
      default:
        throw new Error("Downloaded file format is not currently supported.");
    }
  }
}
