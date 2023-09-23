import { fs } from "@tauri-apps/api";
import { getClient, RequestOptions, ResponseType } from "@tauri-apps/api/http";
import { appCacheDir } from "@tauri-apps/api/path";

export async function downloadMod(modname: string) {
  const target = `https://modp.wgcdn.co/media/mod_files/${modname}`;
  const appCacheDirPath = await appCacheDir();
  const dest = `${appCacheDirPath}/${modname}`;
  await download(target, dest);
  console.log("Download complete", target);
  return dest;
}

const download = async (
  url: string,
  dest: string,
  options?: RequestOptions
) => {
  const res = await fs.writeBinaryFile(
    dest,
    (
      await (
        await getClient()
      ).get(url, {
        ...(options || {}),
        responseType: ResponseType.Binary,
      })
    ).data as any
  );
  console.log(res);
};
