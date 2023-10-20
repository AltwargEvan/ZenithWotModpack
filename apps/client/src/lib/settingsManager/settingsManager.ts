export interface Settings {
  gameDirectory: string;
  automaticModUpdatesOnLaunchEnabled: boolean;
}

export class SettingsManager implements Settings {
  gameDirectory: string;
  automaticModUpdatesOnLaunchEnabled: boolean;

  constructor(props: Settings) {
    this.automaticModUpdatesOnLaunchEnabled =
      props.automaticModUpdatesOnLaunchEnabled;
    this.gameDirectory = props.gameDirectory;
  }
}
