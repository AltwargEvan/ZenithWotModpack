import { ReactNode, createContext, useContext } from "react";
import { SettingsManager } from "./settingsManager";

const SettingsManagerContext = createContext<SettingsManager | null>(null);

export const SettingsManagerContextProvider = ({
  settingsManager,
  children,
}: {
  settingsManager: SettingsManager;
  children: ReactNode;
}) => {
  return (
    <SettingsManagerContext.Provider value={settingsManager}>
      {children}
    </SettingsManagerContext.Provider>
  );
};

export const useSettings = () => {
  const res = useContext(SettingsManagerContext);
  if (!res)
    throw new Error(
      "useSettings must be called from within SettingsManagerContextProvider componnet."
    );
  return res;
};
