export class GameVersion {
  core: number;
  major: number;
  minor: number;
  patch: number;

  /**
   * Pass in version number as string
   * ex. 1.21.1.1
   * @param version
   */
  constructor(version: string) {
    const data = version.split(".");
    this.patch = parseInt(data.pop() || "0");
    this.minor = parseInt(data.pop() || "0");
    this.major = parseInt(data.pop() || "0");
    this.core = parseInt(data.pop() || "0");
  }

  toString() {
    return `${this.core}.${this.major}.${this.minor}.${this.patch}`;
  }
}
// updating this manually will be a FUN exercise
export const V1_21_1_1 = new GameVersion("1.21.1.1");

export const CURRENT_GAME_VERSION = V1_21_1_1;
