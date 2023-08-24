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
import { useModInstallState } from "../data/installState";
import { CURRENT_GAME_VERSION } from "../data/currentGameVersion";
import { z } from "zod";

export const modSchema = z.object({
  category: z.string(),
  downloadUrl: z.string().url(),
  gameversion: z.string(),
  modversion: z.string(),
  name: z.string(),
  thumbnailUrl: z.string().url(),
  wgModsId: z
    .preprocess((val) => parseInt(val as string), z.number())
    .optional(),
  id: z.preprocess((val) => parseInt(val as string), z.number()),
  createdBy: z.string(),
});

export type ModType = z.infer<typeof modSchema>;

export class Mod implements ModType {
  name: string;
  downloadUrl: string;
  thumbnailUrl: string;
  wgModsId?: number;
  category: string;
  gameversion: string;
  modversion: string;
  id: number; // id in google sheets
  createdBy: string;
  private customInstallScript?: (gameDir: string) => Promise<void>;

  constructor(
    params: ModType & {
      customInstallScript?: (mod: Mod, gameDir: string) => Promise<void>;
    }
  ) {
    this.name = params.name;
    this.downloadUrl = params.downloadUrl;
    this.thumbnailUrl = params.thumbnailUrl;
    this.wgModsId = params.wgModsId;
    this.category = params.category;
    this.gameversion = params.gameversion;
    this.id = params.id;
    this.createdBy = params.createdBy;
    this.modversion = params.modversion;
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

    if (await exists(modDirInModsFolder))
      await removeDir(modDirInModsFolder, { recursive: true });
    await useModInstallState.getState().removeFromGameInstalls(this.id);
  }

  public async removeFromCache() {
    const modNameCleaned = this.modNameCleaned();
    const appCacheDirPath = await appCacheDir();
    const modInModsCacheDir = `${appCacheDirPath}/mods/${modNameCleaned}`;

    if (await exists(modInModsCacheDir))
      await removeDir(modInModsCacheDir, { recursive: true });
    await useModInstallState.getState().removeFromAppCache(this.id);
  }

  public downloadedFileExtension() {
    const fileExtension = this.downloadUrl.split(".").pop();
    if (!fileExtension)
      throw new Error("Unable to parse file extension from downloadURL");
    return fileExtension;
  }

  public async downloadToCache() {
    // check that not already cached
    const cache = useModInstallState.getState().appCache;

    if (cache.has(this.id)) {
      const data = cache.get(this.id);
      if (
        data?.gameversion === this.gameversion &&
        data?.modversion === this.modversion
      )
        return;
    }
    // paths
    const appCacheDirPath = await appCacheDir();
    const modNameCleaned = this.modNameCleaned();
    const fileExtension = this.downloadedFileExtension();
    const cacheFolderPath = `${appCacheDirPath}/mods/${modNameCleaned}`;
    const downloadPath = `${cacheFolderPath}/${modNameCleaned}.${fileExtension}`;

    // clear any previous shit in the folder
    if (await exists(cacheFolderPath)) {
      await removeDir(cacheFolderPath, { recursive: true });
    }
    await createDir(cacheFolderPath, { recursive: true });

    // donwload, unpack and update cache
    await downloadFile(this.downloadUrl, downloadPath);
    if (fileExtension === "zip") {
      await unzipFile(downloadPath, cacheFolderPath);
      // delete the original zip
      await removeFile(downloadPath);
    }
    await useModInstallState.getState().addToAppCache({
      category: this.category,
      downloadUrl: this.downloadUrl,
      gameversion: this.gameversion,
      name: this.name,
      thumbnailUrl: this.thumbnailUrl,
      id: this.id,
      createdBy: this.createdBy,
      wgModsId: this.wgModsId,
      modversion: this.modversion,
    });
  }

  public async install(gameDirectory: string): Promise<void> {
    const appCacheDirPath = await appCacheDir();
    const modNameCleaned = this.modNameCleaned();
    const cacheFolderPath = `${appCacheDirPath}/mods/${modNameCleaned}`;

    const gameModsFolderPath = `${gameDirectory}/mods/${CURRENT_GAME_VERSION}/${modNameCleaned}`;

    // clear any previous shit in the folder
    if (await exists(gameModsFolderPath)) {
      await removeDir(gameModsFolderPath, { recursive: true });
    }
    await createDir(gameModsFolderPath, { recursive: true });

    // recursively iterate through cache folder and copy all .wotmod files to mods folder
    async function processEntries(entries: any) {
      for (const entry of entries) {
        const path = entry.path as string;
        if (path.endsWith(".wotmod")) {
          const filename = path.split("\\").pop();
          await copyFile(path, `${gameModsFolderPath}/${filename}`);
        }
        if (entry.children) {
          processEntries(entry.children);
        }
      }
    }

    const entries = await readDir(cacheFolderPath, { recursive: true });
    await processEntries(entries);

    await useModInstallState.getState().addToGameInstalls(this);
  }
}
