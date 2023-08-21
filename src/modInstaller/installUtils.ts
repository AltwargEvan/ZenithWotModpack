import { fs, invoke } from "@tauri-apps/api";
import { removeDir, exists, createDir } from "@tauri-apps/api/fs";
import { ResponseType, getClient } from "@tauri-apps/api/http";
import { appCacheDir } from "@tauri-apps/api/path";
import { Mod } from "./mod";

/**
 * Downloads the giventarget url and copies to appCacheDir/ @param cacheSubDir
 * @param target Target download URL
 * @param dest location of output file
 * @returns file destination
 */
export async function downloadFile(target: string, dest: string) {
  await fs.writeBinaryFile(
    dest,
    (
      await (
        await getClient()
      ).get(target, {
        ...{},
        responseType: ResponseType.Binary,
      })
    ).data as any
  );
  return dest;
}

/**
 *
 * @param target target file to unzip
 * @param dest location to send unzipped dir
 * @param destroyOriginal remove the original .zip file
 */
export async function unzipFile(target: string, dest: string) {
  await invoke("unzip_file", {
    filePath: target,
    targetDir: dest,
  });
}

export async function clearAppModsCache() {
  const appCacheDirPath = await appCacheDir();
  await removeDir(`${appCacheDirPath}/mods`, { recursive: true });
}
