import { supabaseClient } from "@/lib/supabase/supabaseClient";
import { useQuery } from "@tanstack/react-query";
import { Body, fetch } from "@tauri-apps/api/http";
import type {
  GetModsReturnType,
  StreamerProfiles,
  Tables,
} from "@zenith/utils/apitypes";

export const useMods = () => {
  return useQuery({
    queryFn: async () => {
      const res = await fetch(
        "https://zenith-wot-modpack-iics8hwqo-altwargevan.vercel.app/api/mods"
      );
      // @ts-ignore
      return res.data.mods as GetModsReturnType;
    },
    queryKey: ["mods"],
  });
};

export function useStreamers() {
  return useQuery({
    queryFn: async () => {
      const { data, error } = await supabaseClient
        .from("streamers")
        .select(`*, profiles (*)`)
        .returns<StreamerProfiles[]>();
      if (error) throw error;
      console.log(data);
      return data;
    },
    queryKey: ["streamers"],
  });
}
export async function getIsStreaming(username: String) {
  const url = "https://gql.twitch.tv/gql";
  const query = `query {\n  user(login: \"${username}\") {\n    stream {\n      id\n    }\n  }\n}`;

  const headers = { "client-id": "kimne78kx3ncx6brgo4mv6wki5h1ko" };
  const body = Body.json({ query });
  const res = await fetch(url, {
    method: "POST",
    body,
    headers,
  });

  // @ts-ignore
  if (res.data.data.user.stream) return true;
  return false;
}

export function useIsStreaming(username: String) {
  return useQuery({
    queryFn: () => getIsStreaming(username),
    queryKey: ["isStreaming", username],
  });
}
