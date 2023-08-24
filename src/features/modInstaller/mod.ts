import {
  exists,
  createDir,
  removeFile,
  copyFile,
  removeDir,
  readDir,
} from "@tauri-apps/api/fs";
import { appCacheDir } from "@tauri-apps/api/path";
import { downloadFile, unzipFile } from "./installUtils";
import { CURRENT_GAME_VERSION, GameVersion } from "../../utils/gameVersion";

export class Mod {
  name: string;
  downloadUrl: string;
  thumbnailUrl: string;
  wgModsId?: number;
  category: string;
  downloadModsFolderPath: string;
  version: GameVersion;
  private customInstallScript?: (gameDir: string) => Promise<void>;

  constructor(params: {
    name: string;
    downloadUrl: string;
    thumbnailUrl: string;
    wgModsId?: number;
    category: string;
    downloadModsFolderPath: string;
    version?: GameVersion;
    customInstallScript?: (mod: Mod, gameDir: string) => Promise<void>;
  }) {
    this.name = params.name;
    this.downloadUrl = params.downloadUrl;
    this.thumbnailUrl = params.thumbnailUrl;
    this.wgModsId = params.wgModsId;
    this.category = params.category;
    this.downloadModsFolderPath = params.downloadModsFolderPath;
    this.version = params.version || CURRENT_GAME_VERSION;
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

  public downloadedFileExtension() {
    const fileExtension = this.downloadUrl.split(".").pop();
    if (!fileExtension)
      throw new Error("Unable to parse file extension from downloadURL");
    return fileExtension;
  }

  public async download() {
    // Create App Mods Cache If Not Exists
    const appCacheDirPath = await appCacheDir();
    const modsCacheDir = `${appCacheDirPath}/mods`;
    if (!(await exists(modsCacheDir))) createDir(modsCacheDir);

    // lmao regex https://stackoverflow.com/questions/30075649/javascript-regex-for-cleaning-string-value
    const modNameCleaned = this.modNameCleaned();

    // get file extension of download to decide how to handle
    const fileExtension = this.downloadedFileExtension();
    // If mod directory doesn't exist, create it
    const modFolderInCache = `${modsCacheDir}/${modNameCleaned}`;
    if (!(await exists(modFolderInCache))) createDir(modFolderInCache);

    // Download Mod
    const filename = `${modNameCleaned}.${fileExtension}`;
    const downloadDest = `${modFolderInCache}/${filename}`;
    await downloadFile(this.downloadUrl, downloadDest);
  }

  public async install(gameDirectory: string): Promise<void> {
    const appCacheDirPath = await appCacheDir();
    const modNameCleaned = this.modNameCleaned();
    const fileExtension = this.downloadedFileExtension();
    // Create if not exists folder in mods/version/{modname}
    const gameModsFolder = `${gameDirectory}/mods`;
    if (!(await exists(gameModsFolder))) createDir(gameModsFolder);
    const gameVersionInModsFolderPath = `${gameModsFolder}/${CURRENT_GAME_VERSION}`;
    if (!(await exists(gameVersionInModsFolderPath)))
      createDir(gameVersionInModsFolderPath);
    const modInGameVersionFolderPath = `${gameVersionInModsFolderPath}/${modNameCleaned}`;
    if (!(await exists(modInGameVersionFolderPath)))
      createDir(modInGameVersionFolderPath);

    const filename = `${modNameCleaned}.${fileExtension}`;
    const modFilePathInCache = `${appCacheDirPath}/mods/${modNameCleaned}`;
    const cacheLocation = `${modFilePathInCache}/${filename}`;

    switch (fileExtension) {
      case "wotmod":
        // copy file to destination
        await copyFile(
          cacheLocation,
          `${modInGameVersionFolderPath}/${filename}`
        );
        break;
      case "zip":
        // unzip download into mods/modname
        await unzipFile(cacheLocation, modFilePathInCache);

        // delete the original zip
        await removeFile(cacheLocation);

        // recursively iterate through upzipped folder and copy all .wotmod files to mods folder
        async function processEntries(entries: any) {
          for (const entry of entries) {
            console.log(`Entry: ${entry.path}`);
            const path = entry.path as string;
            if (path.endsWith(".wotmod")) {
              const filename = path.split("\\").pop();
              await copyFile(path, `${modInGameVersionFolderPath}/${filename}`);
            }
            if (entry.children) {
              processEntries(entry.children);
            }
          }
        }

        const entries = await readDir(modFilePathInCache, { recursive: true });
        await processEntries(entries);

        // move over config from specified location?

        break;
      default:
        throw new Error("Downloaded file format is not currently supported.");
    }
  }
}
