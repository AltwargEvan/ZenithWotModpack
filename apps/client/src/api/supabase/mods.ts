import { useQuery } from "@tanstack/react-query";
import type { GetModsReturnType } from "@zenith/utils/apitypes";
import { fetch } from "@tauri-apps/api/http";
const fetchMods = async () => {
  const res = await fetch(
    "https://zenith-wot-modpack-iics8hwqo-altwargevan.vercel.app/api/mods"
  );
  // @ts-ignore
  return res.data.mods as GetModsReturnType;
};

const fiveMinutes = 300000;
export const useMods = () => {
  return useQuery({
    staleTime: fiveMinutes,
    queryFn: fetchMods,
    queryKey: ["mods"],
  });
};
