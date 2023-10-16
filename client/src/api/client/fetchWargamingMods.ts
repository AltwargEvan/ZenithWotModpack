import { fetch } from "@tauri-apps/api/http";
import { z } from "zod";
import { fetchDbMods } from "./useMods";

export const wgModsAPIResultType = z.object({
  author_name: z.unknown(),
  change_log: z.array(
    z.object({
      body: z.string(),
      date: z.string(),
      version: z.string(),
    })
  ),
  cover: z.string(),
  created_at: z.string(),
  downloads: z.number(),
  id: z.number(),
  mark: z.string(),
  localizations: z.array(
    z.object({
      description: z.string(),
      installation_guide: z.string(),
      title: z.string(),
      lang: z.object({ id: z.number(), code: z.string(), title: z.string() }),
    })
  ),
  mark_votes_count: z.number(),
  owner: z.object({
    spa_username: z.string(),
  }),
  qa_status: z.number(),
  rating: z.number(),
  screenshots: z.array(
    z.object({
      id: z.number(),
      position: z.number(),
      source: z.string(),
      source_full_size: z.string(),
      source_view_page: z.string(),
    })
  ),
  supported_languages: z.array(z.unknown()),
  tags: z.array(z.number()),
  updated_at: z.string(),
  versions: z.array(
    z.object({
      id: z.number(),
      version: z.string(),
      download_url: z.string(),
      game_version: z.object({ id: z.number(), version: z.string() }),
    })
  ),
});

export default async function fetchWGMod(
  mod: Awaited<ReturnType<typeof fetchDbMods>>[number]
) {
  try {
    const url = `https://wgmods.net/api/mods/${mod.wgModsId}/`;
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "X-Requested-With": "XMLHttpRequest",
      },
    });
    const parsedRes = wgModsAPIResultType.parse(res.data);
    return { ...parsedRes, internal: { ...mod } };
  } catch (e) {
    console.error(e);
  }
}

export type fetchWGModResult = NonNullable<
  Awaited<ReturnType<typeof fetchWGMod>>
>;