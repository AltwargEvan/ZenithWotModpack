import { useQuery } from "@tanstack/react-query";
import { fetch } from "@tauri-apps/api/http";
import { z } from "zod";
import { ModType, modSchema } from "../features/mod";

// https://github.com/benborgers/opensheet
const SPREADSHEET_ID = "1oxonHiV5znE17ZaTHVSztzOVLyyX6SSLTz2BWduiXIg";
const SHEET_PAGE = "Mods";
const SHEETS_TARGET = `https://opensheet.elk.sh/${SPREADSHEET_ID}/${SHEET_PAGE}`;

const modRequestResultParser = z.object({
  data: z.any().array(),
});
export async function fetchMods() {
  const res = await fetch(SHEETS_TARGET);
  const data = modRequestResultParser.parse(res).data;
  const output: Array<ModType> = new Array();
  data.forEach((item, index) => {
    const parsedRes = modSchema.safeParse(item);
    if (parsedRes.success) return output.push(parsedRes.data);
    console.error(
      `Error occured parsing mods at item ${index}`,
      parsedRes.error
    );
  });
  console.log(output);
  return output;
}

export function useSheetsDBMods() {
  return useQuery({
    queryKey: ["mods"],
    queryFn: fetchMods,
  });
}
