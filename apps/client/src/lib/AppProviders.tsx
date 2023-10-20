import { ReactNode, useState } from "react";
import { Settings, SettingsManager } from "./settingsManager/settingsManager";
import { SettingsManagerContextProvider } from "./settingsManager/settingsManagerContext";
import { ModManagerContextProvider } from "./modManager/modManagerContext";
import { ModManager } from "./modManager/modManager";
import { LocalInstallConfig } from "@/api/rust";

export const InnerAppProviders = ({
  children,
  installConfigs,
  userSettings,
}: {
  installConfigs: LocalInstallConfig[];
  children: ReactNode;
  userSettings: Settings;
}) => {
  const [settingsManager] = useState(new SettingsManager(userSettings));
  const [modManager] = useState(
    new ModManager(installConfigs, settingsManager)
  );
  return (
    <SettingsManagerContextProvider settingsManager={settingsManager}>
      <ModManagerContextProvider modManager={modManager}>
        {children}
      </ModManagerContextProvider>
    </SettingsManagerContextProvider>
  );
};
