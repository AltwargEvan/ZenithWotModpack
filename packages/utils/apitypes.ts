import type { Database } from "@zenith/supabase/types";
import { z } from "zod";
import { Prettify } from "./tsmagic";

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
export type Enums<T extends keyof Database["public"]["Enums"]> =
  Database["public"]["Enums"][T];

export type InstallConfig = Tables<"installConfigs">;
type ModJoined = Prettify<
  Tables<"mods"> & {
    installConfigs: InstallConfig[];
  }
>;
export type SupaMergedMod = Array<ModJoined>;
export type MergedMod = Prettify<wargamingMod & ModJoined>;
export type GetModsReturnType = Array<MergedMod>;
type configsInProfile = Tables<"configsInProfile"> & {
  installConfigs: InstallConfig;
};
type Streamer = Tables<"streamers">;
type Profile = Tables<"profiles">;

export type StreamerProfiles = Prettify<
  Streamer & { profile: Profile; configsInProfile: configsInProfile[] }
>;
export const wargamingMod = z.object({
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
export type wargamingMod = z.infer<typeof wargamingMod>;
