import { exists, readDir } from "@tauri-apps/api/fs";

export async function detectGameDirectories() {
  try {
    const entries = await readDir("C:\\games");
    const filter = entries.filter((entry) =>
      entry.path.toLowerCase().includes("world_of_tanks")
    );
    const asyncFilter = filter.filter(async (entry) => {
      const wotexeExists = await exists(`${entry.path}\\WorldOfTanks.exe`);
      return wotexeExists;
    });
    return asyncFilter.map((entry) => entry.path);
  } catch {
    return [];
  }
}
