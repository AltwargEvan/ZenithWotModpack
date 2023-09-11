import { exists, readDir } from "@tauri-apps/api/fs";

export async function detectGameDirectories() {
  try {
    const entries = await readDir("C:\\games");
    return entries.filter(
      async (entry) =>
        entry.name?.toLowerCase().includes("world_of_tanks") &&
        (await exists(`${entry.path}\\WorldOfTanks.exe`))
    );
  } catch {
    return [];
  }
}
