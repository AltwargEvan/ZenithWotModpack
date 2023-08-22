import { useQuery } from "@tanstack/react-query";
import { fetch } from "@tauri-apps/api/http";
import { z } from "zod";

const SPREADSHEET_ID = "1oxonHiV5znE17ZaTHVSztzOVLyyX6SSLTz2BWduiXIg";
const SHEET_PAGE = "Mods";
const SHEETS_TARGET = `https://opensheet.elk.sh/${SPREADSHEET_ID}/${SHEET_PAGE}`;
const sheetsDBSchema = z.array(
  z.object({
    category: z.string(),
    downloadUrl: z.string().url(),
    downloadVersion: z.string(),
    name: z.string(),
    thumbnailUrl: z.string().url(),
    wgModsId: z
      .preprocess((val) => parseInt(val as string), z.number())
      .optional(),
    id: z.preprocess((val) => parseInt(val as string), z.number()),
  })
);
export async function fetchMods() {
  const res = await fetch(SHEETS_TARGET);
  const data = sheetsDBSchema.parse(res.data);
  // calculate categories and remove duplicates
  let categories = data.map((mod) => mod.category);
  categories = [...new Set(categories)];
  return { mods: data, categories };
}

export function useSheetsDBMods() {
  return useQuery({
    queryKey: ["mods"],
    queryFn: fetchMods,
  });
}
