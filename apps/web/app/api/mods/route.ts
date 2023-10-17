import fetchWargamingMod from "@/utils/wargamingMod";
import { createClient } from "@supabase/supabase-js";
import { supabaseAnonKey, supabaseUrl } from "@zenith/supabase";
import { Database } from "@zenith/supabase/types";
import { MergedMod, SupaMergedMod } from "@zenith/utils/apitypes";
import { NextResponse } from "next/server";

const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export async function GET() {
  const { data, error } = await supabase
    .from("mods")
    .select(`*, installConfigs (*)`)
    .returns<SupaMergedMod>();

  if (error) return new Response(error.message, { status: 400 });

  const promises = data.map((mod) => {
    return new Promise<MergedMod>(async (resolve, reject) => {
      try {
        const wgMod = await fetchWargamingMod(mod.id);
        resolve({ ...wgMod, ...mod });
      } catch (error) {
        console.error(
          `Failed to fetch or parse wargaming mod ${mod.name}:${mod.id}`,
          error
        );
        reject();
      }
    });
  });

  const res = await Promise.allSettled(promises);
  const mods = new Array<MergedMod>();
  res.forEach((item) => {
    switch (item.status) {
      case "rejected":
        return;
      case "fulfilled":
        mods.push(item.value);
    }
  });

  return NextResponse.json({ status: 200, mods: mods });
}
