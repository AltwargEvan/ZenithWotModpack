import { copyFile, createDir, readDir } from "@tauri-apps/api/fs";
import { getFileExtension } from "./getFileExtension";

export async function copyDirectory(source: string, destination: string) {
  const entries = await readDir(source);
  for (const entry of entries) {
    try {
      const path = entry.path as string;
      const filename = path.split(/[\\\/]/).pop();
      if (entry.children) {
        await createDir(`${destination}/${filename}`);
        await copyDirectory(path, `${destination}/${filename}`);
      } else if (filename && getFileExtension(filename) !== ".exe") {
        await copyFile(path, `${destination}/${filename}`);
      }
    } catch (e) {
      console.error(e);
    }
  }
}
