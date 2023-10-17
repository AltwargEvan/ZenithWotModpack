import { wargamingMod } from "@zenith/utils/apitypes";

const halfHour = 60 * 30;
export default async function fetchWargamingMod(id: number) {
  const url = `https://wgmods.net/api/mods/${id}/`;
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "X-Requested-With": "XMLHttpRequest",
    },
    next: { revalidate: halfHour },
  });

  const parsedRes = wargamingMod.parse(await res.json());

  return parsedRes;
}
