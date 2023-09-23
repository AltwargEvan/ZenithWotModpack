import { useEffect } from "react";
import { create } from "zustand";

type RootLayoutStore = {
  title: string;
  backgroundUrl?: string;
};

export const useRootLayoutStore = create<RootLayoutStore>()(() => ({
  title: "",
}));

export const useLayout = (title: string, backgroundUrl?: string) => {
  return useEffect(() => {
    useRootLayoutStore.setState({ title, backgroundUrl });
  }, []);
};
