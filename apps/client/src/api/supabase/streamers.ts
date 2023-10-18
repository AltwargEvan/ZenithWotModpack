import { supabaseClient } from "@/lib/supabase/supabaseClient";
import { useQuery } from "@tanstack/react-query";
import type { StreamerProfiles } from "@zenith/utils/apitypes";
import { Body, fetch } from "@tauri-apps/api/http";

const fetchStreamers = async () => {
  const { data, error } = await supabaseClient
    .from("streamers")
    .select(`*, profiles (*, configsInProfile (*, installConfigs (*)))`)
    .returns<StreamerProfiles[]>();
  if (error) throw error;
  console.log(data);
  return data;
};

export function useStreamers() {
  return useQuery({
    queryFn: fetchStreamers,
    queryKey: ["streamers"],
  });
}

async function getIsStreaming(username: String) {
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
