import { useQuery } from "@tanstack/react-query";
import { ModList } from "../../data/modlist";

function fetchModList() {
  try {
    throw "Fetch modlist from DB or Repo not yet implemented. Currently use internal mods in code. might never fix";
    // const data = await fetch(
    //   "https://raw.githubusercontent.com/AltwargEvan/ZenithWotModpack/main/Modlist.txt"
    // );
    // return data;
  } catch (e) {
    return ModList;
  }
}

export async function useModList() {
  return useQuery({
    queryFn: fetchModList,
    queryKey: ["ModList"],
  });
}
