import { supabaseClient } from "@/lib/supabase/supabaseClient";
import { useQuery } from "@tanstack/react-query";
import { Tables } from "@zenith/utils/apitypes";

type configs = Tables<"configsInProfile"> & {
  installConfigs: Tables<"installConfigs">;
};
type ReturnType = Tables<"profiles"> & {
  configsInProfile: configs[];
};
async function fetchProfile(userId: string | undefined) {
  if (!userId) return null;
  const { data, error } = await supabaseClient
    .from("profiles")
    .select(`*, configsInProfile (*, installConfigs (*))`)
    .eq("id", userId)
    .maybeSingle();

  console.log(data);
  if (error) throw new Error(error.message);
  return data as ReturnType;
}

export function useProfile(userId: string | undefined) {
  return useQuery({
    queryFn: () => fetchProfile(userId),
    queryKey: ["streamers", userId],
  });
}
