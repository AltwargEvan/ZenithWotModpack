export type InstallData = {
  name: string;
  wgModsId: number;
  id: number;
  installConfig: Array<{
    modsPath: string | null;
    resPath: string | null;
    name: string;
  }>;
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
