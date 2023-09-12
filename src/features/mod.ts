import { z } from "zod";

export const InstallConfigSchema = z.array(
  z.object({
    modsPath: z.string().optional(),
    resPath: z.string().optional(),
    name: z.string(),
  })
);

export type InstallConfig = z.infer<typeof InstallConfigSchema>;

export type InstallData = {
  name: string;
  wgModsId: number;
  id: number;
  installConfig: InstallConfig;
  installConfigIndices: Array<number>;
  version: string;
  gameVersion: string;
  downloadUrl: string;
};

/**
 * Returns true if both installs are the same
 * @param a
 * @param b
 * @returns
 */
export function compareInstallData(a: InstallData, b: InstallData) {
  return (
    a.id === b.id && a.version === b.version && a.gameVersion === b.gameVersion
  );
}
