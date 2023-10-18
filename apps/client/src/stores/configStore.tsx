import { Config, getGameVersion, setGameDirectory } from "@/api";
import { useStore, createStore } from "zustand";
import { ReactNode, createContext, useContext, useRef } from "react";
import { NonNullableFields } from "@zenith/utils/tsmagic";
import { queryClient } from "@/lib/utils/queryClient";

interface ConfigProps extends NonNullableFields<Config> {
  gameVersion: string | null;
}

interface ConfigState extends ConfigProps {
  setGameDirectory: (dir: string) => Promise<void>;
}

export const createConfigStore = (initProps: ConfigProps) => {
  return createStore<ConfigState>()((set, _get) => ({
    ...initProps,
    setGameDirectory: (dir: string) => {
      return setGameDirectory(dir).then(() => {
        queryClient.invalidateQueries({ queryKey: ["cachedMods"] });
        queryClient.invalidateQueries({ queryKey: ["installData"] });
        console.log("invalidated");
        set(() => ({ game_directory: dir }));
        getGameVersion()
          .then((gameVersion) => set(() => ({ gameVersion })))
          .catch(console.error);
      });
    },
  }));
};

type ConfigStore = ReturnType<typeof createConfigStore>;
export const ConfigContext = createContext<ConfigStore | null>(null);

export function useConfig<T>(selector: (state: ConfigState) => T): T {
  const store = useContext(ConfigContext);
  if (!store) throw new Error("Missing ConfigContext.Provider in the tree");
  return useStore(store, selector);
}

export const ConfigContextProvider = ({
  children,
  value,
}: {
  children: ReactNode;
  value: ConfigProps;
}) => {
  const configStoreRef = useRef(createConfigStore(value));
  return (
    <ConfigContext.Provider value={configStoreRef.current}>
      {children}
    </ConfigContext.Provider>
  );
};
