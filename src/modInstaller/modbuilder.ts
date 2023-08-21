import { Mod, ModCategory } from "./mod";

export class ModBuilder {
  private _name?: string;
  private _downloadUrl?: string;
  private _thumbnailUrl?: string;
  private _wgModsId?: number;
  private _category?: ModCategory;
  private _downloadModsFolderPath: string = "";
  private _installScript?: (
    mod: Mod,
    gameDir: string,
    downloadModsFolderPath: string
  ) => Promise<void>;

  public name(name: string) {
    this._name = name;
    return this;
  }

  public downloadUrl(downloadUrl: string) {
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

  public installScript(
    fn: (
      mod: Mod,
      gameDir: string,
      downloadModsFolderPath: string
    ) => Promise<void>
  ) {
    this._installScript = fn;
    return this;
  }

  public build() {
    if (!this._name) throw new Error("Must Provided Name");
    if (!this._downloadUrl) throw new Error("Must Provide DownloadURL");
    if (!this._thumbnailUrl) throw new Error("Must Provided ThumbnailUrl");
    if (!this._category) throw new Error("Must Provided Category");
    if (!this._installScript) throw new Error("Must Provided Install Script");

    const mod = new Mod({
      name: this._name,
      downloadUrl: this._downloadUrl,
      thumbnailUrl: this._thumbnailUrl,
      wgModsId: this._wgModsId,
      category: this._category,
      installScript: this._installScript,
      downloadModsFolderPath: this._downloadModsFolderPath,
    });

    return mod;
  }
}
