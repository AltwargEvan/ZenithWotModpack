import { ReactNode, useState } from "react";
import { Settings, SettingsManager } from "./settingsManager/settingsManager";
import { SettingsManagerContextProvider } from "./settingsManager/settingsManagerContext";
import { ModManagerContextProvider } from "./modManager/modManagerContext";
import { ModManager } from "./modManager/modManager";

export const InnerAppProviders = ({
  children,
  userSettings,
}: {
  children: ReactNode;
  userSettings: Settings;
}) => {
  const [settingsManager] = useState(new SettingsManager(userSettings));
  const [modManager] = useState(new ModManager(settingsManager));
  return (
    <SettingsManagerContextProvider settingsManager={settingsManager}>
      <ModManagerContextProvider modManager={modManager}>
        {children}
      </ModManagerContextProvider>
    </SettingsManagerContextProvider>
  );
};
