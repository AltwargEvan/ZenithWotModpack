import { useQuery } from "@tanstack/react-query";
import { fetch, Body } from "@tauri-apps/api/http";
import { z } from "zod";

// https://github.com/benborgers/opensheet
const SPREADSHEET_ID = "1oxonHiV5znE17ZaTHVSztzOVLyyX6SSLTz2BWduiXIg";
const SHEET_PAGE = "Streamers";
const SHEETS_TARGET = `https://opensheet.elk.sh/${SPREADSHEET_ID}/${SHEET_PAGE}`;

const RequestResultParser = z.object({
  data: z.any().array(),
});

const StreamerRowSchema = z.object({
  name: z.string(),
  twitchUrl: z.string(),
  logoUrl: z.string(),
  mods: z.preprocess((arg) => JSON.parse(arg as string), z.array(z.number())),
  banner: z.string(),
});

export type StreamerData = z.infer<typeof StreamerRowSchema>;
export async function fetchStreamers() {
  const res = await fetch(SHEETS_TARGET);
  const data = RequestResultParser.parse(res).data;
  const streamers: Array<z.infer<typeof StreamerRowSchema>> = new Array();

  data.forEach((item, index) => {
    const parsedRes = StreamerRowSchema.safeParse(item);
    if (parsedRes.success) return streamers.push(parsedRes.data);
    console.error(
      `Error occured parsing mods at item ${index}`,
      parsedRes.error
    );
  });

  return streamers;
}

export function useStreamers() {
  return useQuery({
    queryKey: ["streamers"],
    queryFn: fetchStreamers,
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
