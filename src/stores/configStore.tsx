import { Config, setGameDirectory } from "@/api";
import { useStore, createStore } from "zustand";
import { ReactNode, createContext, useContext, useRef } from "react";

interface ConfigProps extends Config {
  gameVersion: string;
}

interface ConfigState extends ConfigProps {
  setGameDirectory: (config: string) => Promise<void>;
}

type ConfigStore = ReturnType<typeof createConfigStore>;

export const createConfigStore = (initProps: ConfigProps) => {
  return createStore<ConfigState>()((set, get) => ({
    ...initProps,
    setGameDirectory: (dir: string) => {
      return setGameDirectory(dir).then(() =>
        set(() => ({ game_directory: dir }))
      );
    },
  }));
};

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
