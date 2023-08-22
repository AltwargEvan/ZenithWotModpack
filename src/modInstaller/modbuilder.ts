import { Mod, ModCategory } from "./mod";
import type { GameVersion } from "../utils/gameVersion";
export class ModBuilder {
  private _name?: string;
  private _downloadUrl?: string;
  private _thumbnailUrl?: string;
  private _wgModsId?: number;
  private _category?: ModCategory;
  private _downloadModsFolderPath: string = "";
  private _customInstallScript?: (mod: Mod, gameDir: string) => Promise<void>;

  public name(name: string) {
    this._name = name;
    return this;
  }

  public downloadUrl(downloadUrl: string, version: GameVersion) {
    this._downloadUrl = downloadUrl;
    return this;
  }

  public downloadModsFolderPath(path: string) {
    this._downloadModsFolderPath = path;
    return this;
  }
  public thumbnailUrl(thumbnailUrl: string) {
    this._thumbnailUrl = thumbnailUrl;
    return this;
  }

  public wgModsId(id: number) {
    this._wgModsId = id;
    return this;
  }

  public category(category: ModCategory) {
    this._category = category;
    return this;
  }

  public customInstallScript(fn: (mod: Mod, gameDir: string) => Promise<void>) {
    this._customInstallScript = fn;
    return this;
  }

  public build() {
    if (!this._name) throw new Error("Must Provided Name");
    if (!this._downloadUrl) throw new Error("Must Provide DownloadURL");
    if (!this._thumbnailUrl) throw new Error("Must Provided ThumbnailUrl");
    if (!this._category) throw new Error("Must Provided Category");

    const mod = new Mod({
      name: this._name,
      downloadUrl: this._downloadUrl,
      thumbnailUrl: this._thumbnailUrl,
      wgModsId: this._wgModsId,
      category: this._category,
      customInstallScript: this._customInstallScript,
      downloadModsFolderPath: this._downloadModsFolderPath,
    });

    return mod;
  }
}
