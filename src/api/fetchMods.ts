import { useQuery } from "@tanstack/react-query";
import { fetch } from "@tauri-apps/api/http";
import { z } from "zod";
import { ModType } from "../features/mod";
import fetchWGMod from "./wargaming/fetchWGMod";

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
  installConfig: z.string(),
});
export async function fetchMods() {
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
  const wgAPIMods = await Promise.allSettled(
    wgMods.map((mod) => (mod.wgModsId ? fetchWGMod(mod.wgModsId) : mod))
  );
  return wgAPIMods;
}

export function useSheetsDBMods() {
  return useQuery({
    queryKey: ["mods"],
    queryFn: fetchMods,
  });
}
