import { ReactNode, createContext, useContext, useState } from "react";
import { ModManager } from "./modManager";

const ModManagerContext = createContext<ModManager | null>(null);

export const ModManagerContextProvider = ({
  modManager,
  children,
}: {
  modManager: ModManager;
  children: ReactNode;
}) => {
  return (
    <ModManagerContext.Provider value={modManager}>
      {children}
    </ModManagerContext.Provider>
  );
};

export const useModManager = () => {
  const res = useContext(ModManagerContext);
  if (!res)
    throw new Error(
      "useModManager must be called from within ModManagerContextProvider componnet."
    );
  return res;
};
