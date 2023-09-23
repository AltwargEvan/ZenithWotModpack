import { useQueries, useQuery } from "@tanstack/react-query";
import { fetch } from "@tauri-apps/api/http";
import { z } from "zod";
import { InstallConfigSchema } from "../../features/mod";
import fetchWGMod from "./fetchWargamingMods";

// https://github.com/benborgers/opensheet
const SPREADSHEET_ID = "1oxonHiV5znE17ZaTHVSztzOVLyyX6SSLTz2BWduiXIg";
const SHEET_PAGE = "Mods";
const SHEETS_TARGET = `https://opensheet.elk.sh/${SPREADSHEET_ID}/${SHEET_PAGE}`;

const modRequestResultParser = z.object({
  data: z.any().array(),
});

const mobDbRowSchema = z.object({
  id: z.preprocess((val) => parseInt(val as string), z.number()),
  wgModsId: z.preprocess((val) => parseInt(val as string), z.number()),
  name: z.string(),
  category: z.string(),
  installConfig: z.preprocess(
    (arg) => JSON.parse(arg as string),
    InstallConfigSchema
  ),
});

export async function fetchDbMods() {
  const res = await fetch(SHEETS_TARGET);
  const data = modRequestResultParser.parse(res).data;
  const modsFromDB: Array<z.infer<typeof mobDbRowSchema>> = new Array();

  data.forEach((item, index) => {
    const parsedRes = mobDbRowSchema.safeParse(item);
    if (parsedRes.success) return modsFromDB.push(parsedRes.data);
    console.error(
      `Error occured parsing mods at item ${index}`,
      parsedRes.error
    );
  });
  const wgMods = modsFromDB.filter((mod) => mod.wgModsId);
  // console.log("fetched", wgMods);

  return wgMods;
}

export function useMods() {
  const { data } = useQuery({
    queryKey: ["dbmods"],
    queryFn: fetchDbMods,
  });

  const mods = useQueries({
    queries: data
      ? data.map((mod) => {
          return {
            queryKey: ["mod", mod.id],
            queryFn: () => fetchWGMod(mod),
            refetchOnWindowFocus: false,
            cacheTime: 1000 * 60 * 15,
            refetchOnMount: false,
            refetchOnReconnect: false,
          };
        })
      : [],
  });

  return mods;
}
