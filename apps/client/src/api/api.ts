import { useQuery } from "@tanstack/react-query";
import { fetch } from "@tauri-apps/api/http";
import type { GetModsReturnType } from "@zenith/utils/apitypes";

export const useMods = () => {
  return useQuery({
    queryFn: async () => {
      const res = await fetch(
        "https://zenith-wot-modpack-iics8hwqo-altwargevan.vercel.app/api/mods"
      );
      return res.data as GetModsReturnType;
    },
    queryKey: ["mods"],
  });
};
