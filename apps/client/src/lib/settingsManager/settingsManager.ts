export interface Settings {
  gameDirectory: string;
  automaticModUpdatesOnLaunchEnabled: boolean;
}

export class SettingsManager implements Settings {
  gameDirectory: string;
  gameVersion: string;
  automaticModUpdatesOnLaunchEnabled: boolean;

  constructor(props: Settings) {
    this.automaticModUpdatesOnLaunchEnabled =
      props.automaticModUpdatesOnLaunchEnabled;
    this.gameDirectory = props.gameDirectory;

    // TODO - fetch game dir
    this.gameVersion = "1.22.1.0";
  }
}
