import { ReactNode, createContext, useContext, useRef, useState } from "react";
import { ModManager } from "./modManager";

const ModManagerContext = createContext<ModManager | null>(null);

export const ModManagerContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [value] = useState(new ModManager());
  return (
    <ModManagerContext.Provider value={value}>
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
